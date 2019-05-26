import UserService from '@Services/UserService';
import { Get, JsonController, UseBefore } from 'routing-controllers';

@JsonController('/columns')
export class ColumnsController {
  constructor(
    private UserService: UserService
  ) { }

  @Get('/')
  async getColumnDisplayNames() {
    const displayNames = this.UserService.getAllDisplayNameFields();
    return displayNames;
  }
}
