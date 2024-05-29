import 'express-async-errors';
import http from 'http';

import { winstonLogger } from "@irshadkhan2019/job-app-shared";
import { Logger } from "winston";
import { config } from '@notifications/config';
import { Application } from 'express';
import { healthRoutes } from '@notifications/routes';
import { checkConnection } from '@notifications/elasticsearch';
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
  // const verificationlink=`${config.CLIENT_URL}/config_email?v_token=12dcasdc3241cdwsdd1`
  // const messageDetails:IEmailMessageDetails={
  //   receiverEmail:`${config.SENDER_EMAIL}`,
  //   resetLink:verificationlink,
  //   username:'izuku',
  //   template:'forgotPassword',

  // }
  // const message=JSON.stringify(messageDetails)
  // await emailChannel.assertExchange('jobber-email-notification','direct');
  // emailChannel.publish('jobber-email-notification','auth-email',Buffer.from(message));

  // const messageDetails={
  //   receiverEmail:`${config.SENDER_EMAIL}`,
  //   username:'izuku',
  //   template:'orderPlaced',
  //   sender:'izuku',
  //   offerLink:'http:offer.com',
  //   amount:'24',
  //   buyerUsername:'Asta',
  //   sellerUsername:'izuku',
  //   title:'new offer',
  //   description:'top offer',
  //   deliveryDays:'2',
  //   orderId:'jsd89asdhad88',
  //   orderDue:'2',
  //   requirements:'need ASAP',
  //   orderUrl:'http:url.com',
  //   originalDate:'23-2-24',
  //   newDate:'25-2-24',
  //   reason:'time',
  //   subject:'extension',
  //   header:'header',
  //   type:'extension',
  //   message:'i need more time',
  //   serviceFee:'25',
  //   total:'49'
  // } 
  // const message1=JSON.stringify(messageDetails)
  // await emailChannel.assertExchange('jobber-order-notification','direct');
  // emailChannel.publish('jobber-order-notification','order-email',Buffer.from(message1));
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
