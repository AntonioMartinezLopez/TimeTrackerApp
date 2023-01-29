import React, { ChangeEvent, useContext, useState } from "react"
import { Input } from "../../../components/Input/Input";
import { labelContext } from "../../../contexts/LabelContext";
import { Option, SelectInput } from "../../../components/SelectInput";
import { DangerButton, FormButton } from "../../../components/FormButton";
import { Task } from "./TaskList";

interface Values {
    name:string,
    description:string,
    labels:Option[]
}

export const EditTaskForm: React.FC<{ afterSubmit: () => void, afterDelete: () => void, task: Task}> = ({ afterSubmit, afterDelete, task }) => {

    const {
        labels,
        actions: { refetch: refetchLabels },
    } = useContext(labelContext);

    const [values, setValues] = useState<Values>(task)

    const fieldDidChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };


    const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(values)
        await fetch(`/api/task/${task.id}`, {
            body: JSON.stringify(values),
            headers: { 'Content-Type': 'application/json' },
            method: 'PATCH',
        });
        await refetchLabels();
        afterSubmit();
    };

    const deleteTask = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        await fetch(`/api/task/${task.id}`, {
          headers: { 'Content-Type': 'application/json'},
          method: 'DELETE',
        });
        afterDelete();
      };

    return (
        <form onSubmit={onSubmitForm}>
            <Input name="name" type="text" label="Name" onChange={fieldDidChange} required value={values.name} />
            <Input name="description" type="text" label="Description" onChange={fieldDidChange} required value={values.description} />
            <SelectInput label="Label" options={labels} onChangeSelectedOptions={(options) => { setValues({ ...values, labels: options }) }} initialState={{inputValue:"",selectedOptions: values.labels}} />
            <FormButton type="submit">Update Task</FormButton>
            <DangerButton onClick={deleteTask}>Delete Task</DangerButton>
        </form>
    )
}