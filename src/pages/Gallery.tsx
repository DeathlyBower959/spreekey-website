// Packages
import styled from 'styled-components';
import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import Masonry from 'react-masonry-css';
import { motion } from 'framer-motion';
import {
  ScrollPosition,
  trackWindowScroll,
} from 'react-lazy-load-image-component';
import { isMobile } from 'react-device-detect';
import { ImHeart } from 'react-icons/im';
import FocusedGalleryImage from '../atoms/FocusedGalleryImage';

// Config
import { IMAGE_COMPRESSION, YEAR_RANGE } from '../config';
import GalleryImages from '../galleryImages.json';
import {
  DiscordImagePathIDRegex,
  GalleryImagesSchema,
  IArt,
  IArtLocation,
  IDiscordImageID,
  IDiscordImageIDHyphenated,
  IDiscordImagePath,
  IDiscordImageURL,
  IGalleryImages,
} from '../galleryImages';

// Atoms
import LazyGalleryImage from '../atoms/LazyGalleryImage';
import Notification from '../atoms/Notification';

// Hooks
import useLocalStorage from '../hooks/useLocalStorage';

// Util
import capitalize from '../util/upperCaseFirst';
import limitNumberWithinRange from '../util/limitNum';
import Loader from '../atoms/loaders/Loader';

const GALLERY_IMAGES = GalleryImagesSchema.parse(
  GalleryImages
) as IGalleryImages;

