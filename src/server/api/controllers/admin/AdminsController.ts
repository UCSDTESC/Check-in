import { AdminDocument } from '@Models/Admin';
import AdminService from '@Services/AdminService';
import { Role, getRoleRank } from '@Shared/Roles';
import { RegisterAdminRequest } from '@Shared/api/Requests';
import { SuccessResponse } from '@Shared/api/Responses';
import { Get, JsonController, UseBefore, Post, Body, Delete, Param } from 'routing-controllers';

import { ErrorMessage } from '../../../utils/Errors';
import { AuthorisedAdmin } from '../../decorators/AuthorisedAdmin';
import { AdminAuthorisation } from '../../middleware/AdminAuthorisation';
import { RoleAuth } from '../../middleware/RoleAuth';

/**
 * Handles all the logic for managing admin accounts.
 */
@JsonController('/admins')
@UseBefore(AdminAuthorisation)
export class AdminsController {
  constructor(
    private AdminService: AdminService
  ) { }

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

  @Delete('/:adminId')
  @UseBefore(RoleAuth(Role.ROLE_DEVELOPER))
  async deleteAdmin(@Param('adminId') adminId: string) {
    await this.AdminService.deleteAdmin(adminId);
    return SuccessResponse.Positive;
  }
}
