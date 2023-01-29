import { TableCell, TableRow, TableContainer, Paper, Table, TableHead, TableBody } from '@material-ui/core';
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { runningTaskContext } from '../../../contexts/RunningTaskContext';
import { removePersistedData } from './CurrentTrackingBox';
import { PlayButton, StopButton } from './RowButton';


export const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: '#718792',
      color: theme.palette.common.white,
      fontWeight: 'bold',
      fontSize: 16,
      margin: 0,
      padding: 8
    },
    body: {
      fontSize: 14,
      margin: 0,
      padding: 8
    },
  }),
)(TableCell);

export const TaskTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
      'transition-duration': '250ms',
      '&:hover,&:focus': {
        transform: 'translateY(-2px)',
        boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
      },
    }
  }),
)(TableRow);

const LabelList = styled.ul`
list-style: none;
flex-grow: 1;
font-size: 0.8rem;
padding:0;
align-self: flex-end;
fley-wrap: wrap;
justify-content: center;
display: flex;
margin: 0;
& > li {
  padding: 0.125rem;
  font-weight: bold;
  border-radius: 0.25rem;
  background-color: ${props => props.theme.colors.primary};
  color: #ffffff;
  margin-right: 5px;
}
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${(props) => props.theme.colors.fontColor};
`

export const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export type Label = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}


export type Tracking = {
  id: string;
  description: string;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type Task = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  labels: Label[];
  trackings: Tracking[];
}

export type TaskItemProps = {
  task: Task;
  reload: () => void;
  stopTracking: () => void;
}

export const formatTime = (totalTime:number) => {

  const milliseconds = totalTime % 1000;

  totalTime = (totalTime - milliseconds) / 1000;

  let seconds = totalTime % 60;
  totalTime = (totalTime - seconds) / 60;

  let minutes = totalTime % 60;
  let hours = (totalTime - minutes) / 60;

  const stringHours = (hours < 10) ? ("0" + (hours.toString())) : hours;
  const stringMinutes = (minutes < 10) ? ("0" + (minutes.toString())) : minutes;
  const stringSeconds = (seconds < 10) ? ("0" + (seconds.toString())) : seconds;


  return (stringHours + ":" + stringMinutes + ":" + stringSeconds);


}

export const calculateTotalTime = (trackings: Tracking[]) => {
  let totalTime: number = 0;
  trackings.forEach(tracking => {
    const startTime: Date = new Date(tracking.startTime);
    const endTime: Date = new Date(tracking.endTime);

    totalTime += endTime.getTime() - startTime.getTime();
  });

  return formatTime(totalTime);
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, reload, stopTracking }) => {
  const { id, name, description, labels, trackings } = task;

  const {
    taskId,
    actions: { startTracking: start, stopTracking: stop },
  } = useContext(runningTaskContext);

  
  return (
    <TaskTableRow data-testid="task-item">
      <StyledTableCell component="th" scope="row">
        {name}
      </StyledTableCell>
      <StyledTableCell align="center">{description}</StyledTableCell>
      <StyledTableCell align="center">
        <LabelList>
          {labels.map(label => { return <li>{label.name}</li> })}
        </LabelList>
      </StyledTableCell>
      <StyledTableCell align="center">{calculateTotalTime(trackings)}</StyledTableCell>
      <StyledTableCell align="center">
        <div>
          { !taskId  && (<PlayButton onClick={() => start(id, name)}>Start Timer</PlayButton>)}
          { taskId == id && (<StopButton onClick={async () => {await stopTracking(),removePersistedData()}}>Stop Timer</StopButton>)}
          <PlayButton><StyledLink to={`taskview/${task.id}`}>Edit Task</StyledLink></PlayButton>
        </div>
      </StyledTableCell>
    </TaskTableRow>
  );
}
