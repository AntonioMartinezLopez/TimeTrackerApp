import React from "react";
import { useContext } from "react";
import { PlayButton, StopButton } from "../../Overview/components/RowButton";
import { formatTime, StyledTableCell, TaskTableRow } from "../../Overview/components/TaskList";

import { calculateTotalTime, TrackingElement } from "../TaskViewPage";

export type TrackingItemProps = {
    trackingElement: TrackingElement;
    clickEdit: () => void;
    reload: () => void;
  }





export const TrackingItem: React.FC<TrackingItemProps> = ({ trackingElement, clickEdit = () => undefined, reload}) => {
    
    const deleteTracking = async () => {
  
      await fetch(`/api/tracking/${trackingElement.id}`, {
        headers: { 'Content-Type': 'application/json'},
        method: 'DELETE',
      });
      reload();
    }

    const editTime = (DateString: string) => {
      const calendarDay = DateString.slice(0,10);
      const time = DateString.slice(11, 19);
      return (calendarDay+ " " + time);
    }
    
  
    return (
      <TaskTableRow data-testid="tracking-item">
        <StyledTableCell component="th" scope="row">{trackingElement.description}</StyledTableCell>
        <StyledTableCell align="center">{editTime(trackingElement.startTime)}</StyledTableCell>
    <StyledTableCell align="center">{editTime(trackingElement.endTime)}</StyledTableCell>
        <StyledTableCell align="center">{formatTime(trackingElement.totalTime? trackingElement.totalTime: 0)}</StyledTableCell>
        <StyledTableCell align="center">
          <div>
            <PlayButton onClick={() => {clickEdit()}}>Edit</PlayButton>
            <PlayButton onClick={() => {deleteTracking()}}>Delete</PlayButton>
          </div>
        </StyledTableCell>
      </TaskTableRow>
    );
  }