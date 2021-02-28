import TeamService from '@Services/TeamService';
import { createParamDecorator } from 'routing-controllers';
import { Container } from 'typedi';

export function SelectedTeamID(options?: {}) {
  return createParamDecorator({
    required: true,
    value: async action => {
      const teamService = Container.get(TeamService);
      const teamId = action.request.params.teamId;
      return await teamService.getTeamById(teamId);
    },
  });
}
