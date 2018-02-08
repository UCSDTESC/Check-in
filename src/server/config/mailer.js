var mailer = require('nodemailer');
var EmailTemplate = require('email-templates').EmailTemplate;

module.exports = function(config) {
  // Node mailer
  const transporter = mailer.createTransport({
    host: config.MAIL_HOST,
    port: config.MAIL_PORT,
    secure: true,
    auth: {
      user: config.MAIL_USER,
      pass: config.MAIL_PASS
    }
  });

  const sender = {
    name: 'SD Hacks Team',
    address: config.MAIL_USER
  };

  var confirmSender = transporter.templateSender(
    new EmailTemplate('./views/emails/confirmation'),
    {
      from: sender
    }
  );

  var referSender = transporter.templateSender(
    new EmailTemplate('./views/emails/refer'),
    {
      from: sender
    }
  );

  var forgotSender = transporter.templateSender(
    new EmailTemplate('./views/emails/forgot'),
    {
      from: sender
    }
  );

  return {
    confirmSender,
    referSender,
    forgotSender
  };
};
