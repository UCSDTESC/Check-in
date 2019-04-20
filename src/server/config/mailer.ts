import Email from 'email-templates';
import mailer from 'nodemailer';
import path from 'path';

import { Config } from '.';

const EMAIL_PATH = path.join(__dirname, '../../views/emails/');

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

export const createTESCEmail = (event) => new Email({
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
