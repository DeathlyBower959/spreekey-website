// Packages
import { z } from 'zod';
import styled, { css } from 'styled-components';
import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { motion } from 'framer-motion';
import {
  ScrollPosition,
  trackWindowScroll,
} from 'react-lazy-load-image-component';
import { isMobile } from 'react-device-detect';
import { ImHeart } from 'react-icons/im';

// Config
import { IMAGE_COMPRESSION, YEAR_RANGE } from '../config';
import GalleryImagesData from '../galleryImages.json';
import {
  DiscordImagePathIDRegex,
  DiscordImagePathRegex,
  GalleryImagesSchema,
  IArt,
  IArtLocation,
  IDiscordImageID,
  IDiscordImagePath,
  IDiscordImageURL,
  IGalleryImages,
  ISectorKey,
} from '../galleryImages';

// Components
import GalleryImages from '../components/GalleryImages';

// Atoms
import Notification from '../atoms/Notification';
import Loader from '../atoms/loaders/Loader';
import FocusedGalleryImage from '../atoms/FocusedGalleryImage';

// Hooks
import useLocalStorage from '../hooks/useLocalStorage';

// Util
import capitalize from '../util/upperCaseFirst';
import limitNumberWithinRange from '../util/limitNum';
import YearSidebar from '../components/YearSidebar';

const GALLERY_IMAGES = GalleryImagesSchema.parse(
  GalleryImagesData
) as IGalleryImages;

export function formatURL(
  url: IDiscordImageURL | undefined,
  ratio: number,
  compression: number
) {
  if (!url) return null;

  const WIDTH = limitNumberWithinRange(
    window.innerWidth / compression,
    500,
    // 1800
    1080
  );

  return `${url}?width=${Math.ceil(WIDTH)}&height=${Math.ceil(
    WIDTH * ratio
  )}` as IDiscordImageURL;
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

// Zod
const favoriteArtSchema = z.array(
  z.custom<IDiscordImagePath>(x =>
    DiscordImagePathRegex.test((x as string) || '')
  )
);

// Main
function Gallery({ scrollPosition, isFavoritesURL }: IProps) {
  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const [favoriteArt, setFavoriteArt] = useLocalStorage<IDiscordImagePath[]>(
    'favorited_art',
    favoriteArtSchema,
    []
  );

  let {
    year: yearFilter,
    sector: sectorFilter,
    imageId,
  } = useParams<{
    year: string;
    sector: IArtLocation;
    imageId: IDiscordImageID<'-'>;
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
        <YearWrapper>
          <YearSidebar sector={sectorFilter} />
        </YearWrapper>
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

        <GalleryImages
          GALLERY_IMAGES={GALLERY_IMAGES}
          yearFilter={yearFilter}
          sectorFilter={sectorFilter}
          scrollPosition={scrollPosition}
          favoriteArt={favoriteArt}
          setFavoriteArt={setFavoriteArt}
          isFavoritesURL={!!isFavoritesURL}
        />

        <ImageFocusOverlayWrapper
          isShown={fetchedArt?.isClosed === false}
          onClick={() =>
            navigate(location.pathname.replace(/[0-9]+-[0-9]+/, ''))
          }
        >
          {fetchedArt?.isClosed === false && (
            <div
              style={{
                left: '50%',
                transform: 'translateX(-50%)',
                position: 'absolute',
              }}
            >
              <Loader />
            </div>
          )}
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

  transition: width 500ms ease;
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

    transition: left 500ms ease;
  }

  &:hover::after {
    left: 10em;
  }
  &:hover {
    width: 10em;
  }

  @media only screen and (max-width: 31rem) {
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

  transition: color 250ms ease;
  &:hover {
    color: #f14255;
  }
`;

// Main
const Main = styled.div`
  flex-grow: 1;

  display: flex;
  flex-direction: column;
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
    css`
      transition: 500ms opacity ease-out;
      pointer-events: all;
      opacity: 1;
    `}
`;

export default trackWindowScroll(Gallery);
