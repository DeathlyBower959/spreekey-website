import * as fs from 'fs'
import {
  CategoryChannel,
  Client,
  Guild,
  Snowflake,
  TextChannel,
} from 'discord.js'
import { config } from 'dotenv'
import { IArt, IDiscordImageURL, IGalleryImages } from '../../src/galleryImages'
import * as log from './logger'
import path from 'path'
config()

const client = new Client({
  intents: ['Guilds', 'MessageContent'],
})
log.initialize('1065828557370175539', client)

interface IArtYearChannels {
  main: null | Snowflake
  alt: null | Snowflake
  sketches: null | Snowflake
}
type Messages = IArt[]

async function PopulateMessages(
  year: number,
  channel?: TextChannel
): Promise<Messages> {
  return new Promise((res, rej) => {
    if (!channel) rej('Channel not found: ')

    try {
      let outMessages: Messages = []
      channel?.messages.fetch({ limit: 100 }).then(messages => {
        messages.forEach(msg => {
          if (!msg.attachments.first()?.proxyURL) return

          // TODO: Dont put media.discordapp.net (will compress json file)
          if (year >= 2023)
            outMessages.push({
              url: msg.attachments.first()?.proxyURL as IDiscordImageURL,
              month: new Date(msg.createdTimestamp).getMonth() + 1,
              day: new Date(msg.createdTimestamp).getDate(),
            })
          else
            outMessages.push({
              url: msg.attachments.first()?.proxyURL as IDiscordImageURL,
            })
        })
        res(outMessages)
      })
    } catch (err) {
      rej(err)
    }
  })
}

// TODO: Scale down images because the front end wants to kill me in my sleep and its unbelievably terrifying to the end user on their network, absolutely OBLITERATING their connection :>

function GetMessages(
  channelIDs: { [key: string]: IArtYearChannels },
  GUILD: Guild
): Promise<IGalleryImages> {
  return new Promise(async (res, rej) => {
    let out: IGalleryImages = {}
    for (let i = 0; i < Object.keys(channelIDs).length; i++) {
      const year = Object.keys(channelIDs)[i]

      let mainChannel
      let altChannel
      let sketchesChannel

      if (channelIDs[year].main)
        mainChannel = GUILD.channels.cache.get(
          channelIDs[year].main || ''
        ) as TextChannel
      if (channelIDs[year].alt)
        altChannel = GUILD.channels.cache.get(
          channelIDs[year].alt || ''
        ) as TextChannel
      if (channelIDs[year].sketches)
        sketchesChannel = GUILD.channels.cache.get(
          channelIDs[year].sketches || ''
        ) as TextChannel

      function handlePopulateError(
        type: 'Main' | 'Alt' | 'Sketch',
        reason: any
      ) {
        log.error(reason + type)
      }

      type Msgs = Messages | null | void
      let mainMessages: Msgs = await PopulateMessages(
        parseInt(year),
        mainChannel
      ).catch(r => handlePopulateError('Main', r))
      let altMessages: Msgs = await PopulateMessages(
        parseInt(year),
        altChannel
      ).catch(r => handlePopulateError('Main', r))
      let sketchesMessages: Msgs = await PopulateMessages(
        parseInt(year),
        sketchesChannel
      ).catch(r => handlePopulateError('Main', r))

      if (!mainMessages) mainMessages = []
      if (!altMessages) altMessages = []
      if (!sketchesMessages) sketchesMessages = []
      out[parseInt(year)] = {
        main: mainMessages,
        alt: altMessages,
        sketches: sketchesMessages,
      }
    }

    res(out)
  })
}

client.on('ready', async () => {
  log.time()
  log.newLine()
  log.info(`Logged in as ${client.user?.tag}!`)
  log.newLine()

  const GuildID = client.guilds.cache.map(guild => guild.id)[0]
  const GUILD = client.guilds.cache.get(GuildID)

  if (!GUILD) {
    log.error('Failed to find guild: ' + GuildID)
    log.newLine()
    return
  }

  const CATEGORIES = GUILD?.channels.cache.filter(
    channel => channel.type === 4 && channel.name.match(/[0-9]{3}/)
  )

  let channelIDs: {
    [key: string]: IArtYearChannels
  } = {}

  CATEGORIES?.forEach(cat => {
    cat = cat as CategoryChannel
    log.info(`Processing Category: ${cat.name}`)

    let channels: IArtYearChannels = {
      main: null,
      alt: null,
      sketches: null,
    }

    cat.children.cache.forEach(channel => {
      const index = channel.name.split(/[–, -]/)[1] as
        | 'main'
        | 'alt'
        | 'sketches'
      if (!['main', 'alt', 'sketches'].includes(index)) {
        log.error(
          'Failed to load channel: ' + channel.id + ' | ' + channel.name
        )
        return
      }

      log.info(
        `Channel found: ${
          index[0].toUpperCase() + index.substring(1, index.length)
        }`
      )
      channels[index] = channel.id
    })

    if (Object.values(channels).every(x => x === null)) {
      log.error('Invalid category: ' + cat.name)
      log.newLine()
      return
    }

    log.newLine()
    channelIDs[cat.name] = channels
  })

  let out: IGalleryImages = await GetMessages(channelIDs, GUILD)

  log.info('Writing data to json...')
  fs.writeFileSync(
    path.join(__dirname, '../../src/galleryImages.json'),
    JSON.stringify(out),
    {
      flag: 'w+',
    }
  )
  log.info('Write completed')
  await log.writeLog()
  process.exit(0)
})

client.login(process.env.DISCORD_TOKEN)
