// Packages
import styled from 'styled-components'
import Parallax from 'parallax-js'
import { useLayoutEffect, useRef } from 'react'
import LazyImage from '../atoms/LazyImage'

// Layers
import VignetteImage from '../assets/404/Vignette.png'
import SilkeImage from '../assets/404/Silke.png'
import PipeImage from '../assets/404/Pipe.png'
import SalvElieImage from '../assets/404/SalvElie.png'
import SunImage from '../assets/404/Sun.png'
import MothImage from '../assets/404/Moth.png'
import BackgroundImage from '../assets/404/Background.png'

// Types
interface LayerProps {
  blend?:
    | 'normal'
    | 'multiply'
    | 'screen'
    | 'overlay'
    | 'darken'
    | 'lighten'
    | 'color-dodge'
    | 'color-burn'
    | 'hard-light'
    | 'soft-light'
    | 'difference'
    | 'exclusion'
    | 'hue'
    | 'saturation'
    | 'color'
    | 'luminosity'
  opacity?: number
  'data-depth': string
}

// Main
function PageNotFound() {
  const parallaxRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const node: any = parallaxRef.current
    if (node) new Parallax(node)
  }, [])

  return (
    <SceneWrapper ref={parallaxRef}>
      <Layer data-depth='0.05' src={BackgroundImage} />
      <Layer data-depth='0.1' src={MothImage} />

      <Layer data-depth='0.2' blend='overlay' opacity={0.2} src={SunImage} />
      <Layer data-depth='0.5' src={SalvElieImage} />
      <Layer data-depth='0.4' src={PipeImage} />
      <Layer data-depth='0.4' src={SilkeImage} />
      <Layer
        data-depth='0'
        blend='multiply'
        opacity={0.36}
        src={VignetteImage}
      />
    </SceneWrapper>
  )
}

const SceneWrapper = styled.div`
  width: 100%;
  height: calc(100vh);

  display: flex;
  justify-content: center;
  align-items: center;

  overflow: hidden;
  filter: saturate(1.1);
`

const Layer = styled(LazyImage)<LayerProps>`
  user-select: none;

  width: 115%;
  height: 115%;
  margin-left: -5%;
  margin-top: -5%;

  mix-blend-mode: ${props => props.blend || 'normal'};
  opacity: ${props => props.opacity || '1'};

  /* overflow: hidden; */
`

export default PageNotFound
