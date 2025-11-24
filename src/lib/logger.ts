import log, { Logger } from 'loglevel';

const defaultLevel = process.env.NODE_ENV === 'production' ? 'WARN' : 'DEBUG';


const envLevel =
  (process.env.NEXT_PUBLIC_LOG_LEVEL as log.LogLevelDesc) || defaultLevel;

log.setDefaultLevel(envLevel);

export const logger: Logger = log;
