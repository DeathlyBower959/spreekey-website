// Packages
import styled from 'styled-components'
import { useRef, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AiFillHome } from 'react-icons/ai'
import Masonry from 'react-masonry-css'
import { motion } from 'framer-motion'

// Config
import { YEAR_RANGE } from '../config'
import GalleryImages from '../galleryImages.json'
import { GalleryImagesSchema, IDiscordImageURL } from '../galleryImages'

// Atoms
import LazyGalleryImage from '../atoms/LazyGalleryImage'

// Util
import capitalize from '../util/upperCaseFirst'
import isTouch from '../util/isTouch'
import {
  ScrollPosition,
  trackWindowScroll,
} from 'react-lazy-load-image-component'

const GALLERY_IMAGES = GalleryImagesSchema.parse(GalleryImages)
function RenderYearSidebar(sector: string = 'main') {
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
function RenderGalleryImages(
  yearFilter: string | undefined,
  sectorFilter: string | undefined,
  scrollPosition: ScrollPosition
) {
  let index = -1
  return Object.keys(GALLERY_IMAGES)
    .filter(x => (yearFilter ? x === yearFilter : true))
    .reverse()
    .map((year, yearIdx) =>
      Object.keys(GALLERY_IMAGES[year as IYearKey])
        .filter(x => (sectorFilter ? x === sectorFilter : true))
        .map((sector, sectorIdx) =>
          GALLERY_IMAGES[year as IYearKey][sector as ISectorKey]?.map(
            (imageURL, imageURLIdx) => {
              if (!imageURL || !imageURL.match(/([0-9]+)\/([0-9]+)/)?.[0])
                return console.error('Failed to load: ' + imageURL)

              index++
              return (
                <LazyGalleryImage
                  // delay={yearIdx + sectorIdx + imageURLIdx}
                  scrollPosition={scrollPosition}
                  delay={index}
                  year={parseInt(year)}
                  sector={sector}
                  key={imageURL.match(/([0-9]+)\/([0-9]+)/)?.[0]}
                  src={imageURL as IDiscordImageURL}
                />
              )
            }
          )
        )
    )
}

// Types
interface IProps {
  scrollPosition: ScrollPosition
}
interface IYearBar {
  isHidden: boolean
}
type IYearKey = keyof typeof GALLERY_IMAGES
type ISectorKey = keyof typeof GALLERY_IMAGES['2023']

// Main
function Gallery({ scrollPosition }: IProps) {
  // Hooks
  const navigate = useNavigate()
  const { year: yearFilter, sector: sectorFilter } = useParams()

  // State
  const dropdownRef = useRef<HTMLSelectElement>(null)

  // Effect
  useEffect(() => {
    if (!sectorFilter || !dropdownRef.current) return

    if (
      sectorFilter === 'main' ||
      sectorFilter === 'alt' ||
      sectorFilter === 'sketches'
    )
      dropdownRef.current.value = capitalize(sectorFilter)
    else navigate(`/gallery/${yearFilter}/main`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectorFilter])

  // Events
  function handleLinkClick(e: React.MouseEvent<HTMLHeadingElement>) {
    navigate(
      `/gallery/${yearFilter || YEAR_RANGE[1]}/${
        e.currentTarget.innerText.toLowerCase() || 'main'
      }`
    )
  }

  // TODO: Hover/Click image
  return (
    <Wrapper>
      <Sidebar>
        <YearWrapper>{RenderYearSidebar(sectorFilter)}</YearWrapper>
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
        <GalleryWrapper
          breakpointCols={{
            default: 4,
            1500: 3,
            900: 2,
            650: 1,
          }}
          className='gallery-masonry-grid'
          columnClassName='gallery-masonry-grid_column'
        >
          {RenderGalleryImages(yearFilter, sectorFilter, scrollPosition)}
        </GalleryWrapper>
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

  display: flex;
  flex-direction: column;
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
const GalleryWrapper = styled(Masonry)`
  display: flex;
  margin-left: calc(var(--masonry-gutter-size) * -1);
  width: 100%;

  & > div {
    padding-left: var(--masonry-gutter-size);
    background-clip: padding-box;
  }

  & > div > img {
    margin-bottom: var(--masonry-gutter-size);
  }
`

const SelectorWrapper = styled.div`
  display: flex;
  gap: 1em;
`
const SelectedYear = styled.h1`
  font-size: 4em;
`
const SelectedSector = styled.h3`
  cursor: pointer;
  position: relative;
`
const ActiveUnderline = styled(motion.div).attrs({
  layoutId: 'gallery-underline',
})`
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;

  background-color: var(--foreground);
`
export default trackWindowScroll(Gallery)
