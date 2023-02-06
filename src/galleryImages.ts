import { z } from 'zod'
import { YEAR_RANGE } from './config'

export interface IGalleryImages {
  [key: number]: IArtYear
}

export interface IArtYear {
  main?: IArt[]
  alt?: IArt[]
  sketches?: IArt[]
}

export interface IArt {
  url: IDiscordImagePath
  dims: [number, number]
  month?: number
  day?: number

  sector?: string
}

export interface IArtWithSector extends IArt {
  sector: string
}

export type IDiscordImageID = `${number}/${number}`
export type IDiscordImagePath = `${IDiscordImageID}/${string}`
export type IDiscordImageURL =
  `https://media.discordapp.net/attachments/${IDiscordImagePath}`

export const DiscordImagePathID = /([0-9]+)\/([0-9]+)/
export const DiscordImagePathRegex = /([0-9]+)\/([0-9]+)\/[A-z,0-9,-]+.[A-z]+/
export const DiscordImageURLRegex =
  /https:\/\/media.discordapp.net\/attachments\/([0-9]+)\/([0-9]+)\/[A-z,0-9,-]+.[A-z]+/

export const ArtSchema = z.object({
  url: z.string().regex(DiscordImagePathRegex),
  dims: z.array(z.number()).length(2),
  month: z.number().min(1).max(12).optional(),
  day: z.number().min(1).max(31).optional(),
})

export const ArtYearSchema = z.object({
  main: z.array(ArtSchema).optional(),
  alt: z.array(ArtSchema).optional(),
  sketches: z.array(ArtSchema).optional(),
})

let yearSchema: { [key: string]: typeof ArtYearSchema } = {}
for (let i = YEAR_RANGE[0]; i <= YEAR_RANGE[1]; i++) {
  yearSchema[i] = ArtYearSchema
}
export const GalleryImagesSchema = z.object(yearSchema)
