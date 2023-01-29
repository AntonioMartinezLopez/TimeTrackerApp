// tslint:disable-next-line: no-var-requires
require('dotenv-safe').config();
import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import { globalRouter } from './router/global.router';
import { createDatabaseConnection } from './util/createDatabaseConnection';


const port: number = Number(process.env.PORT);

export const startServer = async () => {
  try {
    const app = express();
    const dbConnection = await createDatabaseConnection();
    app.use(morgan('combined'));
    app.use(bodyParser.json());

    app.use('/api', globalRouter);

    const server = app.listen(port, () => console.log(`Server is running on port ${port}`));
    return { server, dbConnection };
  } catch (e) {
    console.log(e);
    throw e;
  }
};

// tslint:disable-next-line: no-floating-promises
startServer();
