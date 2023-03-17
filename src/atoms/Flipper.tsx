import styled from 'styled-components';
import { useState, useLayoutEffect, useRef } from 'react';

import { FLIPPER } from '../config';

// Types
interface IProps {
  initial?: string;
  current: string;
  delay?: number;
}

interface IFrontFlip {
  isFlipping: boolean;
}

const CHARACTERS = [
  ...Array.from(Array(26)).map((_, i) => String.fromCharCode(i + 65)),
  ...Array.from(Array(10)).map((_, i) => i.toString()),
  '.',
];

function randomString(
  length: number,
  charRange: [number, number] = [0, 26]
): string {
  if (charRange[0] < 0 || charRange[1] > CHARACTERS.length)
    throw new Error('Invalid character range');

  return new Array(length)
    .fill('')
    .map(
      () =>
        CHARACTERS[
          Math.floor(
            Math.random() * (charRange[1] - charRange[0]) + charRange[0]
          )
        ]
    )
    .join('');
}

// TODO: Borders around each character
function NumberFlipper({ initial, current, delay = 0 }: IProps) {
  const init = initial || new Array(current.length).fill('x').join('');

  const [state, setState] = useState({
    backTop: init.toUpperCase(),
    backBottom: init.toUpperCase(),
    frontTop: init.toUpperCase(),
    frontBottom: init.toUpperCase(),
    isFlipping: false,
  });
  const [flipTrigger, setFlipTrigger] = useState(true);

  // Ref
  const topFlip = useRef<HTMLDivElement>(null);
  const bottomFlip = useRef<HTMLDivElement>(null);
  const widthRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const curr = current.toUpperCase();
    if (curr === init) return;

    function flip(value: string) {
      refs.bottom?.removeEventListener('animationend', bottomEnd);
      refs.top?.removeEventListener('animationend', topEnd);
      setState(prev => {
        return {
          ...prev,
          backTop: value,
          frontBottom: value,
          isFlipping: true,
        };
      });

      function topEnd() {
        setState(prev => {
          return { ...prev, backBottom: value, frontTop: value };
        });
      }
      function bottomEnd() {
        setState(prev => {
          return { ...prev, isFlipping: false };
        });

        refs.bottom?.removeEventListener('animationend', bottomEnd);
        refs.top?.removeEventListener('animationend', topEnd);
      }
      bottomFlip.current?.addEventListener('animationend', bottomEnd);
      topFlip.current?.addEventListener('animationend', topEnd);
    }

    for (let i = 0; i < FLIPPER.MAX_ROTATIONS; i++) {
      const value = new RegExp(/\d{1,2}.\d{1,2}.\d{1,2}/).test(curr)
        ? curr
            .replaceAll(/\d/g, randomString(1, [27, 36]))
            .replaceAll(/\d{2}/g, randomString(2, [27, 36]))
        : randomString(curr.length, [0, 26]);

      setTimeout(() => {
        flip(value);
      }, FLIPPER.DELAY_INTERVAL * i + delay * Number(flipTrigger));
    }

    setTimeout(() => {
      flip(curr);
      setFlipTrigger(false);
    }, FLIPPER.DELAY_INTERVAL * (FLIPPER.MAX_ROTATIONS + 1) + delay * Number(flipTrigger) + FLIPPER.OFFSET_TIME);

    const refs = {
      bottom: bottomFlip.current,
      top: topFlip.current,
    };

    // Initial can be ignored, so that it doesn't trigger the animation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, flipTrigger, delay]);

  return (
    <FlipCard
      onClick={() => {
        if (!flipTrigger) setFlipTrigger(true);
      }}
      style={{ width: widthRef.current?.clientWidth }}
    >
      {/* Width calculator */}
      <Flip
        style={{ width: 'min-content', visibility: 'hidden' }}
        ref={widthRef}
      >
        {state.backTop}
      </Flip>
      {/**/}

      <BackTopFlip>{state.backTop}</BackTopFlip>
      <BackBottomFlip>{state.backBottom}</BackBottomFlip>

      <FrontTopFlip ref={topFlip} isFlipping={state.isFlipping}>
        {state.frontTop}
      </FrontTopFlip>
      <FrontBottomFlip ref={bottomFlip} isFlipping={state.isFlipping}>
        {state.frontBottom}
      </FrontBottomFlip>
    </FlipCard>
  );
}

const FlipCard = styled.div`
  user-select: none;

  cursor: pointer;

  position: relative;
  height: 1.5em;
  transition: width 500ms cubic-bezier(0.32, 0.32, 0.07, 0.94);
`;

const Flip = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 0.75em;
  border-radius: 5px;

  line-height: 1;
  padding: 0.25em 0.1em;
  background-color: var(--tertiary-background);
  overflow: hidden;
  white-space: nowrap;
  display: flex;

  @keyframes TopFlip {
    0% {
      transform: rotateX(0);
    }

    100% {
      transform: rotateX(90deg);
    }
  }
  @keyframes BottomFlip {
    0% {
      transform: rotateX(-90deg);
    }
    100% {
      transform: rotateX(0);
    }
  }
`;
const FrontFlip = styled(Flip)``;
const BackTopFlip = styled(Flip)`
  transform-origin: bottom;
`;
const FrontTopFlip = styled(FrontFlip)<IFrontFlip>`
  transform-origin: bottom;
  ${props => props.isFlipping && 'animation: TopFlip 200ms linear forwards;'}
`;

const BackBottomFlip = styled(Flip)`
  transform-origin: top;
  bottom: 0;
  top: auto;
  display: flex;
  align-items: flex-end;
`;
const FrontBottomFlip = styled(FrontFlip)<IFrontFlip>`
  transform-origin: top;
  bottom: 0;
  top: auto;
  display: flex;
  align-items: flex-end;
  transform: rotateX(-90deg);

  ${props =>
    props.isFlipping && 'animation: BottomFlip 200ms linear 200ms forwards;'}
`;

export default NumberFlipper;
