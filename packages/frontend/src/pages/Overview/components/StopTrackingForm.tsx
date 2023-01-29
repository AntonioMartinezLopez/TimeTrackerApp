import React, { ChangeEvent, useContext, useEffect, useState } from "react"
import { Input } from "../../../components/Input/Input";
import { labelContext } from "../../../contexts/LabelContext";
import { Option, SelectInput } from "../../../components/SelectInput";
import { DangerButton, FormButton } from "../../../components/FormButton";
import { formatTime, Task } from "./TaskList";
import { runningTaskContext } from "../../../contexts/RunningTaskContext";
import styled from "styled-components/macro";
import { InputTrackingPlayer } from "./InputTrackingPlayer";

const Description = styled.td`
    font-size: 1.25rem;
    font-weight: bold;
    padding: 5px;
    width: 20%
`


const TaskInformationList = styled.table`
    width: 100%;
`


export const StopTrackingForm: React.FC<{ afterSubmit: () => void }> = ({ afterSubmit }) => {

    const {
        taskId: currentTrackingTaskid,
        taskName: taskName,
        currentTracking,
        actions: { stopTracking: stop, reset },
    } = useContext(runningTaskContext);



    const [description, setDescription] = useState<string>("");
    const [trackingTime, setTrackingTime] = useState<string>("00:00:00");



    const totalTime = () => {
        if (currentTracking) {
            return formatTime(new Date().getTime() - new Date(currentTracking.startTime).getTime())
        }
        return "00:00:00";
    }

    useEffect(() => {
        setTrackingTime(() => { return totalTime() })
    }, []);


    const timeInputDidChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTrackingTime(() => { return e.target.value });
    }

    const descriptionDidChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(() => { return e.target.value })
    }

    const calculateInputTime = () => {
        if (currentTracking) {
            const startTime = new Date(currentTracking.startTime)

            const timePieces = trackingTime.split(":");
            if (timePieces.length == 3) {
                const hours = parseInt(timePieces[0], 10) * 60 * 60 * 1000;
                const minutes = parseInt(timePieces[1], 10) * 60 * 1000;
                const seconds = parseInt(timePieces[2], 10) * 1000;

                return ((new Date(startTime.getTime() + hours + minutes + seconds)).toISOString());
            }else {
                return new Date().toISOString();
            }
        }
        return null;
    }


    const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        const endTime = calculateInputTime();

        await stop(description, endTime);
        afterSubmit();
    };

    const cancelTracking = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        await reset();
        afterSubmit();
    };


    return (
        <form onSubmit={onSubmitForm}>


            <TaskInformationList>
                <tr>
                    <td>Task:</td>
                    <td>{taskName}</td>
                </tr>
                <tr>
                    <td>Time</td>
                    <td><InputTrackingPlayer id="totalTime" name="time" type="text" label="Time" required pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$" onChange={timeInputDidChange} value={trackingTime}></InputTrackingPlayer></td>
                </tr>
                <td>Description</td>
            </TaskInformationList>
            <textarea css={`width: 100%;`} rows={5} onChange={descriptionDidChange}></textarea>

            <FormButton type="submit">Save Tracking</FormButton>
            <DangerButton onClick={cancelTracking}>Cancel </DangerButton>
        </form>
    )
}