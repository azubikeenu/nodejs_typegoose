import logger from 'pino';
import dayjs from 'dayjs';
import config from 'config';

const level = config.get<string>('logLevel');

const Logger = logger({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
  level,
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

export default Logger;
