import { Logger } from '@Config/Logging';
import { 
  createTESCEmail, 
  createEventEmail, 
  sendAcceptanceEmail, 
  sendRejectionEmail,
  sendWaitlistEmail } from '@Config/Mailer';
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
   * Sends an acceptance to the user.
   * @param request The web request associated with the email.
   * @param admin The admin making the request.
   * @param event The event associated with the request.
   */
  async sendEventAcceptanceEmail(request: Request, admin: Admin, event: TESCEvent, user: TESCUser) {
    Logger.info(`Sending acceptance email to '${user.account.email}' for event '${event.alias}' by '${admin.username}'`);
    return sendAcceptanceEmail(user.account.email, event);
  }

  /**
   * Sends a rejection to the user
   * @param request The web request associated with the email.
   * @param admin The admin making the request.
   * @param event The event associated with the request.
   */
  async sendEventRejectionEmail(request: Request, admin: Admin, event: TESCEvent, user: TESCUser) {
    Logger.info(`Sending rejection email to '${user.account.email}' for event '${event.alias}' by '${admin.username}'`);
    return sendRejectionEmail(user.account.email, event)
  }

  /**
   * Sends an email with a link to confirm the user's account.
   * @param request The web request associated with the email.
   * @param admin The admin making the request.
   * @param event The event associated with the request.
   */
  async sendEventWaitlistEmail(request: Request, admin: Admin, event: TESCEvent, user: TESCUser) {
    Logger.info(`Sending waitlist email to '${user.account.email}' for event '${event.alias}' by '${admin.username}'`);
    return sendWaitlistEmail(user.account.email, event)
  }
}
