require('dotenv').config();
import express, { Express } from 'express';
import config from 'config';
import { connect } from './utils/connect';
import Logger from './utils/logger';

import { router as routes } from './routes/v1';

const port = config.get('port');

const app: Express = express();

app.use(express.json());

app.use('/api/v1/', routes);

app.listen(port, async () => {
  await connect();
  Logger.info(`App started on http://localhost:${port}`);
});
