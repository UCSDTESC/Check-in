import UserService from '@Services/UserService';
import { createParamDecorator } from 'routing-controllers';
import { Container } from 'typedi';

export function SelectedUserID(options?: {}) {
  return createParamDecorator({
    required: true,
    value: async action => {
      const userService = Container.get(UserService);
      const userId = action.request.params.userId;
      return await userService.getUserById(userId);
    },
  });
}
