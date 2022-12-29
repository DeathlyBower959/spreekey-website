import { useState } from 'react'
import styled from 'styled-components'

const LazyImage: React.FC<{
  src: string
  alt?: string
  endBlur?: number
  endOpacity?: number
  props?: any
}> = ({ src, alt, endBlur = 0, endOpacity = 1, ...props }) => {
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

const StyledLazyImage = styled.img<{
  endBlur: number
  endOpacity: number
  isLoaded: boolean
}>`
  transition: opacity 500ms ease-in-out, filter 750ms ease-in-out;
  opacity: ${props => (props.isLoaded ? props.endOpacity : 0)};
  filter: blur(${props => (props.isLoaded ? props.endBlur + 'px' : '30px')});
`

export default LazyImage
