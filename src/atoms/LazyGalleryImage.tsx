// Packages
import { useState } from 'react';
import { LazyLoadImage, ScrollPosition } from 'react-lazy-load-image-component';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useDoubleTap } from 'use-double-tap';
import { isMobile, MobileOnlyView } from 'react-device-detect';
import { Link } from 'react-router-dom';

// Atoms
import AnimatedHeart from './icons/AnimatedHeart';

// Util
import { toRoman } from '../util/romanNumeral';
import capitalize from '../util/upperCaseFirst';

// Types
import { IDiscordImageURL } from '../galleryImages';
import { useLocation } from 'react-router';
interface IProps {
  src: IDiscordImageURL;
  initial: IDiscordImageURL;
  alt?: string;
  year?: number;
  sector?: string;
  props?: any;

  favoriteToggle: () => void;
  favorite: boolean;

  ID: string;

  month?: number;
  day?: number;

  scrollPosition: ScrollPosition;
}

// Main
// FIX: Favorites refreshing entire page upon unfavorite (/gallery/favorites)
function LazyGalleryImage({
  src,
  initial,
  alt = '',
  year,
  sector,
  scrollPosition,

  favoriteToggle,
  favorite,

  month,
  day,

  ID,
}: IProps) {
  // Hooks
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handleDoubleTap = useDoubleTap(doubleTap, 200, {
    onSingleTap: handleClick,
  });
  function doubleTap() {
    favoriteToggle();
    localStorage.setItem('spreekey-has_double_tapped_to_favorite', 'true');
  }
  function openExpandedView() {
    if (!location.pathname.match(/c\/[0-9]+-[0-9]+/)?.[0])
      navigate(`c/${ID.split('/').join('-')}`);
  }
  function handleClick() {
    if (isMobile) setIsOverlayOpen(prev => !prev);
    else openExpandedView();
  }

  return (
    <>
      <ImageWrapper
        {...handleDoubleTap}
        whileHover='open'
        animate={isOverlayOpen && isMobile ? 'open' : ''}
        whileInView={{
          filter: isLoaded ? 'blur(0px)' : 'blur(10px)',
          opacity: isLoaded ? '1' : '0',
        }}
      >
        <StyledLazyLoadImage
          style={{
            minHeight: isLoaded ? 0 : '25vh',
          }}
          afterLoad={() => setIsLoaded(true)}
          src={src}
          alt={alt}
          scrollPosition={scrollPosition}
          threshold={400}
        />

        <MiddleHeartPositionWrapper enabled={favorite}>
          <MiddleHeartWrapper>
            <AnimatedHeart autoHide={true} enabled={favorite} />
          </MiddleHeartWrapper>
        </MiddleHeartPositionWrapper>

        <Overlay
          initial={{ height: '0' }}
          variants={{
            open: {
              height: '100%',
              transition: { ease: 'anticipate', duration: 0.75, bounce: false },
            },
          }}
        >
          <MobileOnlyView>
            <OpenLargerOverlay onClick={openExpandedView}>+</OpenLargerOverlay>
          </MobileOnlyView>
          <SectorOverlay>{capitalize(sector)}</SectorOverlay>
          <DateOverlay>
            {year}
            {month !== undefined && '.' + toRoman(month)}
            {month !== undefined && '.' + day}
          </DateOverlay>
          <HeartWrapper onClick={favoriteToggle}>
            <AnimatedHeart enabled={favorite} />
          </HeartWrapper>
        </Overlay>
      </ImageWrapper>
    </>
  );
}

// Styles
const ImageWrapper = styled(motion.div)`
  width: 100%;

  filter: blur(10px);
  opacity: 0;

  transition: opacity 750ms ease-out, filter 500ms ease-out;

  position: relative;
`;

const StyledLazyLoadImage = styled(LazyLoadImage)`
  width: 100%;

  user-select: none;
  -webkit-user-drag: none;
`;
const Overlay = styled(motion.div)`
  background-color: #000000bd;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;

  overflow: hidden;
`;
const InnerOverlay = styled.h2`
  /* Fix me */
  font-size: clamp(2.5rem, 7vw - 5rem, 4.5rem);
  position: absolute;
`;
const SectorOverlay = styled(InnerOverlay)`
  right: 0.5em;
  bottom: 0.5em;
  text-align: right;

  font-size: clamp(2.5rem, 7vw - 5rem, 4rem);
  opacity: 0.75;
`;
const DateOverlay = styled(InnerOverlay)`
  left: 0.5em;
  top: 0.5em;
`;
// TODO: Accessibilty
const OpenLargerOverlay = styled.div`
  font-size: 2.5em;
  position: absolute;

  text-decoration: none;
  color: inherit;

  bottom: 0.5em;
  left: 0.5em;
`;
const HeartWrapper = styled.div`
  width: 3em;
  height: 3em;

  margin-left: auto;
  right: 0;
  top: 0;
  margin-right: 1em;
  margin-top: 1em;
`;
const MiddleHeartPositionWrapper = styled.div<{ enabled: boolean }>`
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
`;
const MiddleHeartWrapper = styled.div`
  width: clamp(6em, 5vw, 10em);
  height: clamp(6em, 5vw, 10em);
`;
export default LazyGalleryImage;
