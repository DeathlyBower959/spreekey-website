import * as fs from 'fs';
import path from 'path';

import probe from 'probe-image-size';
import { config } from 'dotenv';

import {
  CategoryChannel,
  Client,
  Guild,
  Message,
  Snowflake,
  TextChannel,
} from 'discord.js';

import {
  IArt,
  IArtYear,
  IDiscordImagePath,
  IGalleryImages,
} from '../../src/galleryImages';
import Logger from './logger';
config();

const client = new Client({
  intents: ['Guilds', 'MessageContent'],
});

const LogsCategoryID = '1066224035526098974';
const Log = new Logger('Logs', LogsCategoryID, client);
const BotLog = new Logger('Bot', LogsCategoryID, client);
const ImageLog = new Logger('Image', LogsCategoryID, client);

interface IArtYearChannels {
  main: null | Snowflake;
  alt: null | Snowflake;
  sketches: null | Snowflake;
}
type Messages = IArt[];

async function FetchAllMessages(channel?: TextChannel): Promise<Message[]> {
  if (!channel) {
    Log.error('No channel provided');
    return [];
  }

  let messages: Message[] = [];
  let lastID: string | undefined;

  while (true) {
    const fetchedMessages = await channel.messages.fetch({
      limit: 100,
      ...(lastID && { before: lastID }),
    });

    if (fetchedMessages.size === 0) break;

    messages = [...messages, ...fetchedMessages.values()];
    lastID = fetchedMessages.lastKey();
  }

  Log.info(`Messages (${channel.name}): ${messages.length}`);
  return messages;
}

function PopulateMessages(
  year: number,
  channel?: TextChannel
): Promise<Messages> {
  return new Promise(async (res, rej) => {
    if (!channel) return rej('Channel not found: ');

    try {
      let outMessages: Messages = [];

      const messages = await FetchAllMessages(channel);

      if (messages.length === 0) return rej(`Messages not found: `);
      messages.forEach(msg => {
        const attachments = msg.attachments;
        if (attachments?.size === 0) {
          Log.warn(`No attachments: ${msg.url}`);
          return;
        }

        attachments.forEach(async attachment => {
          const URL = attachment.proxyURL.match(
            /([0-9]+)\/([0-9]+)\/[A-z,0-9,-]+.[A-z]+/
          )?.[0] as IDiscordImagePath;

          if (!URL) {
            ImageLog.error(`No image URL: ${msg.url}`);
          }

          const probeResult = await probe(
            `https://media.discordapp.net/attachments/${URL}`
          ).catch(err => {
            ImageLog.error('Failed to load image: ', URL, err);
          });

          if (!probeResult) return;

          const { width, height } = probeResult;

          const dims: [number, number] = [width, height];

          let data: Messages[0] = {
            url: URL,
            dims,
          };

          if (year >= 2023)
            data = {
              ...data,
              month: new Date(msg.createdTimestamp).getMonth() + 1,
              day: new Date(msg.createdTimestamp).getDate(),
            };

          outMessages.push(data);
          ImageLog.noConsole().info(
            `Image added:`,
            `https://media.discordapp.net/attachments/${URL}`,
            `WxH: ${width}x${height}`
          );
        });

        res(outMessages);
      });
    } catch (err) {
      rej(err);
    }
  });
}

