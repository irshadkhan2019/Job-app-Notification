import path from 'path';
import { IEmailLocals, winstonLogger } from '@irshadkhan2019/job-app-shared';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import nodemailer, { Transporter } from 'nodemailer';
import Email from 'email-templates';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'mailTransportHelper', 'debug');

async function emailTemplates(template: string, receiver: string, locals: IEmailLocals): Promise<void> {
  try {
    const smtpTransport: Transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_EMAIL_PASSWORD
      }
    });

    // create email
    const email: Email = new Email({
      message: {
        from: `Jobber App <${config.SENDER_EMAIL}>`
      },
      send: true,
      preview: false,
      transport: smtpTransport,
      views: { //specify template engine
        options: {
          extension: 'ejs' //ejs,pug or others
        }
      },
      juice: true,//for css usage
      juiceResources: {
        preserveImportant: true, //important flag preserve in css
        webResources: {
          relativeTo: path.join(__dirname, '../build')
        }
      }
    });

    //send email
    await email.send({
      template: path.join(__dirname, '..', 'src/emails', template),//template are name of folder under email
      message: { to: receiver },
      locals //pass locals as properties inside template eg.<%= appLink %>",resetlinek,username..
    });
  } catch (error) {
    log.error(error);
  }
}

export { emailTemplates };

