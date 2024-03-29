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
  IArtLocation,
  IArt,
  IArtYear,
  IDiscordImageURL,
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
  main: Snowflake | null;
  alt: Snowflake | null;
  sketches: Snowflake | null;
}
interface TotalCount {
  main: number;
  alt: number;
  sketches: number;
}
type SectorKey = keyof IArtYear;
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
          const url = (
            attachment.contentType === 'image/gif'
              ? attachment.url
              : attachment.proxyURL
          ) as IDiscordImageURL;

          if (!url) {
            ImageLog.error(`No image URL: ${msg.url}`);
            return;
          }

          let probeResult: probe.ProbeResult | null = null;

          if (attachment.contentType !== 'image/gif')
            probeResult = (await probe(url).catch(err => {
              ImageLog.error('Failed to load image: ', url, err);
            })) as probe.ProbeResult;

          // Defaults in case of probe failure
          if (!probeResult)
            probeResult = {
              width: 1080,
              height: 720,
            } as probe.ProbeResult;

          const { width, height } = probeResult;

          const dims: [number, number] = [width, height];

          let data: Messages[0] = {
            url,
            dims,
          };

          if (year >= 2023)
            data = {
              ...data,
              month: new Date(msg.createdTimestamp).getMonth() + 1,
              day: new Date(msg.createdTimestamp).getDate(),
            };

          outMessages.push(data);
        });
      });
      res(outMessages);
    } catch (err) {
      rej(err);
    }
  });
}

function handlePopulateError(type: IArtLocation, reason: string) {
  Log.error(reason + type);
}
async function GetMessages(
  channelIDs: { [key: string]: IArtYearChannels },
  GUILD: Guild
): Promise<IGalleryImages> {
  let out: IGalleryImages = {};
  for (let i = Object.keys(channelIDs).length - 1; i >= 0; i--) {
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
    ).catch(r => handlePopulateError('main', r));

    let altMessages: Msgs = await PopulateMessages(
      parseInt(year),
      altChannel
    ).catch(r => handlePopulateError('alt', r));

    let sketchesMessages: Msgs = await PopulateMessages(
      parseInt(year),
      sketchesChannel
    ).catch(r => handlePopulateError('sketches', r));

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

  const CATEGORIES = GUILD?.channels.cache
    .filter(channel => channel.type === 4 && channel.name.match(/[0-9]{3}/))
    .sort((chanA, chanB) => parseInt(chanB.name) - parseInt(chanA.name));

  if (CATEGORIES?.size <= 0) {
    BotLog.error('Failed to find categories');
    return;
  }

  let channelIDs: {
    [key: string]: IArtYearChannels;
  } = {};

  const ArtLocations: IArtLocation[] = ['main', 'alt', 'sketches'];
  CATEGORIES.forEach(cat => {
    cat = cat as CategoryChannel;
    Log.info(`Processing Category: ${cat.name}`);

    let channels: IArtYearChannels = {
      main: null,
      alt: null,
      sketches: null,
    };

    cat.children.cache.forEach(channel => {
      const index = channel.name.split(/[–, -]/)[1] as IArtLocation;

      if (!ArtLocations.includes(index)) {
        Log.error(
          'Failed to load channel: ' + channel.id + ' | ' + channel.name
        );
        return;
      }

      Log.info(
        `Channel found: ${
          channel.name[0].toUpperCase() +
          channel.name.substring(1, channel.name.length)
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
// FIX: 2023 sketches not loading? (gives different art count each time)
