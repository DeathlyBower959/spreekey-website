import { z } from 'zod'

export interface IGalleryImages {
  [key: number]: IArtYear
}

export interface IArtYear {
  main?: IArt[]
  alt?: IArt[]
  sketches?: IArt[]
}

export interface IArt {
  url: IDiscordImageURL
  month?: number
  day?: number
}

export type IDiscordImageURL =
  `https://media.discordapp.net/attachments/${number}/${number}/${string}`

export const DiscordImageURLRegex =
  /https:\/\/media.discordapp.net\/attachments\/([0-9]+)\/([0-9]+)\/[A-z,0-9,-]+.[A-z]+/

export const ArtSchema = z.object({
  url: z.string().regex(DiscordImageURLRegex),
  month: z.number().optional(),
  day: z.number().optional(),
})

export const ArtYearSchema = z.object({
  main: z.array(ArtSchema).optional(),
  alt: z.array(ArtSchema).optional(),
  sketches: z.array(ArtSchema).optional(),
})

// IMPORTANT: UPDATE WHEN YEAR_RANGE IS CHANGED
export const GalleryImagesSchema = z.object({
  '2023': ArtYearSchema,
  '2022': ArtYearSchema,
  '2021': ArtYearSchema,
  '2020': ArtYearSchema,
  '2019': ArtYearSchema,
  '2018': ArtYearSchema,
  '2017': ArtYearSchema,
})

// TODO: Discord thing
//  - media.discordapp.net not cdn.discordapp.com
//  - both ?width=&height=
