// Packages
import styled from 'styled-components'

// Assets
import AboutImage from '../assets/background/about-hero.jpg'

// Atoms
import LazyImage from '../atoms/LazyImage'

function About() {
  return (
    <Wrapper>
      <Image src={AboutImage} />
      <TextWrapper>
        <Title>spreekey</Title>
        <Content>
          An artist who enjoys character design, illustration, and story-making.
          Has been drawing for over 6 years, primarily digitally: working to
          improve their skill and experience in the industry. 5th Generation
          IPad Mini and an offbrand apple pencil as the tools of the trade.
          Hoping to work on animations and web-comics in the future, with{' '}
          <InnerLink href='https://toyhou.se/spreekey/characters'>
            personal characters
          </InnerLink>{' '}
          and stories.
        </Content>
        <SocialsWrapper>
          <SocialTitle>
            twitter:{' '}
            <SocialLink href='https://twitter.com/spreekey'>
              @spreekey
            </SocialLink>
          </SocialTitle>
          <SocialTitle>
            toyhouse:{' '}
            <SocialLink href='https://toyhou.se/spreekey'>spreekey</SocialLink>
          </SocialTitle>
          <SocialTitle>
            instagram:{' '}
            <SocialLink href='https://instagram.com/spreekey'>
              @spreekey
            </SocialLink>
          </SocialTitle>
          <SocialTitle>
            ko-fi:{' '}
            <SocialLink href='https://ko-fi.com/spreekey'>spreekey</SocialLink>
          </SocialTitle>
        </SocialsWrapper>
      </TextWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100vw;
  min-height: calc(100vh - 5em);

  display: grid;
  justify-items: center;

  @media only screen and (max-width: 768px) {
    margin: 1.5em 0;
  }
`

const Image = styled(LazyImage)`
  width: 600px;
  height: 800px;

  object-fit: cover;

  margin-top: 8rem;
  /* transform: translateX(-200px); */
  margin-right: 200px;

  @media only screen and (max-width: 768px) {
    width: 95vw;
    margin-top: 3rem;

    margin-right: 0;
  }

  grid-row: 1;
  grid-column: 1;

  z-index: -1;
`

const TextWrapper = styled.div`
  background-color: var(--secondary-background);
  padding: 2em;
  box-shadow: rgba(0, 0, 0, 0.15) -3px -3px 6px,
    rgba(0, 0, 0, 0.25) -4px -3px 6px;

  width: 500px;
  height: 800px;

  /* margin-top: 8rem; */
  /* transform: translateX(200px) translateY(50px); */
  margin-left: 200px;
  margin-top: calc(8rem + 50px);
  margin-bottom: 8rem;

  font-size: 1.2em;

  border: 20px solid var(--tertiary-background);

  line-height: 200%;

  @media only screen and (max-width: 768px) {
    width: 90vw;
    height: min-content;
    min-width: 260px;
    border-width: 15px;
    padding: 1.5em;
    font-size: 1em;

    margin-left: 0;
    margin-bottom: 0;
  }

  > * {
    margin-bottom: 1em;
  }

  grid-row: 1;
  grid-column: 1;
`

const Title = styled.h1``
const Content = styled.p``
const InnerLink = styled.a.attrs({ target: '_blank' })`
  color: var(--link-accent);
`

const SocialsWrapper = styled.div`
  margin-bottom: 0 !important;
  line-height: 115%;
`
const SocialTitle = styled.p``
const SocialLink = styled.a.attrs({ target: '_blank' })`
  color: var(--link-accent);
`

export default About
