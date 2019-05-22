import UserService from '@Services/UserService';
import { Role } from '@Shared/Roles';
import { Get, JsonController, UseBefore } from 'routing-controllers';

import { RoleAuth } from '../../middleware/RoleAuth';

@JsonController('/columns')
export class ColumnsController {
  constructor(
    private UserService: UserService
  ) { }

  @Get('/')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  async getColumnDisplayNames() {
    const displayNames = this.UserService.getAllDisplayNameFields();
    return displayNames;
  }
}
