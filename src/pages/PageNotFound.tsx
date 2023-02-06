// Packages
import styled from 'styled-components'
import Parallax from 'parallax-js'
import { useLayoutEffect, useRef } from 'react'
import LazyImage from '../atoms/LazyImage'

// Layers
import VignetteImage from '../assets/404/Vignette.webp'
import SilkeImage from '../assets/404/Silke.webp'
import PipeImage from '../assets/404/Pipe.webp'
import SalvElieImage from '../assets/404/SalvElie.webp'
import SunImage from '../assets/404/Sun.webp'
import MothImage from '../assets/404/Moth.webp'
import BackgroundImage from '../assets/404/Background.webp'

// Types
interface ILayerProps {
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
    if (node)
      new Parallax(node, {
        limitY: 0,
        precision: 1,
      })
  }, [])

  // 404 text
  return (
    <>
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
        <Text404>404</Text404>
      </SceneWrapper>
    </>
  )
}

const SceneWrapper = styled.div`
  width: 100%;
  height: calc(100vh - 5em);

  display: flex;
  justify-content: center;
  align-items: center;

  overflow: hidden;
  filter: saturate(1.1);
`

// QUICKHACK: Make parallax not cut of image, and remove layerY restriction
const Layer = styled(LazyImage)<ILayerProps>`
  user-select: none;

  width: 110%;
  height: 110%;
  margin-left: -5%;
  /* margin-top: -5%; */
  object-fit: cover;
  object-position: 30% 50%;

  mix-blend-mode: ${props => props.blend || 'normal'};
  opacity: ${props => props.opacity || '1'};

  /* overflow: hidden; */
`
const Text404 = styled.h1`
  background: transparent;
  backdrop-filter: blur(3px);
  border-radius: 8px;
  border: 1px solid #ccc;
  color: #dedede;
  box-shadow: 0px 0px 18px 4px rgba(0, 0, 0, 0.61);
  text-align: center;
  font-size: clamp(4em, 10vw, 10em);
  font-weight: bold;
  letter-spacing: 0.5em;
  text-indent: 0.5em;
  padding: 0.1em 0.4em;

  width: min-content;

  position: absolute !important;
  left: 50% !important;
  top: 50% !important;

  transform: translateX(-50%) translateY(-50%) !important;
`

export default PageNotFound