function formatURL(
  url: IDiscordImageURL | undefined,
  ratio: number,
  compression: number
) {
  if (!url) return null;

  const WIDTH = limitNumberWithinRange(
    window.innerWidth / compression,
    500,
    1800
  );

  return `${url}?width=${Math.ceil(WIDTH)}&height=${Math.ceil(
    WIDTH * ratio
  )}` as IDiscordImageURL;
}
function RenderYearSidebar(sector: IArtLocation = 'main') {
  let out = [];

  for (let i = YEAR_RANGE[1]; i >= YEAR_RANGE[0]; i--) {
    out.push(
      <SidebarYear to={`/gallery/${i}/${sector}`} key={i}>
        {i}
      </SidebarYear>
    );
  }

  return out;
}
// TODO: Improve sorting, ignoring sector
// TODO: react-window
function RenderGalleryImages(
  yearFilter: string | undefined,
  sectorFilter: string | undefined,
  scrollPosition: ScrollPosition,
  favoriteArt: IDiscordImagePath[],
  setFavoriteArt: React.Dispatch<React.SetStateAction<IDiscordImagePath[]>>,
  isFavoritesURL: boolean = false
) {
  return Object.keys(GALLERY_IMAGES)
    .filter(x => (yearFilter ? x === yearFilter : true))
    .sort((a, b) => (parseInt(a) < parseInt(b) ? 1 : -1))
    .map(year =>
      Object.keys(GALLERY_IMAGES[parseInt(year)])
        .filter(x => (sectorFilter ? x === sectorFilter : true))
        .map(sector =>
          GALLERY_IMAGES[parseInt(year)][sector as ISectorKey]
            ?.sort(
              (a, b) =>
                +new Date(`${b.month}/${b.day}`) -
                +new Date(`${a.month}/${a.day}`)
            )
            .map(imageData => {
              if (
                !imageData ||
                !imageData.url.match(DiscordImagePathIDRegex)?.[0]
              ) {
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

              return (
                <LazyGalleryImage
                  scrollPosition={scrollPosition}
                  year={parseInt(year)}
                  month={imageData.month}
                  day={imageData.day}
                  sector={sector}
                  key={ID}
                  ID={ID}
                  favoriteToggle={() => {
                    if (favoriteArt.includes(ID as IDiscordImagePath))
                      setFavoriteArt(prev => prev.filter(x => x !== ID));
                    else
                      setFavoriteArt(prev => [
                        ...prev,
                        ID as IDiscordImagePath,
                      ]);
                  }}
                  favorite={favoriteArt.includes(ID as IDiscordImagePath)}
                  initial={formatURL(
                    imageData.url,
                    ratio,
                    IMAGE_COMPRESSION.preview
                  )}
                  src={formatURL(
                    imageData.url,
                    ratio,
                    IMAGE_COMPRESSION.default
                  )}
                />
              );
            })
        )
    )
    .filter(x => x !== null);
}

// Types
interface IProps {
  scrollPosition: ScrollPosition;
  isFavoritesURL?: boolean;
}
interface IYearBar {
  isHidden: boolean;
}
interface IFetchedArt extends IArt {
  year: number;
  ID: IDiscordImageID;
  ratio: [number, number];

  isClosed: boolean;
}
interface IImageFocusOverlayWrapper {
  isShown: boolean;
}
type ISectorKey = keyof typeof GALLERY_IMAGES['2023'];

// Main
function Gallery({ scrollPosition, isFavoritesURL }: IProps) {
  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const [favoriteArt, setFavoriteArt] = useLocalStorage<IDiscordImagePath[]>(
    'favorited_art',
    []
  );

  let {
    year: yearFilter,
    sector: sectorFilter,
    imageId,
  } = useParams<{
    year: string;
    sector: IArtLocation;
    imageId: IDiscordImageIDHyphenated;
  }>();

  // State
  const dropdownRef = useRef<HTMLSelectElement>(null);
  const [fetchedArt, setFetchedArt] = useState<IFetchedArt | null>(null);

  const sectorKeys: ISectorKey[] = ['alt', 'main', 'sketches'];
  if (
    !yearFilter?.match(/^\d{4}$/)?.[0] ||
    parseInt(yearFilter) < YEAR_RANGE[0] ||
    parseInt(yearFilter) > YEAR_RANGE[1] ||
    !sectorKeys.includes(sectorFilter as ISectorKey)
  ) {
    yearFilter = undefined;
    sectorFilter = undefined;
  }

  useEffect(() => {
    if (!imageId)
      setFetchedArt(prev => {
        if (prev === null) return prev;

        return {
          ...prev,
          isClosed: true,
        };
      });

    let fetched: IFetchedArt | null = null;

    Object.keys(GALLERY_IMAGES).every(year =>
      Object.keys(GALLERY_IMAGES[parseInt(year)]).every(sector =>
        GALLERY_IMAGES[parseInt(year)][sector as ISectorKey]?.every(
          imageData => {
            if (
              imageData.url.match(DiscordImagePathIDRegex)?.[0] ===
              imageId?.split('-').join('/')
            ) {
              const ratio = imageData.dims;

              fetched = {
                ...imageData,
                year: parseInt(year),
                sector,
                ID: imageData.url.match(
                  DiscordImagePathIDRegex
                )?.[0] as IDiscordImageID,
                ratio,
                isClosed: false,
              };
              return false;
            }

            return true;
          }
        )
      )
    );

    if (fetched) setFetchedArt(fetched);
  }, [imageId]);

  // Effect
  useEffect(() => {
    if (!sectorFilter || !dropdownRef.current) return;

    const ArtLocations: IArtLocation[] = ['main', 'alt', 'sketches'];

    if (ArtLocations.includes(sectorFilter))
      dropdownRef.current.value = capitalize(sectorFilter);
    else navigate(`/gallery/${yearFilter}/main`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectorFilter]);

  // Events
  function handleLinkClick(e: React.MouseEvent<HTMLHeadingElement>) {
    navigate(
      `/gallery/${yearFilter || YEAR_RANGE[1]}/${
        e.currentTarget.innerText.toLowerCase() || 'main'
      }`
    );
  }

  return (
    <Wrapper>
      <Sidebar>
        <YearWrapper>{RenderYearSidebar(sectorFilter)}</YearWrapper>
        <Link to='/gallery/favorites'>
          <HeartButton />
        </Link>
        <br />
        <Link to='/gallery'>
          <HomeButton />
        </Link>
      </Sidebar>
      <Main>
        <YearBar isHidden={!yearFilter}>
          <SelectedYear>{yearFilter || ''}</SelectedYear>
          <SelectorWrapper>
            <SelectedSector onClick={handleLinkClick}>
              Main
              {sectorFilter === 'main' && <ActiveUnderline />}
            </SelectedSector>
            <SelectedSector onClick={handleLinkClick}>
              Sketches
              {sectorFilter === 'sketches' && <ActiveUnderline />}
            </SelectedSector>
            <SelectedSector onClick={handleLinkClick}>
              Alt
              {sectorFilter === 'alt' && <ActiveUnderline />}
            </SelectedSector>
          </SelectorWrapper>
        </YearBar>
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
          {RenderGalleryImages(
            yearFilter,
            sectorFilter,
            scrollPosition,
            favoriteArt,
            setFavoriteArt,
            isFavoritesURL
          )}
        </MasonryGallery>

        <ImageFocusOverlayWrapper
          isShown={fetchedArt?.isClosed === false}
          onClick={() =>
            navigate(location.pathname.replace(/[0-9]+-[0-9]+/, ''))
          }
        >
          {fetchedArt?.isClosed === false && <Loader />}
          <FocusedGalleryImage
            year={fetchedArt?.year}
            month={fetchedArt?.month}
            day={fetchedArt?.day}
            sector={fetchedArt?.sector}
            key={fetchedArt?.ID}
            ID={fetchedArt?.ID || ''}
            favoriteToggle={() => {
              if (favoriteArt.includes(fetchedArt?.ID as IDiscordImagePath))
                setFavoriteArt(prev => prev.filter(x => x !== fetchedArt?.ID));
              else
                setFavoriteArt(prev => [
                  ...prev,
                  fetchedArt?.ID as IDiscordImagePath,
                ]);
            }}
            favorite={favoriteArt.includes(fetchedArt?.ID as IDiscordImagePath)}
            ratio={fetchedArt?.ratio || [1, 1]}
            src={formatURL(
              fetchedArt?.url,
              (fetchedArt?.ratio[1] || 1) / (fetchedArt?.ratio[0] || 1),
              IMAGE_COMPRESSION.default
            )}
          />
        </ImageFocusOverlayWrapper>

        {!localStorage.getItem('spreekey-has_double_tapped_to_favorite') && (
          <>
            {isMobile ? (
              <Notification>
                Tip: Tap the plus sign to bring up a larger preview, or double
                tap to favorite them!
              </Notification>
            ) : (
              <Notification>
                Tip: Tap images to bring up a larger preview, or double tap to
                favorite them!
              </Notification>
            )}
          </>
        )}
      </Main>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  min-height: ${isMobile ? 'calc(100vh - 5em)' : '100vh'};
`;

// Sidebar
const Sidebar = styled.div`
  width: 0;
  text-align: center;

  background-color: var(--secondary-background);

  padding-top: 3em;
  padding-bottom: 2em;

  transition: width 750ms ease;
  overflow: hidden;

  height: ${isMobile ? 'calc(100vh - 5em)' : '100vh'};

  display: flex;
  flex-direction: column;

  position: fixed;
  left: 0;
  top: ${isMobile ? '5em' : '0'};

  &::after {
    display: block;

    content: '';
    position: fixed;
    width: 1em;
    height: 4em;
    background-color: inherit;
    top: 15%;

    left: -2px;
    border-left: 2px solid var(--tertiary-background);

    border-radius: 0 8px 8px 0;

    transition: left 750ms ease;
  }

  &:hover::after {
    left: 10em;
  }
  &:hover {
    width: 10em;
  }

  @media only screen and (max-width: 500px) {
    &:hover::after {
      left: 75vw;
    }
    &:hover {
      width: 75vw;
    }
    padding-top: 0;
  }

  z-index: 2;
`;
const YearWrapper = styled.div`
  display: flex;
  flex-direction: column;

  gap: 5em;

  align-items: center;
  height: 100%;

  padding: 2em 0 2em 0;
  margin-top: 2em;
  margin-bottom: 2em;

  overflow-x: hidden;
  overflow-y: auto;

  /* @media only screen and (max-width: 768px) {
    flex-direction: row;
    padding: 0 2em 0 2em;

    overflow-x: auto;
    overflow-y: hidden;
    margin: 1em 3em 1em 0;
  } */
`;

const HomeButton = styled(AiFillHome)`
  width: 4em;
  height: 4em;

  color: var(--secondary-foreground);
`;
const HeartButton = styled(ImHeart)`
  width: 4em;
  height: 4em;

  color: var(--secondary-foreground);
`;
const SidebarYear = styled(Link)`
  width: min-content;

  text-decoration: none;

  font-size: 2em;
  font-weight: bold;

  &:link,
  &:visited,
  &:active {
    color: inherit;
  }

  @media only screen and (min-width: 768px) {
    rotate: 90deg;
  }
`;

// Main
const Main = styled.div`
  flex-grow: 1;

  display: flex;
  flex-direction: column;
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

// Year Bar
const YearBar = styled.div<IYearBar>`
  height: ${props => (props.isHidden ? '0' : '10em')};
  background-color: var(--tertiary-background);
  overflow: hidden;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
`;
const SelectorWrapper = styled.div`
  display: flex;
  gap: 1em;
`;
const SelectedYear = styled.h1`
  font-size: 4em;
`;
const SelectedSector = styled.h3`
  cursor: pointer;
  position: relative;
`;
const ActiveUnderline = styled(motion.div).attrs({
  layoutId: 'gallery-underline',
})`
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;

  background-color: var(--foreground);
`;

// Image Focus Overlay
const ImageFocusOverlayWrapper = styled.div<IImageFocusOverlayWrapper>`
  opacity: 0;
  pointer-events: none;

  background-color: #000000aa;
  position: fixed;
  left: 0;
  top: ${isMobile ? '5em' : '0'};
  width: 100vw;
  height: calc(100vh - ${isMobile ? '5em' : '0px'});

  display: flex;
  justify-content: center;
  align-items: center;

  transition: 250ms opacity ease-out;
  ${props =>
    props.isShown &&
    `
    transition: 500ms opacity ease-out;
    pointer-events: all;
    opacity: 1;
  `}
`;

export default trackWindowScroll(Gallery);
