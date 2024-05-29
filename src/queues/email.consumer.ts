import { config } from '@notifications/config';
import { winstonLogger} from '@irshadkhan2019/job-app-shared'
import { Channel, ConsumeMessage } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@notifications/queues/connection';


const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'emailConsumer', 'debug');

  //publisher--> channel.publish('jobber-email-notification','auth-email','My message')

async function consumeAuthEmailMessages(channel: Channel): Promise<void> {
  try {
    if (!channel) {
      channel = await createConnection() as Channel;
    }
    // publisher send msg to exchange
    const exchangeName = 'jobber-email-notification';
    const routingKey = 'auth-email';
    const queueName = 'auth-email-queue';//queue name bound to exchange via routing key
    // msg send via above exhange name and above routing key goes to above queue.

    // check if xchange exists
    await channel.assertExchange(exchangeName, 'direct');//direct,fanout,topic
    // if queue restarts i want msg to persist so durable=true, // check if queue exists
    const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    //create routing path b/w queue and xchange  using routing key
    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
    // consume msg if queue has msg
    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
        // using json.parse send msg send is via string 
      console.log(JSON.parse(msg!.content.toString()));
    //   send email
    // consume
    //   channel.ack(msg!)
      
    });
  } catch (error) {
    log.log('error', 'NotificationService EmailConsumer consumeAuthEmailMessages() method error:', error);
  }
}

async function consumeOrderEmailMessages(channel: Channel): Promise<void> {
    try {
      if (!channel) {
        channel = await createConnection() as Channel;
      }
      const exchangeName = 'jobber-order-notification';
      const routingKey = 'order-email';
      const queueName = 'order-email-queue';
      await channel.assertExchange(exchangeName, 'direct');
      const jobberQueue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
      await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);
      channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
        console.log(JSON.parse(msg!.content.toString()));
        //   send email
        // consume
        //   channel.ack(msg!)
          
      });
    } catch (error) {
      log.log('error', 'NotificationService EmailConsumer consumeOrderEmailMessages() method error:', error);
    }
  }



export { consumeAuthEmailMessages,consumeOrderEmailMessages };