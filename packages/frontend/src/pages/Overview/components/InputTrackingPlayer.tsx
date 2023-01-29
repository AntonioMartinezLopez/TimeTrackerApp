import React, { useRef } from 'react';
import styled from 'styled-components';


const InputField = styled.input`
  background-color: transparent;
  
  border-width: 0;
  margin: 0 10px;
  height: 100%;
  width: 90%;
`;

const InputContainer = styled.div`
  border: 1px solid rgb(230, 230, 230);
  width: 100%;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  color: #000;
 
  height: 42px;
  margin: 0;

  &:focus-within {
    border: 1px solid ${(props) => props.theme.colors.primary};
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1), inset 0 0 0 2px ${(props) => props.theme.colors.primary};
  }
`;

export const InputTrackingPlayer = ({
  label,
  ...props
}: React.ComponentPropsWithoutRef<'input'> & {
  label: string;
  type?: 'text' | 'password' | 'number' | 'email';
  id: string;
}) => {

  return (
    <InputContainer>
      <InputField {...props} placeholder={label} />
     
    </InputContainer>
  );
};
