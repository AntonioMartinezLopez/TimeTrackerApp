import React, { ChangeEvent, useContext, useEffect, useState } from "react"
import styled from 'styled-components/macro';
import { AddButton, Button } from "../../components/Button";
import { Paper, Table, TableBody, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { Modal } from "../../components/Modal";
import { formatTime, StyledTableCell, Task, Tracking, useStyles } from "../Overview/components/TaskList";
import { useParams } from "react-router-dom";
import { TrackingItem } from "./components/TrackingList";
import { EditTaskForm } from "../Overview/components/EditTaskForm";
import { EditTrackingForm } from "./components/EditTrackingForm";
import { useHistory } from "react-router-dom"
import { removePersistedData } from "../Overview/components/CurrentTrackingBox";
import { deleteCurrentTracking, runningTaskContext } from "../../contexts/RunningTaskContext";
import { AddTrackingButton } from "./components/AddTrackingButton";
import { AddTrackingForm } from "./components/AddTrackingForm";

const LabelList = styled.ul`
list-style: none;
flex-grow: 1;
font-size: 1rem;
padding:0;
align-self: flex-start;
fley-wrap: wrap;
justify-content: flex-start;
display: flex;
margin: 0;
& > li {
  padding: 0.25rem;
  font-weight: bold;
  border-radius: 0.25rem;
  background-color: ${props => props.theme.colors.primary};
  color: #ffffff;
  margin-right: 5px;
}
`;

const Description = styled.td`
    font-size: 1.25rem;
    font-weight: bold;
    padding: 5px;
    width: 20%
`


const TaskInformationList = styled.table`
    flex-grow:4;
    margin-bottom: 20px;

`

interface UrlParams {
    taskId: string;
}

interface TaskInformation {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface TrackingElement {
    id: string;
    description: string;
    startTime: string;
    endTime: string;
    createdAt: string;
    updatedAt: string;
    task: TaskInformation;
    totalTime: number;
}

export const calculateTotalTime = (trackings: TrackingElement[]) => {
    let totalTime: number = 0;
    trackings.forEach(tracking => {

        totalTime += tracking.totalTime;
    });

    return formatTime(totalTime);
}

const initialTask: Task = {
    id: "",
    name: "",
    description: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    labels: [],
    trackings: []
}


export const TaskviewPage = () => {

    let history = useHistory();

    const { taskId } = useParams<UrlParams>();

    const [task, setTask] = useState<Task>(initialTask);
    const [trackings, setTrackings] = useState<TrackingElement[]>([]);
    const [editTaskVisible, setEditTaskVisible] = useState(false);
    const [editTracking, setEditTracking] = useState<TrackingElement | null>(null);
    const [addTrackingVisible, setAddTrackingVisible] = useState(false);


    const condenseTrackings = (trackings: TrackingElement[]) => {
        console.log(trackings)

        const condensedTrackings: TrackingElement[] = [];
        for (let i = 0; i < trackings.length; i++) {
            const tracking = trackings[i];
            const lastTracking = condensedTrackings[condensedTrackings.length - 1]
            const trackingStart = new Date(tracking.startTime);
            

            tracking.totalTime = new Date(tracking.endTime).getTime() - trackingStart.getTime();

            if (i == 0) {
                condensedTrackings.push(tracking);
                continue;
            }

            const lastRackingStart = new Date(lastTracking.startTime);

            if (tracking.description == lastTracking.description && 
                trackingStart.getUTCDay() == lastRackingStart.getUTCDay() &&
                trackingStart.getUTCMonth() == lastRackingStart.getUTCMonth() &&
                trackingStart.getUTCFullYear() == lastRackingStart.getUTCFullYear() ) {

                lastTracking.endTime = tracking.endTime;
                if (lastTracking.totalTime !== null) {
                    lastTracking.totalTime += tracking.totalTime; 
                }

            } else {
                condensedTrackings.push(tracking);
            }
        }

        return condensedTrackings;

    }


    const fetchTrackings = async () => {
        const trackingsRequest = await fetch(`/api/tracking/task/${taskId}`, {
            headers: { 'content-type': 'application/json' },
        });
        if (trackingsRequest.status === 200) {
            const trackingsJSON = await trackingsRequest.json();
            const condensedTrackings: TrackingElement[] = condenseTrackings(trackingsJSON.data);
            setTrackings(() => condensedTrackings);
            //setSelectedTasks(transactionJSON.data);
        }

    };

    const fetchTask = async () => {
        const taskRequest = await fetch(`/api/task/${taskId}`, {
            headers: { 'content-type': 'application/json' },
        });
        if (taskRequest.status === 200) {
            const taskJSON = await taskRequest.json();
            setTask(() => taskJSON.data);
            //setSelectedTasks(transactionJSON.data);
        }
    }

    useEffect(() => {
        fetchTrackings();
        fetchTask();
    }, []);



    const {
        actions: { reset},
    } = useContext(runningTaskContext);

    const classes = useStyles();


    return (
        <div>
            <div
                css={`
            display: flex;
            flex-direction: row;
            width: 100%;
          `}
            >
                <div css={'display:flex;'}>
                    <h1>{task ? task.name : ""}</h1>
                </div>
                <div
                    css={`
              flex: 1;
              justify-content: flex-end;
              display: flex;
              align-items: top;
              text-align: center;
            `}
                >
                    <AddButton onClick={() => { setEditTaskVisible(true) }} >Edit Task</AddButton>
                </div>
            </div>
            
            <div css={`display:flex; flex-direction:row`}>
                <TaskInformationList>
                    <tr>
                        <Description>Labels:</Description>
                        <td><LabelList>{task && task.labels.map((label) => { return <li>{label.name}</li> })}</LabelList></td>
                    </tr>
                    <tr>
                        <Description>Description:</Description>
                        <td>{task && task.description}</td>
                    </tr>
                    <tr>
                        <Description>Total tracked Time</Description>
                        <td>{calculateTotalTime(trackings)}</td>
                    </tr>

                </TaskInformationList>
                <div css={`flex-grow: 1;display:flex;flex-direction:row-reverse; padding-left: 45px; padding-bottom: 10px; padding-right: 5px;`}><AddTrackingButton onClick={() => setAddTrackingVisible(true)} data-testid="add-tracking-button"/></div>
            </div>
            <div>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="left">Description</StyledTableCell>
                                <StyledTableCell align="center">Start</StyledTableCell>
                                <StyledTableCell align="center">End</StyledTableCell>
                                <StyledTableCell align="center" size="small">Tracked Time</StyledTableCell>
                                <StyledTableCell align="center">Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {trackings.map((tracking) => { return <TrackingItem trackingElement={tracking} reload={() => { fetchTrackings(); }} clickEdit={() => { if (!editTaskVisible) { setEditTracking(tracking) } }} /> })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            {editTaskVisible && (
                <Modal
                    title="Edit Task"
                    onCancel={() => {
                        setEditTaskVisible(false);
                    }}
                >
                    <EditTaskForm
                        task={task}
                        afterSubmit={() => {
                            setEditTaskVisible(false);
                            fetchTask();
                        }}
                        afterDelete={async () => {setEditTracking(null);
                             reset();
                             removePersistedData();
                             history.push("/overview")}}
                    />
                </Modal>
            )}
            {editTracking && (
                <Modal
                    title="Edit Tracking"
                    onCancel={() => {
                        setEditTracking(null);
                    }}
                >
                    <EditTrackingForm
                        tracking={editTracking}
                        taskName={task.name}
                        afterSubmit={() => {
                            setEditTracking(null);
                            fetchTrackings();
                        }}
                    />
                </Modal>
            )}
            {addTrackingVisible && (
                <Modal
                    title="Add Tracking"
                    onCancel={() => {
                        setAddTrackingVisible(false);
                    }}
                >
                    <AddTrackingForm
                        taskId={task.id}
                        taskName={task.name}
                        afterSubmit={() => {
                            setAddTrackingVisible(false);
                            fetchTrackings();
                        }}
                    />
                </Modal>
            )}
        </div>
    )


}

//return <TaskItem task={task} key={task.name} clickEdit={() => { if (!addTaskVisible) { setEditTask(task) } }} reload={() => { fetchTasks() }} /> 