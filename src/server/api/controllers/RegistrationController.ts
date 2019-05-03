import { Logger } from '@Config/Logging';
import Uploads from '@Config/Uploads';
import { EventDocument } from '@Models/Event';
import EmailService from '@Services/EmailService';
import EventService from '@Services/EventService';
import UserService from '@Services/UserService';
import { TESCEvent, TESCUser } from '@Shared/ModelTypes';
import { RegisterUserRequest } from '@Shared/api/Requests';
import { EventsWithStatisticsResponse, RegisterUserResponse, EmailExistsResponse, SuccessResponse } from '@Shared/api/Responses';
import { Request, Response } from 'express';
import { Post, JsonController, UseBefore, Param, Body, BodyParam, UploadedFile, Req, Get, Res } from 'routing-controllers';

import { ErrorMessage } from '../../utils/Errors';
import { SelectedEvent } from '../decorators/SelectedEvent';
import { ValidateEventAlias } from '../middleware/ValidateEventAlias';

@JsonController('/register')
export class RegistrationController {
  constructor(
    private EmailService: EmailService,
    private EventService: EventService,
    private UserService: UserService,
  ) {}

  @Post('/:eventAlias')
  @UseBefore(ValidateEventAlias)
  async registerNewUser(
    @UploadedFile('resume', {options: Uploads}) resume: Express.Multer.File,
    @SelectedEvent() event: EventDocument,
    @BodyParam('user') body: RegisterUserRequest,
    @Req() request: Request
  ): Promise<RegisterUserResponse> {
    let hasExistingAccount = false;
    let existingAccount = await this.UserService.getAccountByEmail(body.email);

    if (!existingAccount) {
      existingAccount = await this.UserService.createNewAccount(body.email, body.password);
    } else {
      hasExistingAccount = true;
      const alreadyApplied = await this.EventService.accountHasApplied(existingAccount, event);
      if (alreadyApplied) {
        throw new Error(ErrorMessage.USER_ALREADY_REGISTERED());
      }
    }

    const newUser = await this.UserService.createNewUser(existingAccount, event, body);
    if (newUser && resume) {
      await this.UserService.updateUserResume(newUser, resume);
    }

    if (!hasExistingAccount) {
      this.EmailService.sendAccountConfirmEmail(request, existingAccount, newUser, event);
    }

    return { email: existingAccount.email };
  }

  @Get('/confirm/:accountId')
  async confirmEmail(@Param('accountId') accountId: string) {
    const account = await this.UserService.confirmAccountEmail(accountId);
    if (!account) {
      throw new Error(ErrorMessage.NO_USER_EXISTS());
    }

    return SuccessResponse.Positive;
  }

  @Get('/verify/:email')
  async checkEmailExists(@Param('email') email: string): Promise<EmailExistsResponse> {
    const account = await this.UserService.getAccountByEmail(email);
    return { exists: !!account };
  }
}
