import AdminService from '@Services/AdminService';
import { Role } from '@Shared/Roles';
import { Get, JsonController, UseBefore } from 'routing-controllers';

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
}
