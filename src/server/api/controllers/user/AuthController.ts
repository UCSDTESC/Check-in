import { USER_JWT_TIMEOUT } from '@Config/Passport';
import EmailService from '@Services/EmailService';
import UserService from '@Services/UserService';
import { ForgotPasswordRequest, ResetPasswordRequest } from '@Shared/api/Requests';
import { JWTUserAuthToken, JWTUserAuth, SuccessResponse } from '@Shared/api/Responses';
import { Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { Get, JsonController, UseBefore, Res, Req, Post, Body } from 'routing-controllers';
import { ErrorMessage } from '../../../utils/Errors';

import { UserAuthorisation } from '../../middleware/UserAuthorisation';
import { UserLogin } from '../../middleware/UserLogin';

@JsonController()
export class AuthController {
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

    const newReset = await this.UserService.createAccountReset(account);

    await this.EmailService.sendPasswordResetEmail(req, account, newReset);
    return SuccessResponse.Positive;
  }

  @Post('/reset')
  async resetPassword(@Body() body: ResetPasswordRequest) {
    await this.UserService.resetUserPassword(body.resetString, body.newPassword);
    return SuccessResponse.Positive;
  }
}
