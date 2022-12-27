import React from 'react'
import styled from 'styled-components'

import Footer from '../components/Footer'

import Logo from '../atoms/icons/Logo'
import Watermark from '../atoms/icons/Watermark'

import HeroImage from '../assets/background/hero-section.jpg'
import GalleryImage from '../assets/background/gallery-section.jpg'
import CommissionsImage from '../assets/background/commissions-section.jpg'

import { Link } from 'react-router-dom'
import KoFi from '../atoms/icons/socials/Ko-Fi'
import Instagram from '../atoms/icons/socials/Instagram'
import Twitter from '../atoms/icons/socials/Twitter'
import ToyHouse from '../atoms/icons/socials/ToyHouse'

const Landing: React.FC<{}> = () => {
  return (
    <>
      <HeroSection>
        <LogoWrapper>
          <LogoContainer>
            <Logo color='#eee' />
          </LogoContainer>
          <LogoContainer style={{ height: 'auto' }}>
            <Watermark color='var(--accent)' />
          </LogoContainer>
        </LogoWrapper>
        <SectionBGImage src={HeroImage} />
      </HeroSection>

      <AboutMeSection>
        illustrator and avid character designer Lorem ipsum dolor sit, amet
        consectetur adipisicing elit. Mollitia quod nihil, quaerat pariatur
        earum, neque laboriosam voluptatem sint, saepe accusantium consequuntur
        provident. Dolore, dolorem. Culpa consequatur, praesentium debitis illum
        nihil facere beatae velit a, itaque odio exercitationem? In, beatae
        maxime.
      </AboutMeSection>

      <GallerySection>
        <Title>Art Hall</Title>
        <SubHeader>A walkthrough display of all of my artwork</SubHeader>
        <Button to='/gallery'>Gallery</Button>
        <SectionBGImage src={GalleryImage} />
      </GallerySection>

      <CommissionsSection>
        <Title>Commissions</Title>
        <SubHeader>Request a customized art piece from me</SubHeader>
        <Button to='/commissions'>Commissions</Button>
        <SectionBGImage src={CommissionsImage} />
      </CommissionsSection>

      <StoreSection></StoreSection>
      {/* Push to secondary github branch */}

      <SupportSection>
        <SupportUpper>
          <IconWrapper children={<KoFi />} />
          <SupportText as={Link} to='/support'>
            Support Me!
          </SupportText>
        </SupportUpper>
        <SupportDivider />
        <SupportLower>
          <SupportLowerInner>
            <IconWrapper children={<Instagram />} />
            <SupportText
              target='_blank'
              href='https://www.instagram.com/spreekey/'
            >
              @spreekey
            </SupportText>
          </SupportLowerInner>
          <SupportLowerInner>
            <IconWrapper children={<Twitter />} />
            <SupportText
              target='_blank'
              href='https://www.twitter.com/spreekey/'
            >
              @spreekey
            </SupportText>
          </SupportLowerInner>
          <SupportLowerInner>
            <IconWrapper children={<ToyHouse />} />
            <SupportText target='_blank' href='https://www.toyhou.se/spreekey/'>
              spreekey
            </SupportText>
          </SupportLowerInner>
        </SupportLower>
      </SupportSection>

      <Footer></Footer>
    </>
  )
}

const Section = styled.section`
  width: 100vw;
  height: auto;
  position: relative;
  overflow-y: hidden;
  /* box-shadow: 0 0 50px 50px var(--background) inset; */
  margin-bottom: 5rem !important;
`
const SectionBGImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;

  left: 50%;
  top: 0;
  right: 0;
  bottom: 0;
  transform: translateX(-50%);

  filter: brightness(0.35) blur(5px);
  z-index: -2;
`

// Sections
const HeroSection = styled(Section).attrs({ id: 'hero-section' })`
  height: 100vh;
`
const AboutMeSection = styled(Section).attrs({ id: 'about-me-section' })`
  width: 80%;
  margin: 0 auto;
  text-align: center;
  padding: 1.5em 0;
  font-size: 1.5em;

  max-width: 45em;
`
const GallerySection = styled(Section).attrs({ id: 'gallery-section' })`
  height: 30em;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 2em;
`
const CommissionsSection = styled(Section).attrs({
  id: 'commissions-section',
})`
  height: 30em;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 2em;
`
const StoreSection = styled(Section).attrs({ id: 'store-section' })``
const SupportSection = styled(Section).attrs({ id: 'support-section' })``

// Hero Page
const LogoWrapper = styled.div`
  width: 100%;
  height: 100%;

  padding: 10% 10%;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`
const LogoContainer = styled.div`
  height: min(50vw, 50vh);
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`

// Support Page
const SupportUpper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const SupportLower = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 3em;
`
const SupportLowerInner = styled(SupportLower)`
  gap: 0;
`
const SupportDivider = styled.hr`
  margin: 2em auto;
  width: 70%;
  border-color: var(--secondary-background);
`
const SupportText = styled.a`
  font-size: 2em;
  text-decoration: none;
  color: var(--foreground);
`
const IconWrapper = styled.div`
  width: 6em;
  padding-right: 1em;
`

// UI
const Title = styled.h1`
  font-size: 3em;
`
const SubHeader = styled.h3`
  text-align: center;
  margin-left: 1em;
  margin-right: 1em;
`
// TODO: Find a better font
const Button = styled(Link)`
  padding: 1em 2em;
  background-color: transparent;
  border: 3px solid var(--accent);
  color: var(--accent);
  text-transform: uppercase;
  font-size: 1.25em;
  font-weight: bold;

  text-decoration: none;

  cursor: pointer;

  position: relative;

  transition: 500ms ease;
  &:before {
    background-color: var(--accent);
    content: '';
    display: block;
    position: absolute;
    top: 100%;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    -webkit-transition: all 0.35s ease;
    transition: all 0.35s ease;
  }

  &:hover:before {
    top: 0;
  }

  &:hover {
    color: var(--foreground);
    transition: 0.25s;
  }

  &:after {
    position: absolute;
    right: 2.34375rem;
    top: 50%;
    -webkit-transform: translateY(-50%) translateX(50%);
    -ms-transform: translateY(-50%) translateX(50%);
    transform: translateY(-50%) translateX(50%);
    font-size: 1.75em;
  }
`

export default Landing
