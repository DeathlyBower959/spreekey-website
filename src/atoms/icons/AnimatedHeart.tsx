import styled, { css } from 'styled-components';

interface IProps {
  enabled: boolean;
  autoHide?: boolean;
}
interface IWrapper {
  enabled: boolean;
  autoHide: boolean;
}

function Heart({ autoHide = false, enabled }: IProps) {
  return (
    <Wrapper autoHide={autoHide} enabled={enabled}>
      <Circle autoHide={autoHide} enabled={enabled} />
      <svg
        width='100%'
        viewBox='0 0 91 90'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        color='#F14255'
      >
        <mask id='a' fill='#fff'>
          <path d='M44.207 89.61c1.733 1 2.84-.242 2.84-.242S72.41 62.841 83.837 47.564C93.999 33.898 94.66 10.867 77.209 2.261 59.755-6.344 45.397 12.385 45.397 12.385 32.945-3.31 14.099-2.515 5.383 8.106c-8.717 10.622-5.673 28.852.83 38.997 6.104 9.524 32.934 36.928 37.001 41.562 0 0 .296.355.993.946' />
        </mask>
        <path
          id='heartBody'
          d='M44.207 89.61c1.733 1 2.84-.242 2.84-.242S72.41 62.841 83.837 47.564C93.999 33.898 94.66 10.867 77.209 2.261 59.755-6.344 45.397 12.385 45.397 12.385 32.945-3.31 14.099-2.515 5.383 8.106c-8.717 10.622-5.673 28.852.83 38.997 6.104 9.524 32.934 36.928 37.001 41.562 0 0 .296.355.993.946'
          fill={'currentColor'}
        />
        <path
          id='heartStroke'
          d='m47.048 89.368-4.48-3.991.07-.079.073-.076 4.337 4.146Zm36.788-41.804 4.814 3.58-.005.007-.004.007-4.805-3.594ZM77.209 2.261l2.653-5.381-2.653 5.381ZM45.397 12.385l4.761 3.65-4.68 6.105-4.781-6.026 4.7-3.73ZM5.383 8.106.744 4.3l4.639 3.806Zm.83 38.997 5.051-3.238-5.051 3.238Zm37.001 41.562 4.51-3.957.049.056.048.057-4.607 3.844Zm3.992-4.251a3.31 3.31 0 0 0-1.408-.405 3.892 3.892 0 0 0-1.634.24 3.774 3.774 0 0 0-1.303.824 4.838 4.838 0 0 0-.257.263l-.018.02-.01.01c0 .002-.003.005-.004.006-.002.002-.004.005 4.476 3.996 4.48 3.991 4.477 3.994 4.475 3.997l-.005.005-.01.01-.019.022-.041.045a6.985 6.985 0 0 1-.315.32 8.222 8.222 0 0 1-2.742 1.714c-2.07.778-4.667.778-7.182-.673l5.997-10.394Zm-.158 4.954-4.337-4.146v-.001l.003-.003a2.712 2.712 0 0 0 .066-.069l.21-.22.815-.858a969.614 969.614 0 0 0 12.913-13.913c7.77-8.542 16.79-18.804 22.313-26.187l9.61 7.187C82.737 59.05 73.364 69.69 65.596 78.232A982.22 982.22 0 0 1 51.68 93.204l-.218.23a107.657 107.657 0 0 1-.072.075l-.004.004h-.001l-4.337-4.145ZM79.02 43.984c4.232-5.69 6.493-13.414 5.88-20.447-.599-6.856-3.837-12.685-10.346-15.895L79.862-3.12c10.944 5.396 16.1 15.385 16.993 25.613.877 10.05-2.273 20.676-8.205 28.651l-9.629-7.16ZM74.555 7.643c-6.167-3.041-11.832-1.449-16.617 1.541-2.393 1.495-4.379 3.246-5.779 4.648a31.572 31.572 0 0 0-1.565 1.681 19.243 19.243 0 0 0-.442.53l-.007.01.005-.006.003-.005.003-.003c.001-.002.002-.004-4.76-3.654-4.76-3.65-4.76-3.653-4.758-3.655l.004-.004.008-.01.02-.026c.014-.02.033-.043.055-.07.044-.057.103-.13.175-.22.145-.18.347-.423.602-.72.51-.59 1.239-1.398 2.165-2.326 1.838-1.841 4.532-4.235 7.911-6.346 6.758-4.223 16.999-7.692 28.284-2.128L74.555 7.643Zm-33.858 8.471C30.21 2.898 15.909 4.738 10.02 11.913L.745 4.3C12.29-9.768 35.679-9.517 50.097 8.656l-9.4 7.458ZM10.02 11.913c-3.063 3.731-4.366 9.23-3.944 15.465.42 6.205 2.512 12.314 5.187 16.487L1.161 50.341c-3.828-5.972-6.509-14.051-7.057-22.153C-6.442 20.117-4.91 11.19.744 4.3l9.277 7.613Zm1.243 31.952c2.699 4.211 10.495 13.002 18.617 21.777 7.776 8.402 15.76 16.692 17.843 19.066l-9.02 7.915c-1.984-2.26-9.448-9.99-17.63-18.83C13.238 65.327 4.567 55.654 1.16 50.341l10.103-6.476Zm31.95 44.8c4.607-3.844 4.606-3.844 4.605-3.845v-.002c-.002 0-.002-.002-.003-.003l-.005-.005a3.065 3.065 0 0 1-.059-.07 2.564 2.564 0 0 0-.042-.047c-.02-.021-.02-.021 0-.001.039.04.16.158.375.34L40.33 94.19a17.876 17.876 0 0 1-1.14-1.047 12.121 12.121 0 0 1-.485-.519l-.052-.06-.023-.028a7.75 7.75 0 0 1-.011-.013l-.006-.006a.071.071 0 0 0-.002-.003l-.002-.002 4.606-3.846Z'
          fill={'currentColor'}
          mask='url(#a)'
        />
      </svg>
    </Wrapper>
  );
}

