import Uploads from '@Config/Uploads';
import { EventDocument } from '@Models/Event';
import UserService from '@Services/UserService';
import { TESCAccount, TESCUser } from '@Shared/ModelTypes';
import { UpdateUserRequest, RSVPUserRequest } from '@Shared/api/Requests';
import { Get, JsonController, UseBefore, Res, Post, Req, Body, UploadedFile, BodyParam } from 'routing-controllers';

import { AuthorisedUser } from '../decorators/AuthorisedUser';
import { SelectedEventAlias } from '../decorators/SelectedEventAlias';
import { UserAuthorisation } from '../middleware/UserAuthorisation';
import { ValidateEventAlias } from '../middleware/ValidateEventAlias';

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
