import styled from 'styled-components';

export const FormButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  border: 0px;
  border-radius: 5px;
  color: #ffffff;
  line-height: 22.4px;
  padding: 13.2px 26.4px;
  text-align: center;
  font-weight: bold;
  width: 100%;
  transition-duration: 250ms;
  margin-bottom: 16px;
  outline: 0;
  &:hover,
  &:focus {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }
`;

export const DangerButton = styled(FormButton)`
  background-color: #f44336;
`;
