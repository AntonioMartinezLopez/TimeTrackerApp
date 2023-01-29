import styled from 'styled-components';

export const PlayButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  border: 0px;
  border-radius: 5px;
  color: #ffffff;
  line-height: 22.4px;
  text-align: center;
  font-size: 0.8rem;
  padding: 4px;
  margin: 0 2.5%;
  font-weight: bold;
  transition-duration: 250ms;
  
  outline: 0;
  &:hover,
  &:focus {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }
`;

export const StopButton = styled.button`
  background-color: ${(props) => props.theme.colors.secondaryFontColor};
  border: 0px;
  border-radius: 5px;
  color: #ffffff;
  line-height: 22.4px;
  text-align: center;
  font-size: 0.8rem;
  padding: 4px;
  margin: 0 2.5%;
  font-weight: bold;
  transition-duration: 250ms;
  
  outline: 0;
  &:hover,
  &:focus {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }
`;