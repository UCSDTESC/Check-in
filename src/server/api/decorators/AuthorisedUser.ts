import { createParamDecorator } from 'routing-controllers';

export function AuthorisedUser(options?: {}) {
  return createParamDecorator({
    required: true,
    value: action => {
      return action.request.user;
    },
  });
}
