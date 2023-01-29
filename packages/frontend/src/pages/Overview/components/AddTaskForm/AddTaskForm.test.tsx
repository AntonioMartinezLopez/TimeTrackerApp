import React from 'react';
import { initialContext, labelContext } from '../../../../contexts/LabelContext';
import { render, fireEvent } from '../../../../utils/tests';
import { FetchMock } from 'jest-fetch-mock';
import { AddTaskForm } from './AddTaskForm';


describe('AddTask', () => {
  beforeEach(() => {
    (fetch as FetchMock).resetMocks();
  });

  it('does render', () => {
    const { debug, getByTestId, getByLabelText, getByText } = render(
      <labelContext.Provider
        value={{ ...initialContext, actions: { refetch: jest.fn() } }}
      >
        <AddTaskForm afterSubmit={() => undefined} />
      </labelContext.Provider>);
  })

  it('sends form data to api', () => {

    const { debug, getByTestId, getByLabelText, getByText } = render(
      <labelContext.Provider
        value={{ ...initialContext, actions: { refetch: jest.fn() } }}
      >
        <AddTaskForm afterSubmit={() => undefined} />
      </labelContext.Provider>);


    const name = getByLabelText(/name/i);
    const description = getByLabelText(/description/i)
    const label = getByLabelText(/label/i)
    const submitButton = getByText(/add task/i);

    const testTask = {
      name: "testTask",
      description: "testDescription",
      labels: [{ name: "TestLabel" }]
    };

    (fetch as FetchMock).mockResponseOnce(JSON.stringify(testTask));

    fireEvent.change(name, { target: { value: testTask.name } });
    fireEvent.change(description, { target: { value: testTask.description } });
    fireEvent.change(label, { target: { value: testTask.labels[0].name } });

    fireEvent.keyDown(label, {
      key: "Enter",
      code: "Enter",
      keyCode: 13,
      charCode: 13
    })


    fireEvent.click(submitButton);


    expect((fetch as FetchMock).mock.calls.length).toBe(1);
    expect((fetch as FetchMock).mock.calls[0][0]).toBe('/api/task');
    expect(((fetch as FetchMock).mock.calls[0][1] as RequestInit).method).toBe('POST');
    expect(((fetch as FetchMock).mock.calls[0][1] as RequestInit).body).toBe(JSON.stringify(testTask));

  });

  it("submits correct data as typed and saved in state hooks", () => {

    const onSubmit = jest.fn();
    const { getByLabelText, getByText } = render(
      <labelContext.Provider
        value={{ ...initialContext, actions: { refetch: jest.fn() } }}
      >
        <AddTaskForm afterSubmit={() => undefined} onSubmit={onSubmit} />
      </labelContext.Provider>);


    const name = getByLabelText(/name/i);
    const description = getByLabelText(/description/i)
    const label = getByLabelText(/label/i)
    const submitButton = getByText(/add task/i);

    const testTask = {
      name: "testTask",
      description: "testDescription",
      labels: [{ name: "TestLabel" }]
    };

    
    fireEvent.change(name, { target: { value: testTask.name } });
    fireEvent.change(description, { target: { value: testTask.description } });
    fireEvent.change(label, { target: { value: testTask.labels[0].name } });

    fireEvent.keyDown(label, {
      key: "Enter",
      code: "Enter",
      keyCode: 13,
      charCode: 13
    })

    fireEvent.click(submitButton);
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith(testTask)


  })


});
