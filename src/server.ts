import 'express-async-errors';
import http from 'http';

import { winstonLogger } from "@irshadkhan2019/job-app-shared";
import { Logger } from "winston";
import { config } from '@notifications/config';
import { Application } from 'express';
import { healthRoutes } from './routes';
import { checkConnection } from './elasticsearch';
import { createConnection } from './queues/connection';
import { Channel } from 'amqplib';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from './queues/email.consumer';

const SERVER_PORT = 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');

export function start(app: Application): void {
  startServer(app);
  //http://localhost:4001/notifiation-routes
  app.use('',healthRoutes);
  startQueues();
  startElasticSearch();
}

async function startQueues(): Promise<void> {
  const emailChannel=await createConnection() as Channel;
  await consumeAuthEmailMessages(emailChannel) //consumer(notification service) will consume 
  await consumeOrderEmailMessages(emailChannel)
  // publish msg test
  const message=JSON.stringify({name:'jobber-email',service:'auth notification'})
  await emailChannel.assertExchange('jobber-email-notification','direct');
  emailChannel.publish('jobber-email-notification','auth-email',Buffer.from(message));

  const message1=JSON.stringify({name:'jobber-order',service:'order notification'})
  await emailChannel.assertExchange('jobber-order-notification','direct');
  emailChannel.publish('jobber-order-notification','order-email',Buffer.from(message1));
}

function startElasticSearch(): void {
    checkConnection();
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`Worker with process id of ${process.pid} on notification server has started`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'NotificationService startServer() method:', error);
  }
}
