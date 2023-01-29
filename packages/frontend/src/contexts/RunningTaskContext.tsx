import React, { useEffect, useState } from "react";


interface TrackingInformation {

    taskId: string;
    description: string;
    startTime: string;
    endTime: string;
}


interface RunningTaskContext {
    taskId: string | null;
    taskName: string | null;
    currentTracking: TrackingInformation | null;
    actions: {
        startTracking: (taskId: string, taskName: string) => Promise<void>,
        stopTracking: (taskDescription: string, endTime: string | null) => Promise<void>,
        pauseTracking: (taskDescription: string) => Promise<void>,
        replayTracking: (startTime: string) => void,
        reset: () => void,
    }
}

const initialContext = {
    actions: {
        startTracking: async () => undefined,
        stopTracking: async () => undefined,
        pauseTracking: async () => undefined,
        replayTracking: async () => undefined,
        reset: async () => undefined,
    },
    taskId: null,
    taskName: null,
    currentTracking: null,
};

const persistCurrentTracking = (currentTracking: TrackingInformation, taskName: string) => {
    window.localStorage.setItem("taskId", currentTracking.taskId);
    window.localStorage.setItem("description", currentTracking.description);
    window.localStorage.setItem("startTime", currentTracking.startTime);
    window.localStorage.setItem("endTime", currentTracking.endTime);
    window.localStorage.setItem("taskName", taskName);

    console.log("SAVING DATA")

}

export const deleteCurrentTracking = () => {
    window.localStorage.removeItem("taskId");
    window.localStorage.removeItem("description");
    window.localStorage.removeItem("startTime");
    window.localStorage.removeItem("endTime");
    window.localStorage.removeItem("taskName");
}

const loadData = () => {
                const task =  window.localStorage.getItem("taskId");
                const description = window.localStorage.getItem("description");
                const startTime = window.localStorage.getItem("startTime");
                const endTime = window.localStorage.getItem("endTime");
                

                if(task){
                    console.log("CONTEXT")
                    return {
                        taskId: task?task:"",
                        description: description?description:"",
                        startTime: startTime?startTime:"",
                        endTime: endTime?endTime:""
                    }
                } 

                return null;

}


export const runningTaskContext = React.createContext<RunningTaskContext>(initialContext);

export const RunningTaskProvider: React.FC = ({ children }) => {

    const [taskId, setRunningTask] = useState<string | null>((window.localStorage.getItem("taskId")));
    const [taskName, setTaskName] = useState<string | null>((window.localStorage.getItem("taskName")));
    const [currentTracking, setCurrentTracking] = useState<TrackingInformation | null>(loadData());



    const startTracking = async (newTaskId: string, newTaskName: string) => {

        setRunningTask(newTaskId);
        setTaskName(newTaskName);
        setCurrentTracking({
            taskId: newTaskId,
            description: "",
            startTime: new Date().toISOString(),
            endTime: "",
        })


        persistCurrentTracking({
            taskId: newTaskId,
            description: "",
            startTime: new Date().toISOString(),
            endTime: "",
        }, newTaskName);
    };





    const stopTracking = async (trackingDescription: string, endTime: string | null) => {


        if (taskId != null && currentTracking !== null) {

            //when tracking is paused, no new tracking should be sended to backend
            if (currentTracking.startTime == "") {
                setCurrentTracking(null);
                setTaskName(null);
                setRunningTask(null);

            } else {
                currentTracking.description = trackingDescription;

                if (!endTime) {
                    currentTracking.endTime = new Date().toISOString();
                } else {
                    currentTracking.endTime = endTime;
                }
                await fetch(`/api/tracking`, {
                    body: JSON.stringify(currentTracking),
                    headers: { 'content-type': 'application/json' },
                    method: 'POST',
                })


                setCurrentTracking(null);
                setTaskName(null);
                setRunningTask(null);

                
            }
            deleteCurrentTracking();
        }
    }

    const pauseTracking = async (TaskDescription: string) => {

        if (taskId != null && currentTracking !== null) {

            currentTracking.endTime = new Date().toISOString();
            currentTracking.description = TaskDescription;
            const newTracking = await fetch(`/api/tracking`, {
                body: JSON.stringify(currentTracking),
                headers: { 'content-type': 'application/json' },
                method: 'POST',
            })

            setCurrentTracking({
                taskId: taskId,
                description: currentTracking.description,
                startTime: "",
                endTime: "",
            })

            persistCurrentTracking({
                taskId: taskId,
                description: currentTracking.description,
                startTime: "",
                endTime: "",
            }, taskName ? taskName : "");

        }
    }

    const replayTracking = () => {
        if (taskId != null && currentTracking !== null) {

            const newDate = new Date().toISOString();

            setCurrentTracking({
                taskId: taskId,
                description: currentTracking.description,
                startTime: newDate,
                endTime: "",
            })

            persistCurrentTracking({
                taskId: taskId,
                description: currentTracking.description,
                startTime: newDate,
                endTime: "",
            }, taskName ? taskName : "");


        }

    }

    const reset = () => {
        setCurrentTracking(null);
        setTaskName(null);
        setRunningTask(null);

        deleteCurrentTracking();
    }



    return (<runningTaskContext.Provider value={{
        actions: {
            startTracking, stopTracking, pauseTracking, replayTracking, reset,
        }, taskId, taskName, currentTracking,
    }}>{children}</runningTaskContext.Provider>)
}