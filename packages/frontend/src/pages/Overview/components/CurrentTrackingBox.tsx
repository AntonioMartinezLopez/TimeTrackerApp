
import { motion } from "framer-motion";
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from "react"

import styled from 'styled-components/macro';
import { Input } from "../../../components/Input/Input"
import { runningTaskContext } from "../../../contexts/RunningTaskContext";
import { InputTrackingPlayer } from "./InputTrackingPlayer";
import { PauseButton } from "./PauseButton";
import { ReplayButton } from "./ReplayButton";
import { StopButton } from "./StopButton";
import { formatTime } from "./TaskList";

const containerVariant = {
    initial: { },
    isOpen: { transform: "translate(0, 0)", },
    exit: {transform: "translate(0,-100%) ",}
}

const CurrentTrackingBoxHolder = styled(motion.div)`
    width: 65%;
    min-width: 400px;
    margin: 0 auto;
    heigth: 300px;
    background-color: ${props => props.theme.colors.backgroundColorSecond};
    display:flex;
    align-items: stretch;
    justify-content: center;
    position: fixed;
    bottom: 0px;
    left:0px;
    right:0px;    
    margin-top: 20px;
    box-shadow: 0 4px 5px rgba(0, 0, 0, 0.075);
    padding: 5px 5px;
    border-radius: 10px;
    transform:translate(0, +100%);
    transition-property: transform;
    transition-duration: 0.5s;
    
`

const CurrentTrackingMask = styled.div`
    width: 100%;
    margin:0;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: center;
`
const CurrentTrackingFormElement = styled.div`
    
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    
`
const InputHolder = styled.div`
    width: 50%;
    display:flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    margin: 0 1% 0 2.5%;

`
const TaskLabelHolder = styled.div`
    display:flex;
    align-items: center;
    margin-left: 2.5%;
    margin-right: 1.5%;
    font-weight: bold;
    font-size: 1.1rem;
`

const loadTime = () => {
    const counter = window.localStorage.getItem("counter");
    const timeCounter = window.localStorage.getItem("timeCounter")
    const pauseActive = window.localStorage.getItem("trackingStatus")
    if(counter == "" || counter == null || timeCounter == null || timeCounter == ""){
        return 0;
    } else {
        if(pauseActive == "" || pauseActive == "false" || pauseActive == null){
        const countDiff = new Date().getTime() - new Date(timeCounter).getTime();
        const newCounter = parseInt(counter) + countDiff;
        return newCounter;
        }
        return parseInt(counter);
    }
}

const loadStatus = () => {
    const pauseActive = window.localStorage.getItem("trackingStatus");
    if(pauseActive == "" || pauseActive == null || pauseActive =="false"){
        return false;
    }else {
        return true;
    }
}

const loadName = ():string => {
    const description = window.localStorage.getItem("description");
    if(description == ""|| description == null){
        return "";
    } 
    return description;
}

export const removePersistedData = () => {
    window.localStorage.removeItem("counter");
    window.localStorage.removeItem("timeCounter");
    window.localStorage.removeItem("trackingStatus");
}

export const CurrentTrackingBox: React.FC<{ reload: () => void }> = ({ reload }) => {

    //Context
    const {
        taskId: currentTrackingTaskid,
        taskName: currentTaskName,
        currentTracking,
        actions: { startTracking: start, stopTracking: stop, pauseTracking: pause, replayTracking: replay },
    } = useContext(runningTaskContext);

    //UseStates
    const [time, setTime] = useState<number>( loadTime() );
    const [inputDescription, setInput] = useState<string>(loadName());
    const pauseActive = useRef<boolean>(loadStatus());
    const [showPlayButton, setShowPlayButton] = useState(loadStatus());

    //useEffects
    useEffect(() => {
        const timer = setInterval(() => {
            if (currentTracking && !pauseActive.current) {
                //const timeDiff = new Date().getTime() - new Date(currentTracking.startTime).getTime();
                setTime((time) => time+1000 );
            }
        }, 1000);
        return () => {
            clearInterval(timer); // Return a funtion to clear the timer so that it will stop being called on unmount
        }
    }, []);

    useEffect(() => {
        const stringTime = time.toString();
        const date = new Date().toISOString();
        window.localStorage.setItem("counter", stringTime);
        window.localStorage.setItem("timeCounter", date);
    }, [time])

    useEffect(() => {
        window.localStorage.setItem("description", inputDescription);
    },[inputDescription]);


    //functions
    const fieldDidChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const clickedPauseButton = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        await pause(inputDescription);
        pauseActive.current = true;
        window.localStorage.setItem("trackingStatus", "true");
        setShowPlayButton(pauseActive.current);
        console.log(pauseActive.current);
    }

    const clickedReplayButton = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        replay(new Date().toISOString());
        pauseActive.current = false;
        window.localStorage.setItem("trackingStatus", "false");
        setShowPlayButton(pauseActive.current);
        console.log(pauseActive.current);
        
    }


    return (
        <CurrentTrackingBoxHolder data-testid="tracking-box" variants={containerVariant} initial={"initial"} animate={"isOpen"} exit={"exit"}>

            <CurrentTrackingFormElement>
                <TaskLabelHolder css={`width:10%;`}>{currentTaskName}</TaskLabelHolder>
                <InputHolder>
                    <InputTrackingPlayer data-testid="input-tracking-player" id="trackingName" onChange={fieldDidChange} css={`margin-bottom:0`} name="description" type="text" label="Enter a description for the current tracking" required value={inputDescription}></InputTrackingPlayer>
                </InputHolder>
                <TaskLabelHolder><span>{formatTime(time)}</span></TaskLabelHolder>
                {showPlayButton && (<ReplayButton data-testid="replay-button" onClick={(e) => clickedReplayButton(e)} />)}
                {!showPlayButton && (<PauseButton data-testid="pause-button" onClick={(e) => clickedPauseButton(e)} />)}
                <StopButton data-testid="stop-button" onClick={async () => { await stop(inputDescription,null);removePersistedData(); reload(); }} />
            </CurrentTrackingFormElement>
        </CurrentTrackingBoxHolder>

    )
}