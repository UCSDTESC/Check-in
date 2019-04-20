import { createParamDecorator } from 'routing-controllers';

export function AuthorisedAdmin(options?: {}) {
  return createParamDecorator({
    required: true,
    value: action => {
      return action.request.user;
    },
  });
}
