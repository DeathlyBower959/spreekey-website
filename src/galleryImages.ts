import { z } from 'zod'

export interface IGalleryImages {
  [key: number]: IArtYear
}

export interface IArtYear {
  main?: IDiscordImageURL[]
  alt?: IDiscordImageURL[]
  sketches?: IDiscordImageURL[]
}

export type IDiscordImageURL =
  `https://cdn.discordapp.com/attachments/${number}/${number}/${string}`

export const DiscordImageURLRegex =
  /https:\/\/cdn.discordapp.com\/attachments\/([0-9]+)\/([0-9]+)\/[A-z,0-9,-]+.[A-z]+/

export const YearSchema = z.object({
  main: z.array(z.string().regex(DiscordImageURLRegex)).optional(),
  alt: z.array(z.string().regex(DiscordImageURLRegex)).optional(),
  sketches: z.array(z.string().regex(DiscordImageURLRegex)).optional(),
})

// IMPORTANT: UPDATE WHEN YEAR_RANGE IS CHANGED
export const GalleryImagesSchema = z.object({
  '2023': YearSchema,
  '2022': YearSchema,
  '2021': YearSchema,
  '2020': YearSchema,
  '2019': YearSchema,
  '2018': YearSchema,
  '2017': YearSchema,
})

// TODO: Discord thing
//  - media.discordapp.net not cdn.discordapp.com
//  - both ?width=&height=

// TODO: Make TS discord.js script
//  Run on github action every day
//  - Login with bot token
//  - Loop through categories/channels
//  - Grab images
//  - Add to json file
