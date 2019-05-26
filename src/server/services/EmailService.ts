import { Config } from '@Config/index.ts';
import { Logger } from '@Config/Logging';
import { createTESCEmail, createEventEmail, sendAcceptanceEmail } from '@Config/Mailer';
import { Admin, TESCAccount, TESCUser, TESCEvent, AccountPasswordReset } from '@Shared/ModelTypes';
import { Request } from 'express';
import { Service } from 'typedi';

@Service()
export default class EmailService {
  /**
   * Sends an email with a link to reset an account password.
   * @param request The web request associated with the email.
   * @param account The account associated with the request.
   * @param reset The reset model associated with the account.
   */
  async sendPasswordResetEmail(request: Request, account: TESCAccount, reset: AccountPasswordReset) {
    Logger.info(`Sending forgot password email for ${account.email} [${account._id}]`);

    return createTESCEmail()
      .send({
        template: 'forgot',
        message: {
          to: account.email,
        },
        locals: {
          account: account,
          resetUrl: `${request.protocol}://${request.get('host')}/user/reset/${reset.resetString}`,
        },
      });
  }

  /**
   * Sends an email with a link to confirm the user's account.
   * @param request The web request associated with the email.
   * @param account The account associated with the request.
   * @param user The user associated with the request.
   * @param event The event associated with the request.
   */
  async sendAccountConfirmEmail(request: Request, account: TESCAccount, user: TESCUser, event: TESCEvent) {
    Logger.info(`Sending account confirmation email for ${account.email} [${account._id}]`);

    return createEventEmail(event)
      .send({
        template: 'confirmation',
        message: {
          to: `"${user.firstName} ${user.lastName}" <${account.email}>`,
        },
        locals: {
          user: user,
          confirmUrl: `${request.protocol}://${request.get('host')}/user/confirm/${account._id}`,
          event: event,
        },
      });
  }

  /**
   * Sends an email with a link to confirm the user's account.
   * @param request The web request associated with the email.
   * @param account The account associated with the request.
   * @param event The event associated with the request.
   */
  async sendEventAcceptanceEmail(request: Request, admin: Admin, event: TESCEvent, userEmail: string) {
    Logger.info(`Sending acceptance email to ${userEmail} for event ${event.alias} by ${admin.username}`);

    const ACCEPTANCE_EMAIL_TEMPLATE_ID = Config.SendGrid.AcceptanceEmailID

    const msg = {
      to: userEmail,
      from: 'no-reply@tesc.events',
      templateId: ACCEPTANCE_EMAIL_TEMPLATE_ID,
      dynamic_template_data: {
        event,
      }
    };

    return sendAcceptanceEmail(msg)
  }
}
