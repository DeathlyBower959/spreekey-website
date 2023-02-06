import styled from 'styled-components'

function Loader() {
  return (
    <DotWrapper>
      <LeftSide>
        <Dot className='dot'></Dot>
        <Dot className='dot'></Dot>
        <Dot className='dot'></Dot>
      </LeftSide>
      <RightSide>
        <Dot className='dot'></Dot>
        <Dot className='dot'></Dot>
        <Dot className='dot'></Dot>
      </RightSide>
    </DotWrapper>
  )
}

const DotWrapper = styled.div`
  position: absolute;
`
const Dot = styled.div`
  position: absolute;

  background-color: var(--accent);
  width: 15px;
  height: 15px;
  border-radius: 50%;
`

const Side = styled.div`
  position: relative;
`
const LeftSide = styled(Side)`
  .dot:nth-child(1) {
    animation: 1.5s ease AnimatePositionLeft-0 infinite forwards;
  }

  .dot:nth-child(2) {
    animation: 1.5s ease AnimatePositionLeft-1 infinite forwards;
  }

  .dot:nth-child(3) {
    animation: 1.5s ease AnimatePositionLeft-2 infinite forwards;
  }

  @keyframes AnimatePositionLeft-0 {
    25% {
      translate: -1rem;
      scale: 0.8;
    }
    50% {
      translate: -3rem;
      scale: 0.65;
    }
    75% {
      translate: -5rem;
      scale: 0.5;
    }
    100% {
      translate: 0;
      scale: 1;
    }
  }

  @keyframes AnimatePositionLeft-1 {
    25% {
      translate: -1rem;
      scale: 0.8;
    }
    50% {
      translate: -3rem;
      scale: 0.65;
    }
    75% {
      translate: -3rem;
      scale: 0.65;
    }
    100% {
      translate: 0;
      scale: 1;
    }
  }

  @keyframes AnimatePositionLeft-2 {
    25% {
      translate: -1rem;
      scale: 0.8;
    }
    75% {
      translate: -1rem;
      scale: 0.8;
    }
    100% {
      translate: 0;
      scale: 1;
    }
  }
`
const RightSide = styled(Side)`
  .dot:nth-child(1) {
    animation: 1.5s ease AnimatePositionRight-0 infinite forwards;
  }

  .dot:nth-child(2) {
    animation: 1.5s ease AnimatePositionRight-1 infinite forwards;
  }

  .dot:nth-child(3) {
    animation: 1.5s ease AnimatePositionRight-2 infinite forwards;
  }

  @keyframes AnimatePositionRight-0 {
    25% {
      translate: 1rem;
      scale: 0.8;
    }
    50% {
      translate: 3rem;
      scale: 0.65;
    }
    75% {
      translate: 5rem;
      scale: 0.5;
    }
    100% {
      translate: 0;
      scale: 1;
    }
  }

  @keyframes AnimatePositionRight-1 {
    25% {
      translate: 1rem;
      scale: 0.8;
    }
    50% {
      translate: 3rem;
      scale: 0.65;
    }
    75% {
      translate: 3rem;
      scale: 0.65;
    }
    100% {
      translate: 0;
      scale: 1;
    }
  }

  @keyframes AnimatePositionRight-2 {
    25% {
      translate: 1rem;
      scale: 0.8;
    }
    75% {
      translate: 1rem;
      scale: 0.8;
    }
    100% {
      translate: 0;
      scale: 1;
    }
  }
`

export default Loader
