import { Logger } from '@Config/Logging';
import { createTESCEmail } from '@Config/Mailer';
import { UserModel, UserDocument } from '@Models/User';
import { EventModel } from '@Models/event';
import { TESCAccount } from '@Shared/ModelTypes';
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
}
