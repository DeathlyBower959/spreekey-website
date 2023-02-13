// Packages
import styled from 'styled-components';
import { useDoubleTap } from 'use-double-tap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BiLinkExternal } from 'react-icons/bi';
import { useRef, useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';

// Util
import { toRoman } from '../util/romanNumeral';
import cleanURL from '../util/cleanURL';
import capitalize from '../util/upperCaseFirst';

// Atoms
import AnimatedHeart from './icons/AnimatedHeart';

// Types
import { IDiscordImageURL } from '../galleryImages';
import getObjectRects from '../util/renderedImageSize';
import useWindowResize from '../hooks/useWindowResize';
import { isMobile } from 'react-device-detect';

interface IProps {
  src: IDiscordImageURL | null;
  alt?: string;
  year?: number;
  sector?: string;
  props?: any;

  favoriteToggle: () => void;
  favorite: boolean;

  ID: string;

  month?: number;
  day?: number;

  ratio: [number, number];
}
interface IImageWrapper {
  isLoaded: boolean;
}
interface IHeartPos {
  enabled: boolean;
}
interface IInfoBar {
  isOpen: boolean;
}
interface IStyledImage {
  infoBarHeight: number;
}

// Main
// FIX: Favorites refreshing entire page upon unfavorite (/gallery/favorites)
function FocusedGalleryImage({
  src,
  alt = '',
  year,
  sector,

  favoriteToggle,
  favorite,

  month,
  day,

  ID,
  ratio,
  ...props
}: IProps) {
  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const [windowWidth] = useWindowResize();

  const handleDoubleTap = useDoubleTap(doubleTap, 200, {
    onSingleTap: () => setIsInfoBarOpen(false),
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [isInfoBarOpen, setIsInfoBarOpen] = useState(false);
  const [infoBarWidth, setInfoBarWidth] = useState<number>(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const infoBarRef = useRef<HTMLDivElement>(null);

  function doubleTap() {
    favoriteToggle();
    localStorage.setItem('spreekey-has_double_tapped_to_favorite', 'true');
  }

  useEffect(() => {
    if (!imageRef.current) return;

    setInfoBarWidth(getObjectRects(imageRef.current).positioned.width);
  }, [windowWidth]);

  if (!src) return null;

  return (
    <div onClick={e => e.stopPropagation()}>
      <ImageWrapper {...handleDoubleTap} isLoaded={isLoaded}>
        <CloseIcon
          onClick={() =>
            navigate(location.pathname.replace(/[0-9]+-[0-9]+/, ''))
          }
        />

        <StyledImage
          ref={imageRef}
          infoBarHeight={infoBarRef.current?.offsetHeight || 0}
          src={src}
          alt={alt}
          {...props}
          onLoad={() => {
            setIsLoaded(true);
            if (imageRef.current)
              setInfoBarWidth(
                getObjectRects(imageRef.current).positioned.width
              );
          }}
        />

        <InfoTab
          onClick={e => {
            e.stopPropagation();
            setIsInfoBarOpen(true);
          }}
        />
        <InfoBar
          isOpen={isInfoBarOpen}
          style={{
            width: imageRef.current ? infoBarWidth + 'px' : 'auto',
          }}
          ref={infoBarRef}
        >
          <InfoGroup>
            <InfoInterested to='/commissions'>Interested?</InfoInterested>
          </InfoGroup>

          <InfoGroup style={{ flex: 1 }}>
            <InfoYearText>
              {year}
              {month !== undefined && '.' + toRoman(month)}
              {month !== undefined && '.' + day}
            </InfoYearText>
            <HeartWrapper onClick={favoriteToggle}>
              <AnimatedHeart enabled={favorite} />
            </HeartWrapper>
            <InfoSectorText>{capitalize(sector)}</InfoSectorText>
          </InfoGroup>

          <InfoGroup style={{ gap: '0.25em' }}>
            <InfoOpenOriginal href={cleanURL(src)}>
              Higher Quality
            </InfoOpenOriginal>
            <NewLinkIcon />
          </InfoGroup>
        </InfoBar>

        <MiddleHeartPositionWrapper enabled={favorite}>
          <MiddleHeartWrapper>
            <AnimatedHeart autoHide={true} enabled={favorite} />
          </MiddleHeartWrapper>
        </MiddleHeartPositionWrapper>
      </ImageWrapper>
    </div>
  );
}

// Styles

const ImageWrapper = styled.div<IImageWrapper>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  transition: opacity 500ms ease-out, filter 500ms ease-out;

  opacity: 0;
  filter: blur(15px);

  ${props =>
    props.isLoaded &&
    `opacity: 1;
  filter: blur(0);`}
`;

const NewLinkIcon = styled(BiLinkExternal)`
  margin-left: 0.25em;
  /* Resizing for some reason */
`;

const StyledImage = styled.img<IStyledImage>`
  /* max-height: calc(100% - ${props => props.infoBarHeight}px); */
  /* height: calc(100% - ${props => props.infoBarHeight}px); */
  width: 90vw;
  max-height: calc(
    90vh - ${props => props.infoBarHeight}px ${isMobile && '- 5em'}
  );
  object-fit: contain;

  user-select: none;
  -webkit-user-drag: none;
`;
const CloseIcon = styled(IoMdClose)`
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2.5em;

  cursor: pointer;
  border-radius: 50%;

  box-shadow: 0 0 8px 8px #0000007f;
  background-color: #0000007f;
`;
const MiddleHeartPositionWrapper = styled.div<IHeartPos>`
  ${props =>
    props.enabled &&
    'animation: 500ms cubic-bezier(0.99, -0.04, 0.35, 1.01) forwards ScaleOut 1.1s;'}

  @keyframes ScaleOut {
    0% {
      scale: 1;
    }

    100% {
      scale: 0;
    }
  }

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 1;

  pointer-events: none;
`;
const HeartWrapper = styled.div`
  width: 3em;
  height: 3em;
`;
const MiddleHeartWrapper = styled.div`
  width: clamp(6em, 5vw, 10em);
  height: clamp(6em, 5vw, 10em);
`;

// Info Bar
const InfoBar = styled.div<IInfoBar>`
  background-color: var(--secondary-background);
  padding: 0.5em 1em;

  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1em;

  @media only screen and (max-width: 800px) {
    height: 0;
    position: absolute;
    overflow: hidden;
    bottom: 0;
    padding-top: 0;
    padding-bottom: 0;
    flex-direction: column;

    transition: height 500ms ease-out, padding 500ms ease-out;

    &:focus-within {
      height: 15em;
      padding: 1.5em 0;
    }

    ${props =>
      props.isOpen &&
      `height: 15em;
      padding: 1.5em 0;`}
  }
`;
const InfoGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1em;

  @media only screen and (max-width: 800px) {
    flex-direction: column;
  }
`;
const InfoTab = styled.div`
  display: none;

  position: absolute;
  background-color: var(--secondary-background);
  width: 5em;
  height: 1.5em;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;

  border-bottom: 2px solid var(--tertiary-background);

  border-radius: 8px 8px 0 0;

  @media only screen and (max-width: 768px) {
    display: block;
  }
`;
const InfoInterested = styled(Link)`
  color: inherit;
  text-decoration: none;
`;
const InfoYearText = styled.p``;
const InfoSectorText = styled.p``;
const InfoOpenOriginal = styled.a.attrs({ target: '_blank' })`
  color: inherit;
  text-decoration: none;
`;

export default FocusedGalleryImage;
