import { USER_JWT_TIMEOUT } from '@Config/Passport';
import EventService from '@Services/EventService';
import UserService from '@Services/UserService';
import { TESCEvent, TESCUser, TESCAccount } from '@Shared/ModelTypes';
import { EventsWithStatisticsResponse, JWTUserAuthToken, JWTUserAuth } from '@Shared/api/Responses';
import { Response, Request } from 'express-serve-static-core';
import * as jwt from 'jsonwebtoken';
import { Get, JsonController, UseBefore, Param, Res, Post, Req } from 'routing-controllers';

import { AuthorisedUser } from '../decorators/AuthorisedUser';
import { SelectedEvent } from '../decorators/SelectedEvent';
import { UserAuthorisation } from '../middleware/UserAuthorisation';
import { UserLogin } from '../middleware/UserLogin';
import { ValidateEventAlias } from '../middleware/ValidateEventAlias';

@JsonController('/user')
export class UserController {
  constructor(
    private EventService: EventService,
    private UserService: UserService
  ) {}

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

  @Get('/events')
  @UseBefore(UserAuthorisation)
  async getUserEvents(@AuthorisedUser() account: TESCAccount) {
    return this.UserService.getAccountPublicEvents(account);
  }
}
