// Packages
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import { Squeeze as SqueezeMenu } from 'hamburger-react'

// Atoms
import Logo from '../atoms/icons/Logo'

// Types
interface NavProps {
  isScrolled: boolean
  isLanding: boolean
}

interface NavLinkWrapperProps {
  isMenuOpen: boolean
}

// Main
function Navbar() {
  const location = useLocation()
  const isLanding = location.pathname === '/'

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(!isLanding)

  function onScroll() {
    setIsScrolled(document.documentElement.scrollTop > 100 * 5)
  }

  useEffect(() => {
    setIsScrolled(!isLanding)
    if (isLanding) document.addEventListener('scroll', onScroll)

    return () => {
      document.removeEventListener('scroll', onScroll)
    }
  }, [isLanding])

  return (
    <>
      <Nav isScrolled={isScrolled} isLanding={isLanding}>
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
const Nav = styled.nav<NavProps>`
  height: 5em;
  background-color: rgba(var(--nav-background), 0.867);
  backdrop-filter: blur(12px);

  display: flex;
  justify-content: space-between;
  padding: 0 1em;

  position: ${props => (props.isScrolled ? 'sticky' : 'fixed')};
  left: 0;
  right: 0;
  top: ${props => (props.isScrolled ? '0' : '-12%')};
  opacity: ${props => (props.isScrolled ? '1' : '0')};

  transition: top 1s ease-out,
    opacity 1s ease-out ${props => (props.isScrolled ? '500ms' : '1ms')};

  ${props => !props.isLanding && 'transition: none;'}

  :focus-within {
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
const NavLinkWrapper = styled.div<NavLinkWrapperProps>`
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
  }

  @media only screen and (max-height: 500px) {
    justify-content: flex-start;
    padding-top: 40vh;
    height: min-content;
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
