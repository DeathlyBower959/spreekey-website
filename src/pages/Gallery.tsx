// Packages
import styled from 'styled-components'
import { useRef, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AiFillHome } from 'react-icons/ai'

// Config
import { YEAR_RANGE } from '../config'
import GalleryImages from '../galleryImages.json'
import { IGalleryImages, GalleryImagesSchema } from '../galleryImages'

// Util
import capitalize from '../util/upperCaseFirst'
import isTouch from '../util/isTouch'

function DisplayYearSidebar(sector: string = 'main') {
  let out = []

  for (let i = YEAR_RANGE[1]; i >= YEAR_RANGE[0]; i--) {
    out.push(
      <SidebarYear to={`/gallery/${i}/${sector}`} key={i}>
        {i}
      </SidebarYear>
    )
  }

  return out
}
const GALLERY_IMAGES = GalleryImagesSchema.parse(GalleryImages)
// Types
interface IYearBar {
  isHidden: boolean
}
interface ISelectedSelector {
  active: boolean
}

// console.log(
//   Object.keys(GALLERY_IMAGES)
//     .reverse()
//     .map(year => GALLERY_IMAGES[year].alt)
// )

// Main
function Gallery() {
  // Hooks
  const navigate = useNavigate()
  const { year, sector } = useParams()

  // State
  const dropdownRef = useRef<HTMLSelectElement>(null)

  // Effect
  useEffect(() => {
    if (!sector || !dropdownRef.current) return

    if (sector === 'main' || sector === 'alt' || sector === 'sketches')
      dropdownRef.current.value = capitalize(sector)
    else navigate(`/gallery/${year}/main`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sector])

  // Events
  function handleLinkClick(e: React.MouseEvent<HTMLHeadingElement>) {
    navigate(
      `/gallery/${year || YEAR_RANGE[1]}/${
        e.currentTarget.innerHTML.toLowerCase() || 'main'
      }`
    )
  }

  return (
    <Wrapper>
      <Sidebar>
        <YearWrapper>{DisplayYearSidebar(sector)}</YearWrapper>
        <Link to='/gallery'>
          <HomeButton />
        </Link>
      </Sidebar>
      <Main>
        <YearBar isHidden={!year}>
          <SelectedYear>{year || ''}</SelectedYear>
          <SelectorWrapper>
            <SelectedSector
              active={sector === 'main'}
              onClick={handleLinkClick}
            >
              Main
            </SelectedSector>
            <SelectedSector
              active={sector === 'sketches'}
              onClick={handleLinkClick}
            >
              Sketches
            </SelectedSector>
            <SelectedSector active={sector === 'alt'} onClick={handleLinkClick}>
              Alt
            </SelectedSector>
          </SelectorWrapper>
        </YearBar>
        <GalleryWrapper></GalleryWrapper>
      </Main>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  min-height: ${isTouch() ? 'calc(100vh - 5em)' : '100vh'};
`

const Sidebar = styled.div`
  width: 0;
  text-align: center;
  background-color: var(--secondary-background);

  padding-top: 3em;
  padding-bottom: 2em;

  transition: width 750ms ease;
  overflow: hidden;

  height: ${isTouch() ? 'calc(100vh - 5em)' : '100vh'};

  display: flex;
  flex-direction: column;

  position: fixed;
  left: 0;
  top: ${isTouch() ? '5em' : '0'};

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

  @media only screen and (max-width: 768px) {
    &:hover::after {
      left: calc(75vw);
    }
    &:hover {
      width: calc(75vw);
    }
    padding-top: 0;
  }

  z-index: 2;
`
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
`
const HomeButton = styled(AiFillHome)`
  width: 4em;
  height: 4em;

  color: var(--secondary-foreground);
`

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
`

const Main = styled.div`
  flex-grow: 1;
`

const YearBar = styled.div<IYearBar>`
  height: ${props => (props.isHidden ? '0' : '10em')};
  background-color: var(--tertiary-background);
  overflow: hidden;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
`
const GalleryWrapper = styled.div``
const SelectorWrapper = styled.div`
  display: flex;
  gap: 1em;
`
const SelectedYear = styled.h1`
  font-size: 4em;
`
const SelectedSector = styled.h3<ISelectedSelector>`
  cursor: pointer;

  text-decoration: ${props => (props.active ? 'underline' : 'none')};
  text-decoration-thickness: 3px;
`

export default Gallery
