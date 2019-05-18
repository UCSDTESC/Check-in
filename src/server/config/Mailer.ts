import * as sendgrid from '@sendgrid/mail';
import * as Email from 'email-templates';
import * as mailer from 'nodemailer';
import * as path from 'path';

import { Config } from '.';

const EMAIL_PATH = path.join(__dirname, '../views/emails');

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

// Node mailer
const transporter = mailer.createTransport({
  host: Config.Mail.Host,
  port: Config.Mail.Port,
  secure: true,
  auth: {
    user: Config.Mail.User,
    pass: Config.Mail.Pass,
  },
});

const createTESCSender = () => ({
  name: 'TESC Events Team',
  address: Config.Mail.User,
});

const createEventSender = (event) => ({
  name: event.name + ' Team',
  address: Config.Mail.User,
});

export const createTESCEmail = () => new Email({
  message: {
    from: createTESCSender(),
  },
  views: {
    root: EMAIL_PATH,
  },
  juice: true,
  juiceResources: {
    webResources: {
      relativeTo: EMAIL_PATH,
    },
  },
  transport: transporter,
});

export const createEventEmail = (event) => new Email({
  message: {
    from: createEventSender(event),
  },
  views: {
    root: EMAIL_PATH,
  },
  juice: true,
  juiceResources: {
    webResources: {
      relativeTo: EMAIL_PATH,
    },
  },
  transport: transporter,
});

export const sendAcceptanceEmail = (msg) => 
  sendgrid.send(msg)
