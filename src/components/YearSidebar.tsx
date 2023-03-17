import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { IArtLocation } from '../galleryImages';
import { YEAR_RANGE } from '../config';
import valueRange from '../util/valueRange';
import { memo } from 'react';

interface IProps {
  sector: IArtLocation | undefined;
}

const YearRange = valueRange(YEAR_RANGE[0], YEAR_RANGE[1]).reverse();
function YearSidebar({ sector = 'main' }: IProps) {
  return (
    <>
      {YearRange.map(year => (
        <SidebarYear to={`/gallery/${year}/${sector}`} key={year}>
          {year}
        </SidebarYear>
      ))}
    </>
  );
}

const SidebarYear = styled(Link)`
  width: min-content;

  text-decoration: none;

  font-size: 2em;
  font-weight: bold;

  &:link,
  &:visited,
  &:active {
    color: inherit;
  }

  @media only screen and (min-width: 48rem) {
    rotate: 90deg;
  }
`;

export default memo(YearSidebar);
