import { Logger } from '@Config/Logging';
import Uploads from '@Config/Uploads';
import { EventDocument } from '@Models/Event';
import { TeamDocument } from '@Models/Team';
import { UserDocument } from '@Models/User';
import EmailService from '@Services/EmailService';
import EventService from '@Services/EventService';
import TeamService from '@Services/TeamService';
import UserService from '@Services/UserService';
import { TESCAccount, TESCUser, TESCTeam, MAX_TEAM_SIZE } from '@Shared/ModelTypes';
import { RegisterUserRequest, UpdateUserRequest, RSVPUserRequest } from '@Shared/api/Requests';
import { RegisterUserResponse } from '@Shared/api/Responses';
import { Request } from 'express-serve-static-core';
import {
  Get, JsonController, Post, UploadedFile,
  BodyParam, Req, BadRequestError, UseBefore, Put, Body
} from 'routing-controllers';

import { ErrorMessage } from '../../../utils/Errors';
import { AuthorisedUser } from '../../decorators/AuthorisedUser';
import { SelectedEventAlias } from '../../decorators/SelectedEventAlias';
import { SelectedUserID } from '../../decorators/SelectedUserID';
import { UserAuthorisation } from '../../middleware/UserAuthorisation';

/**
 * Handles all of the logic for user event registrations.
 */
@JsonController('/user')
export class UserController {
  constructor(
    private EventService: EventService,
    private EmailService: EmailService,
    private TeamService: TeamService,
    private UserService: UserService,
  ) { }

  @Get('/')
  @UseBefore(UserAuthorisation)
  async get(@SelectedEventAlias() event: EventDocument, @AuthorisedUser() account: TESCAccount): Promise<TESCUser[]> {
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
      throw new BadRequestError(ErrorMessage.NO_ALIAS_EXISTS(body.alias));
    }

    const isOpen = await this.EventService.isRegistrationOpen(event);
    if (!isOpen) {
      throw new BadRequestError(ErrorMessage.CANNOT_REGISTER());
    }

    let hasExistingAccount = false;
    let existingAccount = await this.UserService.getAccountByEmail(user.email);

    // Check the team code works before registering account
    let existingTeam: TeamDocument;
    if (event.options.allowTeammates) {
      existingTeam = await this.TeamService.getTeamByCode(user.teamCode);
      // Check error conditions for the existing team
      if (existingTeam) {
        if (existingTeam.event._id.toHexString() !== event._id.toHexString()) {
          throw new BadRequestError(ErrorMessage.NO_TEAM_EXISTS(user.teamCode));
        }

        if (existingTeam.members.length >= MAX_TEAM_SIZE) {
          throw new BadRequestError(ErrorMessage.TEAM_FULL(user.teamCode, MAX_TEAM_SIZE));
        }
      } else if (!user.createTeam) { // If team doesn't exist, but trying to join one
        throw new BadRequestError(ErrorMessage.NO_TEAM_EXISTS(user.teamCode));
      }
    }

    if (!existingAccount) {
      existingAccount = await this.UserService.createNewAccount(user.email, user.password);
    } else {
      hasExistingAccount = true;
      const alreadyApplied = await this.EventService.accountHasApplied(existingAccount, event);
      if (alreadyApplied) {
        throw new BadRequestError(ErrorMessage.USER_ALREADY_REGISTERED());
      }
    }

    const newUser = await this.UserService.createNewUser(existingAccount, event, user);
    if (newUser && resume) {
      await this.UserService.updateUserResume(newUser, resume);
    }

    if(event.options.allowTeammates && !existingTeam) {
      if (user.createTeam) {
        existingTeam = await this.TeamService.createNewTeam(event, user.teamCode);
      } else {
        throw new BadRequestError(ErrorMessage.NO_TEAM_EXISTS(user.teamCode));
      }
    }

    if (existingTeam) {
      existingTeam.members.push(newUser);
      newUser.team = existingTeam;

      await existingTeam.save();
      await newUser.save();
    }

    if (!hasExistingAccount) {
      this.EmailService.sendAccountConfirmEmail(request, existingAccount, newUser, event);
    }

    Logger.info(`Registration successful for '${body.user.email}' to '${body.alias}'`);

    return { email: existingAccount.email } as RegisterUserResponse;
  }

  @Put('/')
  @UseBefore(UserAuthorisation)
  async updateUser(
    @AuthorisedUser() account: TESCAccount,
    @UploadedFile('resume', { options: Uploads, required: false }) resume: Express.Multer.File,
    @BodyParam('user') body: UpdateUserRequest): Promise<TESCUser> {
    const event = body.event;
    const user = (await this.UserService.getUserApplication(account, event))[0];
    if (!user) {
      throw new BadRequestError(ErrorMessage.NO_USER_EXISTS());
    }

    await this.UserService.updateUserEditables(user, body, resume);

    return (await this.UserService.getUserApplication(account, event, true))[0];
  }

  @Post('/:userId/rsvp')
  @UseBefore(UserAuthorisation)
  async userRSVP(@SelectedUserID() user: UserDocument, @AuthorisedUser() account: TESCAccount,
    @Body() body: RSVPUserRequest): Promise<TESCUser> {
    if (user.account._id.toString() !== account._id.toString()) {
      throw new BadRequestError(ErrorMessage.NO_USER_EXISTS());
    }

    await this.UserService.RSVPUser(user, body.status, body.bussing);
    const newUsers = await this.UserService.getUserApplication(account, user.event, true);
    return newUsers[0];
  }

  @Get('/:userId/team')
  @UseBefore(UserAuthorisation)
  async getTeam(@SelectedUserID() user: UserDocument, @AuthorisedUser() account: TESCAccount): Promise<TESCTeam> {
    if (user.account._id.toString() !== account._id.toString()) {
      throw new BadRequestError(ErrorMessage.NO_USER_EXISTS());
    }

    if (!user.team) {
      throw new Error(ErrorMessage.USER_HAS_NO_TEAM());
    }

    const teamDoc = await this.TeamService.getTeamById(user.team._id);

    return this.TeamService.populateTeammatesPublicFields(teamDoc);
  }
}
