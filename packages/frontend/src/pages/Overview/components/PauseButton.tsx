import React from 'react';
import styled from 'styled-components';

export const StyledButton = styled.button`
  width: 48px;
  border: 0px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: ${(styledProps) => styledProps.theme.colors.primary};
  margin-left: 20px;
  transition-duration: 250ms;
  &:hover,
  &:focus {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }
`;
export const PauseButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (    
        <StyledButton {...props}>
          <svg viewBox="0 0 16 16" className="bi bi-pause-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ fill: '#fff', height: '30px', width: '30px' }}>
  <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
</svg>
        </StyledButton>
      );
};
