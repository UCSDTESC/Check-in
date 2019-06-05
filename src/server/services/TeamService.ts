import { Logger } from '@Config/Logging';
import { EventDocument } from '@Models/Event';
import { TeamModel, TEAM_CODE_LENGTH } from '@Models/Team';
import { UserModel } from '@Models/User';
import { TESCTeam } from '@Shared/ModelTypes';
import { Service, Inject } from 'typedi';

@Service()
export default class TeamService {
  @Inject('TeamModel')
  private TeamModel: TeamModel;

  @Inject('UserModel')
  private UserModel: UserModel;

  /**
   * Generates a new unique team code.
   */
  async generateTeamCode(): Promise<string> {
    let isUnique = false;
    let newCode: string;

    do {
      newCode = Math.random().toString(36).substr(2, TEAM_CODE_LENGTH).toUpperCase();
      Logger.debug(`Attempting to create team code '${newCode}'`);

      const numDocs = await this.TeamModel.countDocuments({ code: newCode });
      isUnique = (numDocs === 0);
    } while (!isUnique);

    return newCode;
  }

  /**
   *
   * @param event The event to associate with the new team.
   * @param code Optional. Provide a 4-digit team code to associate with the team.
   */
  async createNewTeam(event: EventDocument, code?: string) {
    if (code.length !== TEAM_CODE_LENGTH) {
      throw new Error(`Code must be exactly ${TEAM_CODE_LENGTH} digits.`);
    }

    if (!code) {
      code = await this.generateTeamCode();
    }

    const newTeam = new this.TeamModel({
      event: event,
      code: code,
      members: [],
    } as TESCTeam);

    return newTeam.save();
  }
}
