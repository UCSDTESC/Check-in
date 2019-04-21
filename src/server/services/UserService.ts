import { UserModel } from '@Models/User';
import { TESCEvent } from '@Shared/Types';
import { Service, Inject } from 'typedi';

@Service()
export default class UserService {
  @Inject('UserModel')
  private UserModel: UserModel;

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
}
