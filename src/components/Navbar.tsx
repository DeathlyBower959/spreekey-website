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
  positionType?: string
}
interface INavLinkWrapperProps {
  isMenuOpen: boolean
}
interface IMenuOpenState {
  isScrolled: boolean
  isHovered: boolean
}

const shouldHidePathURLs = [
  { path: '/', type: ['scroll', 'hover'], position: 'fixed' },
  { path: '/gallery', type: ['hover'], position: 'fixed', check: 'includes' },
]
function getPathURLConfig(path: string) {
  return shouldHidePathURLs.find(x =>
    x.check === 'includes' ? path.includes(x.path) : x.path === path
  )
}

// Main
function Navbar() {
  // Hooks
  const location = useLocation()

  // State
  const [isMenuOpen, setIsMenuOpen] = useState<IMenuOpenState | boolean>({
    isScrolled: false,
    isHovered: false,
  })
  const menuOpen =
    typeof isMenuOpen === 'object'
      ? isMenuOpen.isHovered || isMenuOpen.isScrolled
      : isMenuOpen

  // Events
  function onScroll() {
    setIsMenuOpen(prev => {
      if (typeof prev === 'object')
        return {
          ...prev,
          isScrolled: document.documentElement.scrollTop > 100 * 5,
        }
      else
        return {
          isHovered: false,
          isScrolled: document.documentElement.scrollTop > 100 * 5,
        }
    })
  }
  function onMouseMove(e: MouseEvent) {
    setIsMenuOpen(prev => {
      if (typeof prev === 'object')
        return {
          ...prev,
          isHovered:
            e.clientY <=
            3 * parseFloat(getComputedStyle(document.documentElement).fontSize),
        }
      else
        return {
          isScrolled: false,
          isHovered:
            e.clientY <=
            3 * parseFloat(getComputedStyle(document.documentElement).fontSize),
        }
    })
  }

  // Effect
  useEffect(() => {
    onScroll()
    window.scrollTo(0, 0)
    const shouldHideConfig = getPathURLConfig(location.pathname)

    if (isTouch()) return setIsMenuOpen(false)
    if (!shouldHideConfig) return setIsMenuOpen(true)

    if (shouldHideConfig.type.includes('scroll'))
      document.addEventListener('scroll', onScroll)
    if (shouldHideConfig.type.includes('hover'))
      document.addEventListener('mousemove', onMouseMove)

    return () => {
      document.removeEventListener('scroll', onScroll)
      document.removeEventListener('mousemove', onMouseMove)
    }
  }, [location.pathname])

  return (
    <>
      <Nav
        isMenuOpen={menuOpen}
        positionType={getPathURLConfig(location.pathname)?.position}
      >
        <NavInnerLeft as={Link} to='/' tabIndex={0}>
          <Logo color={'var(--foreground)'} />
          <NavName>[ art of spreekey ]</NavName>
        </NavInnerLeft>
        <NavInnerRight>
          <NavLinkWrapper isMenuOpen={menuOpen}>
            <NavLink to='/gallery'>Gallery</NavLink>
            <NavLink to='/commissions'>Commissions</NavLink>
            <NavLink to='/store'>Store</NavLink>
            <NavLink to='/about'>About</NavLink>
          </NavLinkWrapper>
          <SqueezeWrapper>
            <SqueezeMenu
              toggled={menuOpen}
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

  position: ${props => props.positionType || 'sticky'};

  left: 0;
  right: 0;
  top: ${props => (props.isMenuOpen ? '0' : '-12%')};
  opacity: ${props => (props.isMenuOpen ? '1' : '0')};

  transition: top 1s ease-out,
    opacity 250ms ease-out ${props => (props.isMenuOpen ? '500ms' : '1ms')};

  ${isTouch() ? '&' : ':focus-within'} {
    top: 0;
    opacity: 1;
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
