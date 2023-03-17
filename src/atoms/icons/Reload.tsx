import styled from 'styled-components';
import { TbRefresh } from 'react-icons/tb';

function ReloadIcon({ ...props }) {
  return <StyledReloadIcon {...props} />;
}

const StyledReloadIcon = styled(TbRefresh)`
  font-size: 2em;
  cursor: pointer;
`;

export default ReloadIcon;
