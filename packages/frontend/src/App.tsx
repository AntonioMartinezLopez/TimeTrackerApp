import React, { useEffect, useState } from "react";
import { GlobalStyle } from "./components/GlobalStyle";
import { Layout } from "./components/Layout";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";
import { OverviewPage } from "./pages/Overview/OverviewPage";
import { LabelProvider } from "./contexts/LabelContext";
import { RunningTaskProvider } from "./contexts/RunningTaskContext";
import { BrowserRouter, Switch, Route, Redirect, RouteProps } from 'react-router-dom';
import { TaskviewPage } from "./pages/TaskView/TaskViewPage";


export const BasePage = () => {
    return <Redirect to="/overview" />
}

export const App = () => {
    const [state, setState] = useState<string>("");

    useEffect(() => {
        (async () => {
            const helloRequest = await fetch('/api');
            const helloJson = await helloRequest.json();
            console.log(helloJson.message);
            setState(helloJson.message)
        })();
    }, []);

    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <GlobalStyle />
                <LabelProvider>
                    <RunningTaskProvider>
                        <Layout>
                            <Switch>
                                <Route exact path="/overview" component={OverviewPage} />
                                <Route exact path="/taskview/:taskId" component={TaskviewPage} />
                                <Route path="/" component={BasePage} />
                            </Switch>
                        </Layout>
                    </RunningTaskProvider>
                </LabelProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
};
