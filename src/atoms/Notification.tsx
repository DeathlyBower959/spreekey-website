import React, { useState } from 'react';
import styled from 'styled-components';

interface IProps {
  children: JSX.Element | string;
}
interface INotificationWrapper {
  isOpen: boolean;
}

function Notification({ children }: IProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <NotificationWrapper isOpen={isOpen}>
      <TextWrapper>{children}</TextWrapper>
      <CloseButton onClick={() => setIsOpen(false)}>x</CloseButton>
    </NotificationWrapper>
  );
}

const NotificationWrapper = styled.div<INotificationWrapper>`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  height: 7em;
  background-color: var(--tertiary-background);

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em 1em 1em 2em;

  transition: bottom 500ms ease-out;

  ${props =>
    !props.isOpen &&
    `
    bottom: -7em;
  `}

  overflow: hidden;
`;

const TextWrapper = styled.div`
  font-size: 1.1em;
`;

const CloseButton = styled.button`
  padding: 0.5em 1em;
  background-color: transparent;
  border: none;
  color: inherit;
  font-size: 2em;

  cursor: pointer;
`;

export default Notification;
