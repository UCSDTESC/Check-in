import { Logger } from '@Config/Logging';
import Uploads from '@Config/Uploads';
import EmailService from '@Services/EmailService';
import EventService from '@Services/EventService';
import UserService from '@Services/UserService';
import { RegisterUserRequest } from '@Shared/api/Requests';
import { RegisterUserResponse } from '@Shared/api/Responses';
import { Request } from 'express-serve-static-core';
import {
  Get, JsonController, Post, UploadedFile,
  BodyParam, Req, BadRequestError, UseBefore
} from 'routing-controllers';

import { ErrorMessage } from '../../../utils/Errors';
import { UserAuthorisation } from 'api/middleware/UserAuthorisation';
import { ValidateEventAlias } from 'api/middleware/ValidateEventAlias';
import { SelectedEventAlias } from 'api/decorators/SelectedEventAlias';
import { EventDocument } from '@Models/Event';
import { AuthorisedUser } from 'api/decorators/AuthorisedUser';
import { TESCAccount } from '@Shared/ModelTypes';

/**
 * Handles all of the logic for user event registrations.
 */
@JsonController('/user')
export class UserController {
  constructor(
    private EventService: EventService,
    private EmailService: EmailService,
    private UserService: UserService,
  ) { }

  @Get('/')
  @UseBefore(UserAuthorisation)
  async get(@SelectedEventAlias() event: EventDocument, @AuthorisedUser() account: TESCAccount) {
    const application = await this.UserService.getUserApplication(account, event, true);

    if (!application) {
      throw new Error(ErrorMessage.USER_NOT_REGISTERED());
    }

    return application;
  }

  @Post('/')
  async registerNewUser(
    @UploadedFile('resume', { options: Uploads, required: false }) resume: Express.Multer.File,
    @BodyParam('user') body: RegisterUserRequest,
    @Req() request: Request
  ): Promise<RegisterUserResponse> {
    Logger.info(`Registration attempted by '${body.user.email}' for '${body.alias}'`);

    const event = await this.EventService.getEventByAlias(body.alias);
    const user = body.user;
    if (!event) {
      throw new BadRequestError(ErrorMessage.NO_ALIAS_EXISTS(event));
    }

    const isOpen = await this.EventService.isRegistrationOpen(event);
    if (!isOpen) {
      throw new BadRequestError(ErrorMessage.CANNOT_REGISTER());
    }

    let hasExistingAccount = false;
    let existingAccount = await this.UserService.getAccountByEmail(user.email);

    if (!existingAccount) {
      existingAccount = await this.UserService.createNewAccount(user.email, user.password);
    } else {
      hasExistingAccount = true;
      const alreadyApplied = await this.EventService.accountHasApplied(existingAccount, event);
      if (alreadyApplied) {
        throw new Error(ErrorMessage.USER_ALREADY_REGISTERED());
      }
    }

    const newUser = await this.UserService.createNewUser(existingAccount, event, user);
    if (newUser && resume) {
      await this.UserService.updateUserResume(newUser, resume);
    }

    if (!hasExistingAccount) {
      this.EmailService.sendAccountConfirmEmail(request, existingAccount, newUser, event);
    }

    Logger.info(`Registration successful for '${body.user.email}' to '${body.alias}'`);

    return { email: existingAccount.email } as RegisterUserResponse;
  }
}
