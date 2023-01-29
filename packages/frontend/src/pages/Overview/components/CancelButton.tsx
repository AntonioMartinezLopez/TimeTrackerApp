import React from 'react';
import styled from 'styled-components';

export const StyledButton = styled.button`
  heigth: 24px;
  width: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: lightgrey;
  padding: 0;
  transition-duration: 250ms;
  &:hover,
  &:focus {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }
`;
export const CancelButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <StyledButton type="reset" {...props}>
            <svg viewBox="0 0 16 16" className="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ fill: 'grey', height: '16px', width: '16px' }}>
                <path fillRule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
        </StyledButton>
    );
};
