import { z } from 'zod';
import { YEAR_RANGE } from './config';

export interface IGalleryImages {
  [key: number]: IArtYear;
}

export interface IArtYear {
  main?: IArt[];
  alt?: IArt[];
  sketches?: IArt[];
}
export type IArtLocation = keyof IArtYear;

export interface IArt {
  url: IDiscordImageURL;
  dims: [number, number];
  month?: number;
  day?: number;

  sector?: string;
}

export interface IArtWithSector extends IArt {
  sector: string;
}
export type ISectorKey = keyof IGalleryImages['2023'];

export type IDiscordImageID<Delimiter extends string = '/'> =
  `${number}${Delimiter}${number}`;
export type IDiscordImagePath = `${IDiscordImageID}/${string}`;
export type IDiscordImageURL =
  | `https://media.discordapp.net/attachments/${IDiscordImagePath}`
  | `https://cdn.discordapp.com/attachments/${IDiscordImagePath}`;

export const DiscordImagePathIDRegex = new RegExp('([0-9]+)/([0-9]+)');
export const DiscordImagePathRegex = new RegExp(
  DiscordImagePathIDRegex.source + '/[A-z,0-9,-]+.[A-z]+'
);
export const DiscordImageURLRegex = new RegExp(
  'https://(media|cdn).discordapp.(net|com)/attachments/' +
    DiscordImagePathRegex.source
);
export const ArtSchema = z.object({
  url: z.string().regex(DiscordImageURLRegex),
  dims: z.array(z.number()).length(2),
  month: z.number().min(1).max(12).optional(),
  day: z.number().min(1).max(31).optional(),
});

export const ArtYearSchema = z.object({
  main: z.array(ArtSchema).optional(),
  alt: z.array(ArtSchema).optional(),
  sketches: z.array(ArtSchema).optional(),
});

let yearSchema: { [key: string]: typeof ArtYearSchema } = {};
for (let i = YEAR_RANGE[0]; i <= YEAR_RANGE[1]; i++) {
  yearSchema[i] = ArtYearSchema;
}
export const GalleryImagesSchema = z.object(yearSchema);
