// Packages
import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { Squeeze as SqueezeMenu } from 'hamburger-react';
import { ImBookmark } from 'react-icons/im';

// Atoms
import Logo from '../atoms/icons/Logo';
import { isMobile } from 'react-device-detect';

// Types
interface INavProps {
  isMenuOpen: boolean;
  positionType?: string;
}
interface INavLinkWrapperProps {
  isMenuOpen: boolean;
}
interface IMenuOpenState {
  isScrolled: boolean;
  isHovered: boolean;
}

const shouldHidePathURLs = [
  { path: '/', type: ['scroll', 'hover'], position: 'fixed' },
  { path: '/gallery', type: ['hover'], position: 'fixed', check: 'includes' },
];
function getPathURLConfig(path: string) {
  return shouldHidePathURLs.find(x =>
    x.check === 'includes' ? path.includes(x.path) : x.path === path
  );
}

// Main
function Navbar() {
  // Hooks
  const location = useLocation();

  // State
  const [isMenuOpen, setIsMenuOpen] = useState<IMenuOpenState | boolean>({
    isScrolled: false,
    isHovered: false,
  });
  const menuOpen =
    typeof isMenuOpen === 'object'
      ? isMenuOpen.isHovered || isMenuOpen.isScrolled
      : isMenuOpen;

  // Events
  function onScroll() {
    if (window.innerWidth < 768) return;
    setIsMenuOpen(prev => {
      if (typeof prev === 'object')
        return {
          ...prev,
          isScrolled: document.documentElement.scrollTop > 100 * 5,
        };
      else
        return {
          isHovered: false,
          isScrolled: document.documentElement.scrollTop > 100 * 5,
        };
    });
  }

  // FIX: When screen is resized, the menu doesnt work properly with mouse over
  // This is because it only checks if its in a certain threshold, not if its touching the element
  // Optimize both functions but not repetitively mutating state.
  function onMouseMove(e: MouseEvent) {
    if (window.innerWidth < 768) return;
    setIsMenuOpen(prev => {
      if (typeof prev === 'object')
        return {
          ...prev,
          isHovered:
            e.clientY <=
            3 * parseFloat(getComputedStyle(document.documentElement).fontSize),
        };
      else
        return {
          isScrolled: false,
          isHovered:
            e.clientY <=
            3 * parseFloat(getComputedStyle(document.documentElement).fontSize),
        };
    });
  }

  // Effect
  useEffect(() => {
    onScroll();
    if (!location.pathname.includes('gallery')) window.scrollTo(0, 0);
    const shouldHideConfig = getPathURLConfig(location.pathname);

    if (isMobile) return setIsMenuOpen(false);
    if (!shouldHideConfig) return setIsMenuOpen(true);

    if (shouldHideConfig.type.includes('scroll'))
      document.addEventListener('scroll', onScroll);
    if (shouldHideConfig.type.includes('hover'))
      document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('scroll', onScroll);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [location.pathname]);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <>
      <NavBookmark />
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
            <NavLink onClick={closeMenu} to='/gallery'>
              Gallery
            </NavLink>
            <NavLink onClick={closeMenu} to='/commissions'>
              Commissions
            </NavLink>
            <NavLink onClick={closeMenu} to='/store'>
              Store
            </NavLink>
            <NavLink onClick={closeMenu} to='/about'>
              About
            </NavLink>
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
  );
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

  @media only screen and (max-width: 48rem) {
    top: 0;
    opacity: 1;
    position: sticky;
  }

  z-index: 999999;
`;
const NavBookmark = styled(ImBookmark)`
  position: fixed;
  top: 0;
  right: 5vw;
  z-index: 999998;

  opacity: 0.5;
  width: 30px;
  height: 30px;
  filter: drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4));

  @media only screen and (max-width: 48rem) {
    display: none;
  }
`;
const NavInner = styled.div`
  width: max-content;
  height: 100%;
  padding: 0.5em;

  display: flex;
  align-items: center;
  gap: 1em;
`;
const NavInnerLeft = styled(NavInner)`
  padding: 0.75em 0.5em;
  text-decoration: none;
  user-select: none;
`;
const NavInnerRight = styled(NavInner)`
  padding: 0.5em 0.25em;
`;
const NavLink = styled(Link)`
  text-decoration: none;
  color: var(--foreground);
  font-size: 1.1em;
`;
const NavLinkWrapper = styled.div<INavLinkWrapperProps>`
  display: flex;
  align-items: center;
  gap: 2em;

  @media only screen and (max-width: 48rem) {
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

    @media only screen and (max-height: 46rem) {
      padding-top: 125px;
      justify-content: flex-start;
    }
  }
`;

const NavName = styled.p`
  color: var(--foreground);
  user-select: none;
  font-size: clamp(1.3em, 2vw, 2em);

  font-weight: bold;
`;
const SqueezeWrapper = styled.div`
  display: none;

  @media only screen and (max-width: 48rem) {
    display: block;
  }
`;

export default Navbar;
