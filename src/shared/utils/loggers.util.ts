import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';
export const logger = pino({
  level: isProduction ? 'info' : 'debug',
  base: {
    service: 'ai-job-backend', // Makes filtering in Loki & Grafana effortless
  },
  transport: !isProduction
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
});
// logger input params -
//   obj(events , and other meta data),+
//   string message
// E:\Vscode\CurrentWeek\Development\APP\Backend\src\shared\utils\loggers.util.ts
