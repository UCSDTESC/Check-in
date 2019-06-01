import * as sendgrid from '@sendgrid/mail';
import * as Email from 'email-templates';
import * as mailer from 'nodemailer';
import * as path from 'path';

import { Config } from '.';
import { TESCEvent } from '@Shared/ModelTypes';

const EMAIL_PATH = path.join(__dirname, '../views/emails');

sendgrid.setApiKey(Config.SendGrid.Key);

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

export const sendAcceptanceEmail = (to: string, event: TESCEvent) => {
  const ACCEPTANCE_EMAIL_TEMPLATE_ID = Config.SendGrid.AcceptanceEmailID

  const msg = {
    to,
    from: 'no-reply@tesc.ucsd.edu',
    templateId: ACCEPTANCE_EMAIL_TEMPLATE_ID,
    dynamic_template_data: {
      event,
    }
  }
  
  return sendgrid.send(msg)
}

export const sendRejectionEmail = (to: string, event: TESCEvent) => {
  const REJECTION_EMAIL_ID = Config.SendGrid.RejectionEmailID

  const msg = {
    to,
    from: 'no-reply@tesc.ucsd.edu',
    templateId: REJECTION_EMAIL_ID,
    dynamic_template_data: {
      event,
    }
  }

  return sendgrid.send(msg)
}

export const sendWaitlistEmail = (to: string, event: TESCEvent) => {
  const WAITLIST_EMAIL_ID = Config.SendGrid.WaitlistEmailID

  const msg = {
    to,
    from: 'no-reply@tesc.ucsd.edu',
    templateId: WAITLIST_EMAIL_ID,
    dynamic_template_data: {
      event
    }
  }

  return sendgrid.send(msg)
}
