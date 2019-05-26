import { USER_JWT_TIMEOUT } from '@Config/Passport';
import { Config } from '@Config/index';
import EmailService from '@Services/EmailService';
import EventService from '@Services/EventService';
import UserService from '@Services/UserService';
import { TESCAccount, TESCUser } from '@Shared/ModelTypes';
import { ResetPasswordRequest, ForgotPasswordRequest, RegisterUserRequest, UpdateUserRequest, RSVPUserRequest } from '@Shared/api/Requests';
import { JWTUserAuthToken, JWTUserAuth, SuccessResponse } from '@Shared/api/Responses';
import { Response, Request } from 'express-serve-static-core';
import * as jwt from 'jsonwebtoken';
import { Get, JsonController, UseBefore, Res, Post, Req, Body, UploadedFile, BodyParam } from 'routing-controllers';

import { ErrorMessage } from '../../utils/Errors';
import { AuthorisedUser } from '../decorators/AuthorisedUser';
import { UserAuthorisation } from '../middleware/UserAuthorisation';
import { UserLogin } from '../middleware/UserLogin';
import { ValidateEventAlias } from '../middleware/ValidateEventAlias';
import Uploads from '@Config/Uploads';
import { SelectedEventAlias } from '../decorators/SelectedEventAlias';
import { EventDocument } from '@Models/Event';
import { UserDocument } from '@Models/User';

@JsonController('/user')
export class UserController {
  constructor(
    private UserService: UserService
  ) { }

  @Get('/events')
  @UseBefore(UserAuthorisation)
  async getUserEvents(@AuthorisedUser() account: TESCAccount) {
    return this.UserService.getAccountPublicEvents(account);
  }

  @Post('/update/:eventAlias')
  @UseBefore(UserAuthorisation)
  @UseBefore(ValidateEventAlias)
  async updateUser(
    @AuthorisedUser() account: TESCAccount,
    @UploadedFile('resume', { options: Uploads, required: false }) resume: Express.Multer.File,
    @SelectedEventAlias() event: EventDocument,
    @BodyParam('user') body: UpdateUserRequest): Promise<TESCUser> {
    const user = (await this.UserService.getUserApplication(account, event))[0];
    await this.UserService.updateUserEditables(user, body, resume);

    return (await this.UserService.getUserApplication(account, event, true))[0];
  }

  @Post('/rsvp/:eventAlias')
  @UseBefore(UserAuthorisation)
  @UseBefore(ValidateEventAlias)
  async userRSVP(@SelectedEventAlias() event: EventDocument, @AuthorisedUser() account: TESCAccount,
    @Body() body: RSVPUserRequest) {
    const user = (await this.UserService.getUserApplication(account, event))[0];

    await this.UserService.RSVPUser(user, body.status, body.bussing);
    return await this.UserService.getUserApplication(account, event, true);
  }
}
