// Packages
import { useState } from 'react'
import { LazyLoadImage, ScrollPosition } from 'react-lazy-load-image-component'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router'

// Types
import { IDiscordImageURL } from '../galleryImages'
import { toRoman } from '../util/romanNumeral'
import capitalize from '../util/upperCaseFirst'
interface IProps {
  src: IDiscordImageURL
  alt?: string
  year?: number
  sector?: string
  props?: any
  delay?: number

  ID: string

  month?: number
  day?: number

  scrollPosition: ScrollPosition
}

interface IImageWrapperProps {
  isLoaded: boolean
  delay: number
}

// Main
function LazyGalleryImage({
  src,
  alt = '',
  delay,
  year,
  sector,
  scrollPosition,

  month,
  day,

  ID,
  ...props
}: IProps) {
  // Hooks
  const navigate = useNavigate()

  // State
  const [isLoaded, setIsLoaded] = useState(false)

  function handleClick() {
    if (!src.match(/[0-9]+\/[0-9]+/))
      return console.error('Failed to open image: No regex match')
    // navigate(
    //   `c/${src
    //     .match(/[0-9]+\/[0-9]+/)?.[0]
    //     .split('/')
    //     .join('-')}`
    // )
  }

  return (
    <>
      <ImageWrapper
        onClick={handleClick}
        isLoaded={isLoaded}
        delay={delay || 0}
        whileHover='open'
      >
        <StyledLazyLoadImage
          afterLoad={() => setIsLoaded(true)}
          src={src}
          alt={alt}
          scrollPosition={scrollPosition}
          {...props}
        />
        <Overlay
          initial={{ height: '0' }}
          variants={{
            open: {
              height: '100%',
              transition: { ease: 'anticipate', duration: 0.75, bounce: false },
            },
          }}
        >
          <SectorOverlay>{capitalize(sector || '')}</SectorOverlay>
          <DateOverlay>
            {year}
            {month !== undefined && '.' + toRoman(month)}
            {month !== undefined && '.' + day}
          </DateOverlay>
        </Overlay>
      </ImageWrapper>
    </>
  )
}

// Styles
const ImageWrapper = styled(motion.div)<IImageWrapperProps>`
  transition: all 750ms ease-out ${props => props.delay * 100}ms;
  opacity: ${props => (props.isLoaded ? 1 : 0)};
  filter: blur(${props => (props.isLoaded ? '0px' : '5px')});

  width: 100%;

  position: relative;
`

const StyledLazyLoadImage = styled(LazyLoadImage)`
  width: 100%;

  user-select: none;
  -webkit-user-drag: none;
`
const Overlay = styled(motion.div)`
  background-color: #000000aa;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;

  overflow: hidden;
`
const InnerOverlay = styled(motion.h2)`
  /* Fix me */
  font-size: clamp(2.5rem, 7vw - 5rem, 4.5rem);
  position: absolute;
`
const SectorOverlay = styled(InnerOverlay)`
  right: 0.5em;
  bottom: 0.5em;
  text-align: right;
`
const DateOverlay = styled(InnerOverlay)`
  left: 0.5em;
  top: 0.5em;
`
export default LazyGalleryImage
