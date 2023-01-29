import React, { useState } from 'react';

export type labelData = {
    name: string
}

export interface AddTaskFormData {
    name: string;
    description: string;
    labels: labelData[];
}

export type AddTaskFormContextTestHelper = {
    formData : AddTaskFormData | null;
    actions: {
        setFormData: (newData: AddTaskFormData) => void
    }
}

export const initialAddTaskFormContext = {
    formData : null,
    actions: {
        setFormData: async () => undefined,
    }
}

export const addTaskFormContextTestHelper = React.createContext<AddTaskFormContextTestHelper>(initialAddTaskFormContext);

export const AddTaskFormDataProvider:React.FC = ({children}) => {
    const [formData, setNewFormData] = useState<AddTaskFormData | null>(null)

    const setFormData = (newData: AddTaskFormData) => {
        setNewFormData(newData)
    }

    return (
        <addTaskFormContextTestHelper.Provider
            value={{
                actions : {setFormData}
            ,
            formData,

        }}
        >
            {children}
        </addTaskFormContextTestHelper.Provider>
    );
};