// Packages
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import { Squeeze as SqueezeMenu } from 'hamburger-react'

// Util
import isTouch from '../util/isTouch'

// Atoms
import Logo from '../atoms/icons/Logo'

// Types
interface INavProps {
  isMenuOpen: boolean
  isLanding: boolean
}

interface INavLinkWrapperProps {
  isMenuOpen: boolean
}

const shouldHidePathURLs = [
  { path: '/', type: 'scroll' },
  { path: '/gallery', type: 'hover', check: 'includes' },
]

// Main
function Navbar() {
  // Hooks
  const location = useLocation()

  // State
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Events
  function onScroll() {
    setIsMenuOpen(document.documentElement.scrollTop > 100 * 5)
  }
  function onMouseMove(e: MouseEvent) {
    setIsMenuOpen(
      e.clientY <=
        3 * parseFloat(getComputedStyle(document.documentElement).fontSize)
    )
  }

  // Effect
  useEffect(() => {
    const shouldHideConfig = shouldHidePathURLs.find(x =>
      x.check === 'includes'
        ? location.pathname.includes(x.path)
        : x.path === location.pathname
    )

    if (isTouch()) return setIsMenuOpen(false)
    if (!shouldHideConfig) {
      setIsMenuOpen(true)
      return
    }

    if (shouldHideConfig.type === 'scroll')
      document.addEventListener('scroll', onScroll)
    else if (shouldHideConfig.type === 'hover')
      document.addEventListener('mousemove', onMouseMove)

    return () => {
      document.removeEventListener('scroll', onScroll)
      document.removeEventListener('mousemove', onMouseMove)
    }
  }, [location.pathname])

  return (
    <>
      <Nav isMenuOpen={isMenuOpen} isLanding={location.pathname === '/'}>
        <NavInnerLeft as={Link} to='/' tabIndex={0}>
          <Logo color={'var(--foreground)'} />
          <NavName>[ art of spreekey ]</NavName>
        </NavInnerLeft>
        <NavInnerRight>
          <NavLinkWrapper isMenuOpen={isMenuOpen}>
            <NavLink to='/gallery'>Gallery</NavLink>
            <NavLink to='/commissions'>Commissions</NavLink>
            <NavLink to='/store'>Store</NavLink>
            <NavLink to='/about'>About</NavLink>
          </NavLinkWrapper>
          <SqueezeWrapper>
            <SqueezeMenu
              toggled={isMenuOpen}
              onToggle={() => setIsMenuOpen(prev => !prev)}
              color='var(--accent)'
              hideOutline={false}
              label='Open sidebar menu'
            />
          </SqueezeWrapper>
        </NavInnerRight>
      </Nav>
    </>
  )
}

// Nav
const Nav = styled.nav<INavProps>`
  height: 5em;
  background-color: rgba(var(--nav-background), 0.867);
  backdrop-filter: blur(12px);

  display: flex;
  justify-content: space-between;
  padding: 0 1em;

  position: ${props =>
    props.isLanding ? (props.isMenuOpen ? 'sticky' : 'fixed') : 'fixed'};

  left: 0;
  right: 0;
  top: ${props => (props.isMenuOpen ? '0' : '-12%')};
  opacity: ${props => (props.isMenuOpen ? '1' : '0')};

  transition: top 1s ease-out,
    opacity 1s ease-out ${props => (props.isMenuOpen ? '500ms' : '1ms')};

  ${isTouch() ? '&' : ':focus-within'} {
    top: 0;
    opacity: 1;
    position: ${props => (props.isLanding ? 'fixed' : 'sticky')};
  }

  z-index: 999999;
`
const NavInner = styled.div`
  width: max-content;
  height: 100%;
  padding: 0.5em;

  display: flex;
  align-items: center;
  gap: 1em;
`
const NavInnerLeft = styled(NavInner)`
  padding: 0.75em 0.5em;
  text-decoration: none;
  user-select: none;
`
const NavInnerRight = styled(NavInner)`
  padding: 0.5em 0.25em;
`
const NavLink = styled(Link)`
  text-decoration: none;
  color: var(--foreground);
  font-size: 1.1em;
`
const NavLinkWrapper = styled.div<INavLinkWrapperProps>`
  display: flex;
  align-items: center;
  gap: 2em;

  @media only screen and (max-width: 768px) {
    transition: 500ms ease;
    overflow-x: hidden;

    flex-direction: column;
    position: absolute;
    width: ${props => (!props.isMenuOpen ? `0vw;` : '100vw')};
    height: 100vh;
    right: 0;
    top: 0;

    justify-content: center;
    background-color: rgb(var(--nav-background));
    font-size: 2em;

    ${NavLink} {
      border-bottom: 1px solid #333;
      padding-bottom: 1em;
    }

    ${NavLink}:last-child {
      border-bottom: none;
    }

    @media only screen and (max-height: 750px) {
      padding-top: 125px;
      justify-content: flex-start;
    }
  }
`

const NavName = styled.p`
  color: var(--foreground);
  user-select: none;
  font-size: clamp(1.3em, 2vw, 2em);

  font-weight: bold;
`
const SqueezeWrapper = styled.div`
  display: none;

  @media only screen and (max-width: 768px) {
    display: block;
  }
`

export default Navbar
