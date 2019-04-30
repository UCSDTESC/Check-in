import { PUBLIC_EVENT_FIELDS } from '@Models/Event';
import { UserModel, UserSchema } from '@Models/User';
import { TESCEvent, TESCAccount, UserStatus, TESCUser } from '@Shared/Types';
import { ColumnResponse, JWTUserAuthToken } from '@Shared/api/Responses';
import { Service, Inject } from 'typedi';

@Service()
export default class UserService {
  @Inject('UserModel')
  private UserModel: UserModel;

  /**
   * Create a JWT token for a given user account.
   * @param user The user account to fetch the JWT for.
   */
  getJwtUser(user: TESCAccount): JWTUserAuthToken {
    return {
      _id: user._id,
    };
  }

  /**
   * Get a list of all users signed up for a particular event.
   * @param event The event to poll.
   */
  async getAllUsersByEvent(event: TESCEvent) {
    const query = this.UserModel.find({event: event});

    return await query
      .populate('account')
      .populate({
        path: 'event',
        populate: [{
          path: 'customQuestions.longText',
        },
        {
          path: 'customQuestions.shortText',
        },
        {
          path: 'customQuestions.checkBox',
        }],
      })
      .exec();
  }

  /**
   * Set the user checkedIn flag to true.
   * @param id The document ID of the user.
   */
  async checkinUserById(id: string) {
    return await this.UserModel
      .findByIdAndUpdate(id, { checkedIn : true })
      .exec();
  }

  /**
   * Return a mapping of fields to their display names.
   */
  getAllDisplayNameFields(): ColumnResponse {
    return Object.entries((UserSchema as any).paths)
      .filter(([fieldName, field]: any) => 'displayName' in field.options)
      .reduce((acc, [fieldName, field]: any) => {
        acc[fieldName] = field.options.displayName as string;
        return acc;
      }, {});
  }

  /**
   * Get all the events, with public fields, for a particular account.
   * @param account The account for which to get events.
   */
  async getAccountPublicEvents(account: TESCAccount) {
    const populatedUsers = await this.UserModel
      .find({account: account})
      .populate('event', PUBLIC_EVENT_FIELDS);

    return populatedUsers.map(user => user.event);
  }

  /**
   * Updates all the given users to the new status.
   * @param users A list of user IDs that will be updated.
   * @param status The new status of the users.
   */
  async changeUserStatuses(users: string[], status: UserStatus) {
    return this.UserModel
      .updateMany({_id: {$in: users}}, {status: status})
      .exec();
  }

  /**
   * Updates the fields of a given user.
   * @param user The user to update.
   */
  async updateUser(user: TESCUser) {
    return this.UserModel
      .findOneAndUpdate({_id: user._id}, user)
      .exec();
  }
}
