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
export const ReplayButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <StyledButton {...props}>
            <svg viewBox="0 0 16 16" className="bi bi-play-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ fill: '#fff', height: '30px', width: '30px' }}>
                <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
            </svg>
        </StyledButton>
    );
};
