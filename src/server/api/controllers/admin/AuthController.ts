import { ADMIN_JWT_TIMEOUT } from '@Config/Passport';
import { Config } from '@Config/index';
import AdminService from '@Services/AdminService';
import { JWTAdminAuth, JWTAdminAuthToken } from '@Shared/api/Responses';
import { Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { Get, JsonController, UseBefore, Res, Req, Post } from 'routing-controllers';

import { AdminAuthorisation } from '../../middleware/AdminAuthorisation';
import { AdminLogin } from '../../middleware/AdminLogin';

/**
 * Handles all of the logic for admin authentication.
 */
@JsonController()
export class AuthController {
  constructor(
    private AdminService: AdminService
  ) { }

  /**
   * Signs a user with the JWT secret.
   * @param user The public user information to sign.
   * @returns The JWT token signed for that user.
   */
  generateToken(user: JWTAdminAuthToken) {
    return jwt.sign(user, Config.SessionSecret, {
      expiresIn: ADMIN_JWT_TIMEOUT,
    });
  }

  @Get('/authorised')
  @UseBefore(AdminAuthorisation)
  async authorised(@Res() res: Response) {
    return res.status(200).end();
  }

  @Post('/login')
  @UseBefore(AdminLogin)
  login(@Req() req: Request): JWTAdminAuth {
    const jwt = this.AdminService.getJwtAdmin(req.user);
    return {
      token: `JWT ${this.generateToken(jwt)}`,
      user: jwt,
    };
  }
}
