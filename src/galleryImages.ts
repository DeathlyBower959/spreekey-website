import { z } from 'zod'

export interface IGalleryImages {
  [key: number]: ArtYear
}

export interface ArtYear {
  main: string[]
  alt: string[]
  sketches: string[]
}

export const YearSchema = z.object({
  main: z.array(z.string()),
  alt: z.array(z.string()),
  sketches: z.array(z.string()),
})

// IMPORTANT: UPDATE WHEN YEAR_RANGE IS CHANGED
export const GalleryImagesSchema = z.object({
  '2022': YearSchema,
  '2021': YearSchema,
  '2020': YearSchema,
  '2019': YearSchema,
  '2018': YearSchema,
  '2017': YearSchema,
})
