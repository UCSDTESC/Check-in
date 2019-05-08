import { AdminDocument } from '@Models/Admin';
import AdminService from '@Services/AdminService';
import { Role, getRoleRank } from '@Shared/Roles';
import { RegisterAdminRequest, DeleteAdminRequest } from '@Shared/api/Requests';
import { SuccessResponse } from '@Shared/api/Responses';
import { Get, JsonController, UseBefore, Post, Body, Delete } from 'routing-controllers';

import { ErrorMessage } from '../../utils/Errors';
import { AuthorisedAdmin } from '../decorators/AuthorisedAdmin';
import { AdminAuthorisation } from '../middleware/AdminAuthorisation';
import { RoleAuth } from '../middleware/RoleAuth';

@JsonController('/admins')
@UseBefore(AdminAuthorisation)
export class AdminsController {
  constructor(
    private AdminService: AdminService
  ) {}

  @Get('/')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  async getAllAdmins() {
    return this.AdminService.getAllAdmins();
  }

  @Post('/')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  async registerAdmin(@AuthorisedAdmin() admin: AdminDocument, @Body() body: RegisterAdminRequest) {
    // Trying to create an admin with greater privileges
    if (getRoleRank(body.role) > getRoleRank(admin.role)) {
      throw new Error(ErrorMessage.PERMISSION_ERROR());
    }

    const newAdmin = await this.AdminService.registerAdmin(body);
    return newAdmin;
  }

  @Delete('/')
  @UseBefore(RoleAuth(Role.ROLE_DEVELOPER))
  async deleteAdmin(@Body() body: DeleteAdminRequest) {
    await this.AdminService.deleteAdmin(body.id);
    return SuccessResponse.Positive;
  }
}
