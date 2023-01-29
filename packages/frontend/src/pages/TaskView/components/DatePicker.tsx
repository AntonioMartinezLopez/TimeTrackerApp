import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";
 import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import styled from "styled-components";

const InputContainer = styled.div`
 border: 0px solid rgb(230, 230, 230);
 width: 100%;
 border-radius: 5px;
 display: flex;
 flex-direction: row;
 background-color: #ffffff;
 color: #000;
 
 height: 42px;
 margin: 0;
 align-items: center;
 &:focus-within {
   border: 1px solid ${(props) => props.theme.colors.primary};
   box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1), inset 0 0 0 2px ${(props) => props.theme.colors.primary};
 }
 & > * > * > input {
    border: 0px;
    width: 100%;
    heigth: 100%;
    margin-left: 5px;
    font-size: 0.75rem;

 }
`
 
export const FormDatePicker: React.FC<{onDateChanged: (date:Date) => void, startingDate: Date}> = ({onDateChanged, startingDate}) => {
  const [startDate, setStartDate] = useState<any>(startingDate);

  useEffect(() => {
      onDateChanged(startDate);
  }, [startDate])
  return (
      <InputContainer className="datePicker">
        <DatePicker className="react-datepicker" wrapperClassName="datePicker" selected={startDate} onChange={date => setStartDate(date)} />
      </InputContainer>
    
  );
};