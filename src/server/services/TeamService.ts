import { Logger } from "@Config/Logging";
import { EventDocument } from "@Models/Event";
import { TeamDocument, TeamModel } from "@Models/Team";
import { UserDocument, UserModel } from "@Models/User";
import {
  MAX_TEAM_SIZE,
  TEAM_CODE_LENGTH,
  TESCTeam,
  TESCUser,
} from "@Shared/ModelTypes";
import { ClientSession } from "mongoose";
import { Inject, Service } from "typedi";
import { ErrorMessage } from "utils/Errors";

@Service()
export default class TeamService {
  @Inject("TeamModel")
  private TeamModel: TeamModel;

  @Inject("UserModel")
  private UserModel: UserModel;

  /**
   * Generates a new unique team code.
   */
  async generateTeamCode(): Promise<string> {
    let isUnique = false;
    let newCode: string;

    do {
      newCode = Math.random()
        .toString(36)
        .substr(2, TEAM_CODE_LENGTH)
        .toUpperCase();
      Logger.debug(`Attempting to create team code '${newCode}'`);

      const numDocs = await this.TeamModel.countDocuments({ code: newCode });
      isUnique = numDocs === 0;
    } while (!isUnique);

    return newCode;
  }

  /**
   * Gets a team by the registered code.
   * @param code The code associated with the team.
   */
  async getTeamByCode(code: string): Promise<TeamDocument> {
    return this.TeamModel.findOne({
      code: {
        $regex: new RegExp(code, "i"),
      },
    })
      .populate("members")
      .populate("event")
      .exec();
  }

  /**
   *
   * @param event The event to associate with the new team.
   * @param code Optional. Provide a 4-digit team code to associate with the team.
   */
  async createNewTeam(event: EventDocument, code?: string) {
    if (code && code.length !== TEAM_CODE_LENGTH) {
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

  /**
   * Gets all teams that are registered to a given event.
   * @param event The event associated with all the teams.
   */
  async getTeamsByEvent(event: EventDocument) {
    return this.TeamModel.find({
      event: event,
    })
      .populate("members")
      .exec();
  }

  /**
   * Edits the team associated with a given ID.
   * @param teamId The ID associated with the team.
   */
  async updateTeamById(teamId: string, update: TESCTeam) {
    this.TeamModel.findByIdAndUpdate(teamId, update).exec();
  }

  /**
   * Gets the team associated with a given ID.
   * @param teamId The ID associated with the team.
   * @param session A session under which to fetch the user.
   */
  async getTeamById(teamId: string, session?: ClientSession) {
    let teamQuery = this.TeamModel.findById(teamId).populate("members");
    if (session) teamQuery = teamQuery.session(session);
    return teamQuery.exec();
  }

  /**
   * Adds existing users to a given team.
   * @param team The existing team in which to add members.
   * @param newMembers The new members (populated with team information).
   */
  async addMembersToTeam(team: TeamDocument, newMembers: UserDocument[]) {
    // Ensure each of the users is not already associated with a team
    if (newMembers.some((member) => !!member.team)) {
      throw new Error(ErrorMessage.USER_ON_TEAM());
    }

    // Ensure we don't exceed team maximums
    if (newMembers.length + team.members.length > MAX_TEAM_SIZE)
      throw new Error(ErrorMessage.TEAM_FULL(team.code, MAX_TEAM_SIZE));

    team.members.push(...newMembers);
    await team.save();

    return newMembers.forEach((member) => {
      member.team = team;
      member.save();
    });
  }

  /**
   * Removes existing users to a given team.
   * @param team The existing team in which to remove members.
   * @param removeMembers The members to be removed from the team.
   */
  async removeMembersToTeam(team: TeamDocument, removeMembers: UserDocument[]) {
    const removeIds = removeMembers.map((member) => member._id.toHexString());
    // Filter by IDs
    team.members = team.members.filter(
      (member) => !removeIds.includes(member._id.toHexString())
    );
    await team.save();

    removeMembers.forEach((member) => {
      member.team = undefined;
      member.save();
    });

    if (team.members.length === 0) {
      return this.TeamModel.findByIdAndDelete(team._id).exec();
    }
  }

  /**
   * Populates the fields that are avaiable to admins
   * @param team The team to populate
   */
  async populateTeammatesAdminFields(team: TeamDocument) {
    return team
      .populate({ path: "members", populate: { path: "account" } })
      .execPopulate();
  }

  /**
   * Populates the fields that are public only to the teammates.
   * @param team The team to populate.
   */
  async populateTeammatesPublicFields(team: TeamDocument) {
    return team
      .populate({
        path: "members",
        select: "firstName lastName",
        populate: {
          path: "account",
          select: "email",
        },
      })
      .execPopulate();
  }
}
