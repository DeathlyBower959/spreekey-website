// Packages
import styled from 'styled-components'
import { useRef, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AiFillHome } from 'react-icons/ai'

const YearRange = [2017, new Date().getFullYear()]
function DisplayYearSidebar(sector: string = 'main') {
  let out = []

  for (let i = YearRange[1]; i >= YearRange[0]; i--) {
    out.push(
      <SidebarYear to={`/gallery/${i}/${sector}`} key={i}>
        {i}
      </SidebarYear>
    )
  }

  return out
}

// Types
interface ISidebar {
  isExpanded: boolean
}
interface IYearBar {
  isHidden: boolean
}

// Main
function Gallery() {
  // Hooks
  const navigate = useNavigate()
  const { year, sector } = useParams()

  // State
  const dropdownRef = useRef<HTMLSelectElement>(null)

  // Effect
  useEffect(() => {
    if (!year || !sector) return
    navigate(`/gallery/${year}/${dropdownRef.current?.value.toLowerCase()}`)
  }, [sector])

  // Events
  function handleDropdownChange(e: React.ChangeEvent<HTMLSelectElement>) {
    navigate(
      `/gallery/${year || YearRange[1]}/${
        e.target.value.toLowerCase() || 'main'
      }`
    )
  }

  return (
    <Wrapper>
      <Sidebar isExpanded={!year}>
        <ArtSectorDropdown ref={dropdownRef} onChange={handleDropdownChange}>
          <option>Main</option>
          <option>Alt</option>
          <option>Sketches</option>
        </ArtSectorDropdown>
        <YearWrapper>{DisplayYearSidebar(sector)}</YearWrapper>
        <Link to='/gallery'>
          <HomeButton />
        </Link>
      </Sidebar>
      <Main>
        <YearBar isHidden={!year}>
          <SelectedYear>{year || ''}</SelectedYear>
        </YearBar>
      </Main>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
`

const Sidebar = styled.div<ISidebar>`
  width: ${props => (props.isExpanded ? '10em' : '0')};
  text-align: center;
  background-color: var(--secondary-background);

  padding-top: 4em;
  padding-bottom: 2em;

  transition: width 1s ease;
  overflow: hidden;
  height: 100vh;

  display: flex;
  flex-direction: column;
`
const ArtSectorDropdown = styled.select``
const YearWrapper = styled.div`
  display: flex;
  flex-direction: column;

  gap: 5em;

  /* justify-content: space-around; */

  align-items: center;
  height: 100%;

  padding: 2em 0 6em 0;
  margin-top: 2em;

  overflow-y: auto;

  flex-grow: 1;
`
const HomeButton = styled(AiFillHome)`
  width: 4em;
  height: 4em;

  color: var(--secondary-foreground);
`

const SidebarYear = styled(Link)`
  rotate: 90deg;
  width: min-content;

  text-decoration: none;

  font-size: 2em;
  font-weight: bold;

  &:link,
  &:visited,
  &:active {
    color: inherit;
  }
`

const Main = styled.div`
  flex-grow: 1;
`
const YearBar = styled.div<IYearBar>`
  height: ${props => (props.isHidden ? '0' : '10em')};
  background-color: var(--tertiary-background);
  overflow: hidden;
`
const SelectedYear = styled.h1``

export default Gallery
