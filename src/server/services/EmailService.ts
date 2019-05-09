import { Logger } from '@Config/Logging';
import { createTESCEmail, createEventEmail } from '@Config/Mailer';
import { UserModel, UserDocument } from '@Models/User';
import { EventModel } from '@Models/Event';
import { TESCAccount, TESCUser, TESCEvent } from '@Shared/ModelTypes';
import { Response, Request } from 'express';
import * as csv from 'fast-csv';
import { Parser } from 'json2csv';
import { Service, Inject } from 'typedi';

@Service()
export default class EmailService {
  /**
   * Sends an email with a link to reset an account password.
   * @param reuqest The web request associated with the email.
   * @param account The account associated with the request.
   */
  async sendPasswordResetEmail(request: Request, account: TESCAccount) {
    Logger.info(`Sending forgot password email for ${account.email} [${account._id}]`);

    return createTESCEmail()
      .send({
        template: 'forgot',
        message: {
          to: account.email,
        },
        locals: {
          account: account,
          resetUrl: `${request.protocol}://${request.get('host')}/user/reset/${account._id}`,
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
}