function handlePopulateError(type: 'Main' | 'Alt' | 'Sketches', reason: any) {
  Log.error(reason + type);
}
async function GetMessages(
  channelIDs: { [key: string]: IArtYearChannels },
  GUILD: Guild
): Promise<IGalleryImages> {
  let out: IGalleryImages = {};
  for (let i = 0; i < Object.keys(channelIDs).length; i++) {
    const year = Object.keys(channelIDs)[i];

    let mainChannel;
    let altChannel;
    let sketchesChannel;

    Log.info(
      year,
      'main: ' + channelIDs[year].main,
      'alt: ' + channelIDs[year].alt,
      'sketches: ' + channelIDs[year].sketches
    );

    if (channelIDs[year].main)
      mainChannel = GUILD.channels.cache.get(
        channelIDs[year].main || ''
      ) as TextChannel;
    if (channelIDs[year].alt)
      altChannel = GUILD.channels.cache.get(
        channelIDs[year].alt || ''
      ) as TextChannel;
    if (channelIDs[year].sketches)
      sketchesChannel = GUILD.channels.cache.get(
        channelIDs[year].sketches || ''
      ) as TextChannel;

    type Msgs = Messages | null | void;
    let mainMessages: Msgs = await PopulateMessages(
      parseInt(year),
      mainChannel
    ).catch(r => handlePopulateError('Main', r));

    let altMessages: Msgs = await PopulateMessages(
      parseInt(year),
      altChannel
    ).catch(r => handlePopulateError('Alt', r));

    let sketchesMessages: Msgs = await PopulateMessages(
      parseInt(year),
      sketchesChannel
    ).catch(r => handlePopulateError('Sketches', r));

    if (!mainMessages) mainMessages = [];
    if (!altMessages) altMessages = [];
    if (!sketchesMessages) sketchesMessages = [];

    out[parseInt(year)] = {
      main: mainMessages,
      alt: altMessages,
      sketches: sketchesMessages,
    };

    Log.newLine();
  }

  return out;
}

client.on('ready', async () => {
  BotLog.info(`Logged in as ${client.user?.tag}!`);

  const GuildID = client.guilds.cache.map(guild => guild.id)[0];
  const GUILD = client.guilds.cache.get(GuildID);

  if (!GUILD) {
    BotLog.newLine().error('Failed to find guild: ' + GuildID);
    return;
  }

  const CATEGORIES = GUILD?.channels.cache.filter(
    channel => channel.type === 4 && channel.name.match(/[0-9]{3}/)
  );

  let channelIDs: {
    [key: string]: IArtYearChannels;
  } = {};

  CATEGORIES?.forEach(cat => {
    cat = cat as CategoryChannel;
    Log.info(`Processing Category: ${cat.name}`);

    let channels: IArtYearChannels = {
      main: null,
      alt: null,
      sketches: null,
    };

    cat.children.cache.forEach(channel => {
      const index = channel.name.split(/[–, -]/)[1] as
        | 'main'
        | 'alt'
        | 'sketches';
      if (!['main', 'alt', 'sketches'].includes(index)) {
        Log.error(
          'Failed to load channel: ' + channel.id + ' | ' + channel.name
        );
        return;
      }

      Log.info(
        `Channel found: ${
          index[0].toUpperCase() + index.substring(1, index.length)
        }`
      );
      channels[index] = channel.id;
    });

    if (Object.values(channels).every(x => x === null)) {
      Log.error('Invalid category: ' + cat.name).newLine();
      return;
    }

    Log.newLine();
    channelIDs[cat.name] = channels;
  });

  let out: IGalleryImages = await GetMessages(channelIDs, GUILD);

  interface TotalCount {
    main: number;
    alt: number;
    sketches: number;
  }
  type SectorKey = keyof IArtYear;
  const totals: TotalCount = Object.values(out).reduce(
    (totalAccumulator: TotalCount, year: IArtYear) => {
      let accumulated = totalAccumulator;
      Object.keys(totalAccumulator).forEach(sector => {
        const total =
          accumulated[sector as keyof TotalCount] +
          (year[sector as SectorKey]?.length || 0);

        accumulated[sector as SectorKey] = total;
      });

      return accumulated;
    },
    {
      main: 0,
      alt: 0,
      sketches: 0,
    }
  );

  Log.info(
    `Total Art: ${totals.main + totals.alt + totals.sketches}`,
    `Main: ${totals.main}`,
    `Alt: ${totals.alt}`,
    `Sketches: ${totals.sketches}`
  ).newLine();
  // BotLog.raw(`<@${process.env.PING_ID}>`)

  Log.info('Writing data to json...');
  try {
    fs.writeFileSync(
      path.join(__dirname, '../../src/galleryImages.json'),
      JSON.stringify(out),
      {
        flag: 'w+',
      }
    );
    Log.info('Write completed');
  } catch (err) {
    Log.error('Failed to write data');
  }

  await BotLog.write();
  await Log.write();
  await ImageLog.write();

  process.exit(0);
});

client.login(process.env.DISCORD_TOKEN);
