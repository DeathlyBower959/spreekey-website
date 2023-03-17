// Packages
import styled from 'styled-components';
import { memo } from 'react';

// Atoms
import Logo from '../atoms/icons/Logo';
import Instagram from '../atoms/icons/socials/Instagram';
import KoFi from '../atoms/icons/socials/Ko-Fi';
import ToyHouse from '../atoms/icons/socials/ToyHouse';
import Twitter from '../atoms/icons/socials/Twitter';

// Main
function Footer() {
  return (
    <FooterWrapper>
      <InnerWrapper>
        <SectionWrapperLeft>
          <Name>spreekey</Name>
          <Copyright>
            © Spreekey {new Date().getFullYear() - 1}-{new Date().getFullYear()}
          </Copyright>
        </SectionWrapperLeft>

        <SectionWrapperRight>
          <SocialWrapper>
            <Social
              aria-label='Instagram'
              href='https://instagram.com/spreekey'
              children={<Instagram />}
            />
            <Social
              aria-label='Toy House'
              href='https://toyhou.se/spreekey'
              children={<ToyHouse />}
            />
            <Social
              aria-label='Twitter'
              href='https://twitter.com/spreekey'
              children={<Twitter />}
            />
            <Social
              aria-label='Ko Fi'
              href='https://ko-fi.com/spreekey'
              children={<KoFi />}
            />
          </SocialWrapper>
        </SectionWrapperRight>
      </InnerWrapper>

      <FooterBackground>
        <Logo color='#0000002a' />
      </FooterBackground>
    </FooterWrapper>
  );
}

const FooterWrapper = styled.footer`
  background-color: var(--secondary-background);
  height: 10em;

  position: relative;

  display: flex;
  justify-content: center;

  margin-top: auto;
  justify-self: flex-end;
`;

const InnerWrapper = styled.div`
  height: 100%;
  width: 80%;
  display: flex;

  justify-content: space-between;
  align-items: center;

  @media only screen and (max-width: 31rem) {
    text-align: center;
    flex-direction: column;
    justify-content: space-evenly;
  }

  z-index: 1;
`;

const SectionWrapperLeft = styled.div``;
const SectionWrapperRight = styled.div``;

const FooterBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  left: 0;
  top: 0;

  display: flex;
  justify-content: center;
  padding: 1em;

  pointer-events: none;
`;

const Name = styled.h1`
  color: var(--foreground);
`;

const Copyright = styled.p`
  color: var(--secondary-foreground);
`;

const SocialWrapper = styled.div`
  display: flex;
  gap: 1em;
`;

const Social = styled.a.attrs({ target: '_blank' })`
  width: 2em;
  height: 2em;
  display: flex;
  justify-content: center;
  align-items: center;

  > *,
  > * > path,
  > * > circle {
    color: var(--secondary-foreground);
    stroke: var(--secondary-foreground);
  }
  .kofiSVG > * {
    fill: var(--secondary-foreground);
  }
  .kofiHeart {
    fill: red;
  }

  #instagram-circle {
    fill: var(--secondary-foreground);
  }

  #toyhouse-text {
    fill: #888;
  }
`;

export default memo(Footer);
