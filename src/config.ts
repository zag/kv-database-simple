export interface Config  {
    incomeQueue : string,
    outcomeQueue : string,
    dataPath: string,
    url:string,
  }
const {
    INCOME_QUEUE,
    OUTCOME_QUEUE,
    DATA_PATH,
    RMQ_HOST,
    RMQ_PORT
} = process.env;

const rabbitmqHost  = RMQ_HOST || '127.0.0.1'
const rabbitmqPort = RMQ_PORT  || '5672'
const url = `amqp://${rabbitmqHost}:${rabbitmqPort}`;

export const config: Config = {
    incomeQueue : INCOME_QUEUE || 'in',
    outcomeQueue: OUTCOME_QUEUE || 'out',
    dataPath: DATA_PATH || 'data',
    url,
  }