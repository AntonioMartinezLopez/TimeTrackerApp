import React from 'react';
import styled from 'styled-components';

export const Button = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  border: 0px;
  border-radius: 5px;
  color: #ffffff;
  
  text-align: center;
  font-size: 1.1rem;
  font-weight: bold;
  transition-duration: 250ms;
  margin: 16px 0;
  outline: 0;
  &:hover,
  &:focus {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }
`;

export const AddButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <Button {...props}></Button>
  )
}