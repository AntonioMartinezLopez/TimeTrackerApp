import React from 'react';
import { render, act, fireEvent, getByText, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { FetchMock } from 'jest-fetch-mock';

import { ThemeProvider } from 'styled-components';
import { theme } from '../../theme';
import { OverviewPage } from './OverviewPage';
import { initialContext, labelContext } from '../../contexts/LabelContext';


describe('OverviewPage', () => {

    beforeEach(() => {
        (fetch as FetchMock).resetMocks();
    });

    it('adds an Item after Create', async () => {

        const taskInitialFetchResponse = {
            data: [],
            status: 'ok',
        };

        const taskPostResponse = {
            data: {
                id: '1',
                description: 'TestDescription',
                name: 'TestName',
                labels: [],
                trackings: [],
                createdAt: new Date('2020-12-11'),
                updatedAt: new Date('2019-01-01'),

            },
            status: 'ok',
        };

        const taskResponse = {
            data: [{
                id: '1',
                description: 'TestDescription',
                name: 'TestName',
                labels: [],
                trackings: [],
                createdAt: new Date('2020-12-11'),
                updatedAt: new Date('2019-01-01'),

            },
            ],
            status: 'ok',
        };

        (fetch as FetchMock)
            .once(JSON.stringify(taskInitialFetchResponse))
            .once(JSON.stringify(taskPostResponse))
            .once(JSON.stringify(taskResponse));

        const { getByLabelText: getByLabelTextContainer, getByTestId, findAllByTestId } = render(
            <ThemeProvider theme={theme}>
                <BrowserRouter>

                    <labelContext.Provider
                        value={{ ...initialContext, actions: { refetch: jest.fn() } }}
                    >
                        <OverviewPage></OverviewPage>
                    </labelContext.Provider>

                </BrowserRouter>
            </ThemeProvider>
        );

        const createNewTask = getByTestId('create-task-button');

        await act(async () => {
            fireEvent.click(createNewTask);
        });

        await waitFor(() => {
            expect(getByTestId("add-task-form")).toBeInTheDocument();
        })

        const addTaskForm = getByTestId("add-task-form");


        const name = getByLabelTextContainer(/name/i);
        const description = getByLabelTextContainer(/description/i);
        

        fireEvent.change(name, {
            target: { value: taskResponse.data[0].name },
        });
        fireEvent.change(description, {
            target: { value: taskResponse.data[0].description},
        });

        const submit = getByText(addTaskForm, /add task/i);
        fireEvent.click(submit);

        //await findAllByTestId('task-item');
        expect((await findAllByTestId('task-item')).length).toBe(1);







    })




})