const HeartAnimationString = (props: any, name: string) =>
  props.enabled &&
  `animation: 800ms cubic-bezier(0.66, 0.03, 0.27, 1.34) forwards ${name};`;
const Wrapper = styled.div<IWrapper>`
  cursor: pointer;
  position: relative;

  path#heartBody {
    color: transparent;

    ${props => HeartAnimationString(props, 'AnimateHeartBodyColor')}
  }

  path#heartStroke {
    transition: color 200ms ease;
    color: ${props => (!props.autoHide ? '#999' : 'transparent')};

    ${props => HeartAnimationString(props, 'AnimateHeartStrokeColor')}
  }

  path#heartBody:hover + path#heartStroke {
    color: ${props => (!props.autoHide ? 'currentColor' : 'transparent')};
  }

  svg {
    ${props => HeartAnimationString(props, 'AnimateHeartPosition')}
  }

  @keyframes AnimateHeartPosition {
    0% {
      scale: 1;
    }
    20% {
      scale: 0;
    }
    65% {
      scale: 0;
    }
    100% {
      scale: 1;
    }
  }

  @keyframes AnimateHeartBodyColor {
    65% {
      color: transparent;
    }
    100% {
      color: currentColor;
    }
  }

  @keyframes AnimateHeartStrokeColor {
    65% {
      color: #999;
    }
    100% {
      color: currentColor;
    }
  }
`;

const Circle = styled.div<IWrapper>`
  display: inline;
  height: 0;
  aspect-ratio: 1/1;
  border-radius: 50%;

  box-sizing: border-box;
  border: 0 solid #f14294;

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;

  ${props =>
    props.enabled &&
    css`
      animation: 550ms cubic-bezier(0.66, 0.03, 0.27, 1.34) forwards
        AnimateCircle;
    `}

  @keyframes AnimateCircle {
    0% {
      height: 0;
    }
    70% {
      height: 105%;
      border-width: 35px;
      border-color: #f14294;
      opacity: 1;
    }
    85% {
      border-color: #e242f1;
    }
    100% {
      height: 140%;
      border-width: 0;
    }
  }
`;

export default Heart;
