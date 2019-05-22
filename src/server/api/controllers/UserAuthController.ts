import { USER_JWT_TIMEOUT } from '@Config/Passport';
import { EventDocument } from '@Models/Event';
import EmailService from '@Services/EmailService';
import UserService from '@Services/UserService';
import { TESCAccount } from '@Shared/ModelTypes';
import { ForgotPasswordRequest, ResetPasswordRequest } from '@Shared/api/Requests';
import { JWTUserAuthToken, JWTUserAuth, SuccessResponse } from '@Shared/api/Responses';
import { Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { Get, JsonController, UseBefore, Res, Req, Post, Body } from 'routing-controllers';

import { ErrorMessage } from '../../utils/Errors';
import { AuthorisedUser } from '../decorators/AuthorisedUser';
import { SelectedEventAlias } from '../decorators/SelectedEventAlias';
import { UserAuthorisation } from '../middleware/UserAuthorisation';
import { UserLogin } from '../middleware/UserLogin';
import { ValidateEventAlias } from '../middleware/ValidateEventAlias';

@JsonController('/user')
export class UserAuthController {
  constructor(
    private EmailService: EmailService,
    private UserService: UserService
  ) { }

  /**
   * Signs a user with the JWT secret.
   * @param user The public user information to sign.
   * @returns The JWT token signed for that user.
   */
  generateToken(user: JWTUserAuthToken) {
    return jwt.sign(user, process.env.SESSION_SECRET, {
      expiresIn: USER_JWT_TIMEOUT,
    });
  }

  @Get('/authorised')
  @UseBefore(UserAuthorisation)
  async authorised(@Res() res: Response) {
    return res.status(200).end();
  }

  @Post('/login')
  @UseBefore(UserLogin)
  login(@Req() req: Request): JWTUserAuth {
    const jwt = this.UserService.getJwtUser(req.user);
    return {
      token: `JWT ${this.generateToken(jwt)}`,
      user: jwt,
    };
  }

  @Post('/forgot')
  async forgotPassword(@Body() body: ForgotPasswordRequest, @Req() req: Request) {
    const account = await this.UserService.getAccountByEmail(body.email);

    if (!account) {
      throw new Error(ErrorMessage.NO_ACCOUNT_EXISTS());
    }

    await this.EmailService.sendPasswordResetEmail(req, account);
    return SuccessResponse.Positive;
  }

  @Post('/reset')
  async resetPassword(@Body() body: ResetPasswordRequest) {
    await this.UserService.resetUserPassword(body.id, body.newPassword);
    return SuccessResponse.Positive;
  }

  @Get('/current/:eventAlias')
  @UseBefore(UserAuthorisation)
  @UseBefore(ValidateEventAlias)
  async getApplication(@SelectedEventAlias() event: EventDocument, @AuthorisedUser() account: TESCAccount) {
    const application = await this.UserService.getUserApplication(event, account, true);

    if (!application) {
      throw new Error(ErrorMessage.USER_NOT_REGISTERED());
    }

    return application;
  }
}
