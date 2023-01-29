import React, { ChangeEvent, useContext, useState } from "react"
import { Input } from "../../../../components/Input/Input";
import { labelContext } from "../../../../contexts/LabelContext";
import { Option, SelectInput } from "../../../../components/SelectInput";
import { FormButton } from "../../../../components/FormButton";
import { AddTaskFormData } from "./FormContextTestHelper";

interface Values {
    name:string,
    description:string,
    labels:Option[]
}





export const AddTaskForm: React.FC<{ afterSubmit: () => void, onSubmit?: (data:AddTaskFormData) => void }> = ({ afterSubmit, onSubmit }) => {

    const {
        labels,
        actions: { refetch: refetchLabels },
    } = useContext(labelContext);

    const [values, setValues] = useState<Values>({
        name: '',
        description: '',
        labels: [],
    })

    const fieldDidChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };


    const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //console.log(values)
        await fetch('/api/task', {
            body: JSON.stringify(values),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
        });
        await refetchLabels();
        afterSubmit();
    };

    return (
        <form onSubmit={onSubmit?async (e: React.FormEvent<HTMLFormElement>) => {e.preventDefault();onSubmit(values)}: onSubmitForm} data-testid="add-task-form">
            <Input name="name" type="text" label="Name" onChange={fieldDidChange} required value={values.name} />
            <Input name="description" type="text" label="Description" onChange={fieldDidChange} required value={values.description} />
            <SelectInput label="Label" options={labels} onChangeSelectedOptions={(options) => { setValues({ ...values, labels: options }) }} />
            <FormButton type="submit">Add Task</FormButton>
        </form>
    )
}