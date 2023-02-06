// Packages
import { useState } from 'react'
import styled from 'styled-components'

// Types
interface IProps {
  src: string
  alt?: string
  endBlur?: number
  endOpacity?: number
  props?: any
}

interface IStyledLazyImageProps {
  endBlur: number
  endOpacity: number
  isLoaded: boolean
}

// Main
function LazyImage({
  src,
  alt = '',
  endBlur = 0,
  endOpacity = 1,
  ...props
}: IProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <StyledLazyImage
      onLoad={() => {
        setLoaded(true)
      }}
      isLoaded={loaded}
      src={src}
      alt={alt}
      endBlur={endBlur}
      endOpacity={endOpacity}
      {...props}
    />
  )
}

// Styles
const StyledLazyImage = styled.img<IStyledLazyImageProps>`
  transition: opacity 500ms ease-in-out, filter 750ms ease-in-out;
  opacity: ${props => (props.isLoaded ? props.endOpacity : 0)};
  filter: blur(${props => (props.isLoaded ? props.endBlur + 'px' : '30px')});
`

export default LazyImage
