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
export const StopButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <StyledButton {...props}>
      <svg viewBox="0 0 16 16" className="bi bi-stop-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ fill: '#fff', height: '30px', width: '30px' }}>
        <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z" />
      </svg>
    </StyledButton>
  );
};
