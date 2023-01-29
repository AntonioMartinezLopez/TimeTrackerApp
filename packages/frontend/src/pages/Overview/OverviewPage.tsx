import React, { ChangeEvent, useContext, useEffect, useState } from "react"
import styled from 'styled-components/macro';
import { AddButton, Button } from "../../components/Button";
import { AddTaskForm } from "./components/AddTaskForm/AddTaskForm";
import { StyledTableCell, Task, TaskItem, useStyles } from "./components/TaskList";
import { makeStyles, Paper, Table, TableBody, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { labelContext } from "../../contexts/LabelContext";
import { Modal } from "../../components/Modal";
import { EditTaskForm } from "./components/EditTaskForm";
import { CurrentTrackingBox } from "./components/CurrentTrackingBox";
import { runningTaskContext } from "../../contexts/RunningTaskContext";
import { InputTrackingPlayer } from "./components/InputTrackingPlayer";
import { CancelButton } from "./components/CancelButton";
import { Link } from "react-router-dom";
import { StopTrackingForm } from "./components/StopTrackingForm";



export const OverviewPage = () => {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [addTaskVisible, setAddTaskVisible] = useState(false);
  const [stopTracking, setStopTracking] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  const [query, setQuery] = useState<string | any>("");

  const fetchTasks = async () => {
    const taskRequest = await fetch('/api/task', {
      headers: { 'content-type': 'application/json' },
    });
    if (taskRequest.status === 200) {
      const transactionJSON = await taskRequest.json();
      setTasks(transactionJSON.data);
      setSelectedTasks(transactionJSON.data);
    }

  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {

    const newTasks = tasks.filter((task) => {
      return (task.name.toLowerCase().includes(query.toLowerCase()) ||
        task.description.toLowerCase().includes(query.toLowerCase()) ||
        (task.labels.find(label => label.name.toLowerCase().includes(query.toLowerCase()))
        )
      )
    })
    if (newTasks) {
      setSelectedTasks(newTasks);
    }

  }, [query]);

  const searchFieldDidChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(() => e.target.value)
  }


  const {
    taskId: currentTrackingTaskid,
    actions: { reset }
  } = useContext(runningTaskContext);


  const test = () => {
    console.log("test");
  }

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
          <h1>Overview - Tasks</h1>
        </div>
        <div css={`
            display: flex;
            flex-direction: row;
            width: 45%;
            min-width: 100px;
            align-items: center;
            margin-left: 10%;
          `}>
          <form onSubmit={(e) => {e.preventDefault()}} css={`display:flex;flex-direction: row;align-items: center; width: 100%`}>
            <InputTrackingPlayer id="search" css={`margin-bottom:0`} name="description" type="text" label="Search for task name, description or labels" onChange={searchFieldDidChange} />
            <CancelButton css={'position: relative; right: 40px;'} onClick={(e) => { setQuery("") }}/>
          </form>
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
          <AddButton onClick={() => { if (!stopTracking) { setAddTaskVisible(true) } }} data-testid="create-task-button">Create Task</AddButton>
        </div>
      </div>

      <div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="left">Name</StyledTableCell>
                <StyledTableCell align="center">Description</StyledTableCell>
                <StyledTableCell align="center">Label</StyledTableCell>
                <StyledTableCell align="center" size="small">Total tracked time</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedTasks.map((task) => { return <TaskItem task={task} key={task.id} reload={() => { fetchTasks() }} stopTracking={() => { if(!addTaskVisible){setStopTracking(true)}}} /> })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {(currentTrackingTaskid && !stopTracking) && (<CurrentTrackingBox reload={() => { fetchTasks() }} />)}

      {addTaskVisible && (
        <Modal
          title="Add a new Task"
          onCancel={() => {
            setAddTaskVisible(false);
          }}
        >
          <AddTaskForm
            afterSubmit={() => {
              setAddTaskVisible(false);
              fetchTasks();
            }}
          />
        </Modal>
      )}
      {stopTracking && (
        <Modal
          title="Stop Tracking"
          onCancel={() => {
            setStopTracking(false);
            reset();
          }}
        >
          <StopTrackingForm
            afterSubmit={() => {
              setStopTracking(false);
              fetchTasks();
            }}
          />
        </Modal>
      )}
    </div>
  );

}