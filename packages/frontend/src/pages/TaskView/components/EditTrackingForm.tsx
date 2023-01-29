import React, { ChangeEvent, useContext, useEffect, useState } from "react"
import { DangerButton, FormButton } from "../../../components/FormButton";
import styled from "styled-components/macro";
import { formatTime } from "../../Overview/components/TaskList";
import { InputTrackingPlayer } from "../../Overview/components/InputTrackingPlayer";
import { TrackingElement } from "../TaskViewPage";


const TaskInformationList = styled.table`
    width: 100%;
`


export const EditTrackingForm: React.FC<{ afterSubmit: () => void, tracking: TrackingElement, taskName: string }> = ({ afterSubmit, tracking, taskName }) => {



    const [editTracking, setEditTracking] = useState<TrackingElement>(tracking);
    const [description, setDescription] = useState<string>(tracking.description);
    const [trackingTime, setTrackingTime] = useState<string>("00:00:00");



    const totalTime = () => {

        return formatTime(editTracking.totalTime)

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

        const startTime = new Date(editTracking.startTime)

        const timePieces = trackingTime.split(":");
        if (timePieces.length == 3) {
            const hours = parseInt(timePieces[0], 10) * 60 * 60 * 1000;
            const minutes = parseInt(timePieces[1], 10) * 60 * 1000;
            const seconds = parseInt(timePieces[2], 10) * 1000;

            return ((new Date(startTime.getTime() + hours + minutes + seconds)).toISOString());
        } else {
            return new Date().toISOString();
        }

    }


    const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log(editTracking.task.id)

        await fetch(`/api/tracking/${editTracking.id}`, {
            headers: { 'Content-Type': 'application/json'},
            method: 'DELETE',
          });
                
        const response = await fetch(`/api/tracking/`, {
            body: JSON.stringify({startTime: editTracking.startTime, endTime: calculateInputTime(), description: description, taskId: editTracking.task.id}),
            headers: { 'content-type': 'application/json' },
            method: 'POST',
        })

        console.log(await response.json())
        
        afterSubmit();
    };

    const cancelTracking = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
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
                    <td><InputTrackingPlayer data-testid="time" id="totalTime" name="time" type="text" label="Time" required pattern="^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$" onChange={timeInputDidChange} value={trackingTime}></InputTrackingPlayer></td>
                </tr>
                <td>Description</td>
            </TaskInformationList>
            <textarea data-testid="description" css={`width: 100%;`} rows={5} onChange={descriptionDidChange} value={description}></textarea>

            <FormButton type="submit">Save Tracking</FormButton>
            <DangerButton onClick={cancelTracking}>Cancel </DangerButton>
        </form>
    )
}