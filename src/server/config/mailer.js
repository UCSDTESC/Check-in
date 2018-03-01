const path = require('path');

const mailer = require('nodemailer');
const Email = require('email-templates');

module.exports = function() {
  const EMAIL_PATH = path.join(__dirname, '../../views/emails/');

  // Node mailer
  const transporter = mailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  var createEventSender = (event) => ({
    name: event.name + ' Team',
    address: process.env.MAIL_USER
  });

  var createEventEmail = (event) => new Email({
    message: {
      from: createEventSender(event)
    },
    views: {
      root: EMAIL_PATH,
    },
    juice: true,
    juiceResources: {
      webResources: {
        relativeTo: EMAIL_PATH
      }
    },
    transport: transporter
  });

  return {
    createEventEmail
  };
};
