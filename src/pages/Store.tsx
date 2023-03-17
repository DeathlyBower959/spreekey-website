// Packages
import styled from 'styled-components';
import KoFi from '../atoms/icons/socials/Ko-Fi';

function Store() {
  return (
    <>
      <HeaderWrapper href='https://ko-fi.com/spreekey'>
        <IconWrapper children={<KoFi />} />
        <Header>Support Me!</Header>
      </HeaderWrapper>
      <Divider />
      <COMINGSOON>COMING SOON...</COMINGSOON>
    </>
  );
}

const HeaderWrapper = styled.a.attrs({ target: '_blank' })`
  margin-top: 5em;

  width: 100%;
  height: min-content;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  gap: 2em;

  @media only screen and (max-width: 48rem) {
    justify-content: center;
    flex-direction: column-reverse;
  }

  &:link,
  &:active,
  &:visited {
    color: inherit;
  }
`;

const Header = styled.h2`
  font-size: 4em;
`;
const IconWrapper = styled.div`
  width: 8em;
`;

const Divider = styled.hr`
  margin: 4em auto;
  width: 70%;
  border: 1px solid var(--secondary-background);
`;

// TODO: Store page, products, etc.
const COMINGSOON = styled.h3`
  text-align: center;
  font-size: 3em;
`;

export default Store;
