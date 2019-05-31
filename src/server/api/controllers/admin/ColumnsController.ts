import UserService from '@Services/UserService';
import { Get, JsonController, UseBefore } from 'routing-controllers';

/**
 * Handles the logic for the user filtering columns.
 */
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
