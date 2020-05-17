import  {EventEmitter} from 'events'
import amqp, { Channel, Connection, Message } from "amqplib";

import { Config } from './config';

export interface MessagesParams {
    url: string,
    config: Config
}
  
 export class Messages extends EventEmitter {
    config:Config 
    url: string
    connection!: amqp.Connection
    channel!: amqp.Channel

    constructor( { url, config }: MessagesParams ) {
      super()
      this.url = url
      this.config = config
    }

    async connect() {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.config.incomeQueue);
      await this.channel.assertQueue(this.config.outcomeQueue);
    }

    async consume() {
      await this.channel.consume(this.config.incomeQueue, (msg)=> {
        if (msg !==null ) {
          this.emit('get', msg.content.toString())
        }
      });
    }

    send(message:string) {
      this.channel.sendToQueue(this.config.outcomeQueue, Buffer.from(message))
    }

  }
  