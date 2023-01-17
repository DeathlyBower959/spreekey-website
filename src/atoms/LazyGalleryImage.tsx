// Packages
import { useState } from 'react'
import { LazyLoadImage, ScrollPosition } from 'react-lazy-load-image-component'
import styled from 'styled-components'
import { motion } from 'framer-motion'

// Types
import { IDiscordImageURL } from '../galleryImages'
interface IProps {
  src: IDiscordImageURL
  alt?: string
  year?: number
  sector?: string
  props?: any
  delay?: number

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
  ...props
}: IProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <>
      <ImageWrapper isLoaded={isLoaded} delay={delay || 0}>
        <StyledLazyLoadImage
          afterLoad={() => setIsLoaded(true)}
          src={src}
          alt={alt}
          scrollPosition={scrollPosition}
          {...props}
        />
      </ImageWrapper>
    </>
  )
}

// Styles
const ImageWrapper = styled(motion.div)<IImageWrapperProps>`
  transition: all 750ms ease-out ${props => props.delay * 100}ms;
  opacity: ${props => (props.isLoaded ? 1 : 0)};
  filter: blur(${props => (props.isLoaded ? '0px' : '15px')});

  width: 100%;
`

const StyledLazyLoadImage = styled(LazyLoadImage)`
  width: 100%;

  user-select: none;
  -webkit-user-drag: none;
`

export default LazyGalleryImage
