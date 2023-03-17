import Masonry from 'react-masonry-css';
import { useEffect, useState } from 'react';
import { ScrollPosition } from 'react-lazy-load-image-component';
import styled from 'styled-components';
import LazyGalleryImage from '../atoms/LazyGalleryImage';
import { IMAGE_COMPRESSION } from '../config';
import {
  DiscordImagePathIDRegex,
  IArt,
  IDiscordImagePath,
  IGalleryImages,
  ISectorKey,
} from '../galleryImages';
import { formatURL } from '../pages/Gallery';
import { Link } from 'react-router-dom';

interface IProps {
  GALLERY_IMAGES: IGalleryImages;
  yearFilter: string | undefined;
  sectorFilter: string | undefined;
  scrollPosition: ScrollPosition;
  favoriteArt: IDiscordImagePath[];
  setFavoriteArt: React.Dispatch<React.SetStateAction<IDiscordImagePath[]>>;
  isFavoritesURL: boolean;
}
interface IGalleryItem {
  scrollPosition: ScrollPosition;
  year: number;
  imageData: IArt;
  sector: string;
  ID: string;
  favoriteArt: IDiscordImagePath[];
  setFavoriteArt: React.Dispatch<React.SetStateAction<IDiscordImagePath[]>>;
  ratio: number;
}
type IGalleryItems = IGalleryItem[];

function GalleryImages({
  GALLERY_IMAGES,
  yearFilter,
  sectorFilter,
  scrollPosition,
  favoriteArt,
  setFavoriteArt,
  isFavoritesURL = false,
}: IProps) {
  const [items, setItems] = useState<IGalleryItems>([]);

  useEffect(() => {
    const filteredYears = Object.keys(GALLERY_IMAGES)
      .filter(x => (yearFilter ? x === yearFilter : true))
      .sort((a, b) => (parseInt(a) < parseInt(b) ? 1 : -1));

    const output = filteredYears.map(year => {
      const filteredArtYear = Object.keys(
        GALLERY_IMAGES[parseInt(year)]
      ).filter(x => (sectorFilter ? x === sectorFilter : true));

      return filteredArtYear
        .map(sector => {
          const filteredSector = GALLERY_IMAGES[parseInt(year)][
            sector as ISectorKey
          ]?.sort(
            (a, b) =>
              +new Date(`${b.month}/${b.day}`) -
              +new Date(`${a.month}/${a.day}`)
          );

          if (!filteredSector) return null;

          return filteredSector
            .map(imageData => {
              if (!imageData || !DiscordImagePathIDRegex.test(imageData.url)) {
                console.error('Failed to load: ' + imageData);
                return null;
              }

              const ID = imageData.url.match(
                DiscordImagePathIDRegex
              )?.[0] as string;

              if (
                isFavoritesURL &&
                !favoriteArt.includes(ID as IDiscordImagePath)
              )
                return null;

              const ratio = imageData.dims[1] / imageData.dims[0];

              return {
                scrollPosition,
                year: parseInt(year),
                imageData,
                sector,
                ID,
                favoriteArt,
                setFavoriteArt,
                ratio,
              };
            })
            .filter(Boolean);
        })
        .filter(Boolean);
    });
    setItems(output.flat(2));
  }, [
    GALLERY_IMAGES,
    yearFilter,
    sectorFilter,
    scrollPosition,
    isFavoritesURL,
    favoriteArt,
    setFavoriteArt,
  ]);

  if (isFavoritesURL && items.length === 0)
    return <NoFavorites to='/gallery'>No favorites...</NoFavorites>;

  return (
    <MasonryGallery
      breakpointCols={{
        default: 4,
        1500: 3,
        900: 2,
        650: 1,
      }}
      className='gallery-masonry-grid'
      columnClassName='gallery-masonry-grid_column'
    >
      {items.map(
        ({
          ID,
          favoriteArt,
          imageData,
          ratio,
          scrollPosition,
          sector,
          setFavoriteArt,
          year,
        }) => (
          <LazyGalleryImage
            scrollPosition={scrollPosition}
            year={year}
            month={imageData.month}
            day={imageData.day}
            sector={sector}
            key={ID}
            ID={ID}
            favoriteToggle={() => {
              if (favoriteArt.includes(ID as IDiscordImagePath))
                setFavoriteArt(prev => prev.filter(x => x !== ID));
              else setFavoriteArt(prev => [...prev, ID as IDiscordImagePath]);
            }}
            favorite={favoriteArt.includes(ID as IDiscordImagePath)}
            initial={formatURL(imageData.url, ratio, IMAGE_COMPRESSION.preview)}
            src={formatURL(imageData.url, ratio, IMAGE_COMPRESSION.default)}
          />
        )
      )}
    </MasonryGallery>
  );
}

const NoFavorites = styled(Link)`
  position: absolute;
  left: 50%;
  top: 50%;
  translate: -50% -50%;

  font-size: 3em;
  font-weight: bolder;
  text-decoration: none;
  color: inherit;
`;

const MasonryGallery = styled(Masonry)`
  display: flex;
  margin-left: calc(var(--masonry-gutter-size) * -1);
  width: 100%;
  & > div {
    padding-left: var(--masonry-gutter-size);
    background-clip: padding-box;
  }
  & > div > img {
    margin-bottom: var(--masonry-gutter-size);
  }
`;

export default GalleryImages;
