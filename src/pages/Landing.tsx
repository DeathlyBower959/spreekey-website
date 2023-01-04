// Packages
import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

// Assets
import HeroImage from '../assets/background/hero-section.jpg'
import GalleryImage from '../assets/background/gallery-section.jpg'
import CommissionsImage from '../assets/background/commissions-section.jpg'
import StoreImage from '../assets/background/store-section.jpg'

// Atoms
import LazyImage from '../atoms/LazyImage'

import Logo from '../atoms/icons/Logo'
import Watermark from '../atoms/icons/Watermark'
import KoFi from '../atoms/icons/socials/Ko-Fi'
import Instagram from '../atoms/icons/socials/Instagram'
import Twitter from '../atoms/icons/socials/Twitter'
import ToyHouse from '../atoms/icons/socials/ToyHouse'

// Types
interface SupportLowerInnerProps {
  target: string
  href: string
}

// Main
function Landing() {
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
        avid character designer and illustrator, adamant on expanding their
        knowledge
        <ReadMoreAbout to='/about'>Read more</ReadMoreAbout>
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

      <StoreSection>
        <Title>Store</Title>
        <SubHeader>Purchase some merchandise from my store</SubHeader>
        <Button to='/store'>Store</Button>
        <SectionBGImage src={StoreImage} />
      </StoreSection>
      {/* Push to secondary github branch */}

      <SupportSection>
        <SupportUpper target='_blank' href='https://ko-fi.com/spreekey'>
          <IconWrapper children={<KoFi />} />
          <SupportText>Support Me!</SupportText>
        </SupportUpper>
        <SupportDivider />
        <SupportLower>
          <SupportLowerInner
            target='_blank'
            href='https://www.instagram.com/spreekey/'
          >
            <IconWrapper children={<Instagram />} />
            <SupportText>@spreekey</SupportText>
          </SupportLowerInner>
          <SupportLowerInner
            target='_blank'
            href='https://www.twitter.com/spreekey/'
          >
            <IconWrapper children={<Twitter />} />
            <SupportText>@spreekey</SupportText>
          </SupportLowerInner>
          <SupportLowerInner
            target='_blank'
            href='https://www.toyhou.se/spreekey/'
          >
            <IconWrapper children={<ToyHouse />} />
            <SupportText>@spreekey</SupportText>
          </SupportLowerInner>
        </SupportLower>
      </SupportSection>
    </>
  )
}

const Section = styled.section`
  width: 100vw;
  height: auto;
  position: relative;
  overflow-y: hidden;
  /* box-shadow: 0 0 50px 50px var(--background) inset; */
  margin-bottom: 7rem !important;
`
const SectionBGImage = styled(LazyImage)`
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
  /* padding: 1.5em 0; */
  font-size: 1.5em;

  max-width: 45em;

  display: flex;
  flex-direction: column;
`
const MainSections = styled(Section)`
  height: 50em;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 2em;
`
const GallerySection = styled(MainSections).attrs({ id: 'gallery-section' })``
const CommissionsSection = styled(MainSections).attrs({
  id: 'commissions-section',
})``
const StoreSection = styled(MainSections).attrs({ id: 'store-section' })``
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

// About Me
const ReadMoreAbout = styled(Link)`
  text-decoration: none;
  color: var(--secondary-foreground);
  margin-top: 0.5em;
  font-size: 0.85em;
`

// Support Page
const SupportUpper = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;

  text-decoration: none;
`
const SupportLower = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 3em;
`
const SupportLowerInner = styled(SupportLower).attrs({
  as: 'a',
})<SupportLowerInnerProps>`
  gap: 0;
  text-decoration: none;
`
const SupportDivider = styled.hr`
  margin: 2em auto;
  width: 70%;
  border-color: var(--secondary-background);
`
const SupportText = styled.p`
  font-size: 2em;
  text-decoration: none;
  color: var(--foreground);

  @media only screen and (max-width: 500px) {
    font-size: 1.5em;
  }
`
const IconWrapper = styled.div`
  width: 6em;
  padding-right: 1em;
`

// UI
const Title = styled.h1`
  font-size: 3em;
  @media only screen and (max-width: 400px) {
    font-size: 2em;
  }
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
  border: 3px solid var(--foreground);
  color: var(--foreground);
  text-transform: uppercase;
  font-size: 1.25em;
  font-weight: bold;

  text-decoration: none;

  cursor: pointer;

  position: relative;

  transition: 500ms ease;
  &:before {
    background-color: var(--foreground);
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
    color: var(--accent);
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
