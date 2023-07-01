import { memo } from 'react';
import styled from 'styled-components';

function Animated(props: any) {
  return (
    <StyledSVG
      width='1em'
      height='1em'
      viewBox='0 0 942 899'
      fill='none'
      {...props}
    >
      <title>{props.title}</title>
      <g fill='currentColor'>
        <path
          id='small'
          d='M137.908 79.0924C161.209 102.394 217 108.5 217 108.5C217 108.5 161.209 114.606 137.908 137.908C114.606 161.209 108.5 217 108.5 217C108.5 217 102.394 161.209 79.0924 137.908C55.7908 114.606 0 108.5 0 108.5C0 108.5 55.7908 102.394 79.0924 79.0924C102.394 55.7908 108.5 0 108.5 0C108.5 0 114.606 55.7908 137.908 79.0924Z'
          fill='currentColor'
        />
        <path
          id='medium'
          d='M817.347 681.652C854.071 718.377 942 728 942 728C942 728 854.071 737.623 817.347 774.348C780.623 811.072 771 899 771 899C771 899 761.376 811.072 724.652 774.348C687.928 737.623 600 728 600 728C600 728 687.928 718.377 724.652 681.652C761.376 644.928 771 557 771 557C771 557 780.623 644.928 817.347 681.652Z'
          fill='currentColor'
        />
        <path
          id='big'
          d='M486.349 350.651C557.543 421.844 728 440.5 728 440.5C728 440.5 557.543 459.156 486.349 530.349C415.156 601.543 396.5 772 396.5 772C396.5 772 377.844 601.543 306.651 530.349C235.457 459.156 65 440.5 65 440.5C65 440.5 235.457 421.844 306.651 350.651C377.844 279.457 396.5 109 396.5 109C396.5 109 415.156 279.457 486.349 350.651Z'
          fill='currentColor'
        />
      </g>
    </StyledSVG>
  );
}

const StyledSVG = styled.svg`
  --duration: 2s;

  #small {
    transform-origin: 10% 10%;
    scale: 1;

    @keyframes small {
      0% {
        scale: 1;
      }
      50% {
        scale: 1.5;
      }
      100% {
        scale: 1;
      }
    }

    animation: small var(--duration) ease-in-out infinite;
  }

  #medium {
    transform-origin: 80% 80%;
    scale: 1;

    @keyframes medium {
      0% {
        scale: 1;
      }
      55% {
        scale: 0.5;
      }
      100% {
        scale: 1;
      }
    }

    animation: medium var(--duration) ease-in-out infinite;
  }

  #big {
    transform-origin: 50% 50%;
    scale: 1;

    @keyframes big {
      0% {
        scale: 1;
        opacity: 1;
      }
      50% {
        opacity: 0.75;
      }
      60% {
        scale: 0.94;
      }
      100% {
        scale: 1;
        opacity: 1;
      }
    }

    animation: big var(--duration) ease-in-out infinite;
  }
`;

const MemoAnimated = memo(Animated);
export default MemoAnimated;
