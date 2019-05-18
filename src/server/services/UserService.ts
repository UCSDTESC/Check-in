import { AccountModel, AccountDocument } from '@Models/Account';
import { AccountResetModel } from '@Models/AccountReset';
import { PUBLIC_EVENT_FIELDS, EventDocument } from '@Models/Event';
import { UserModel, UserSchema, PUBLIC_USER_FIELDS, UserDocument, EDITABLE_USER_FIELDS } from '@Models/User';
import { TESCEvent, TESCAccount, TESCUser, AccountPasswordReset } from '@Shared/ModelTypes';
import { UserStatus } from '@Shared/UserStatus';

import { RegisterUserRequest } from '@Shared/api/Requests';
import { ColumnResponse, JWTUserAuthToken } from '@Shared/api/Responses';
import { generate } from 'generate-password';
import * as moment from 'moment';
import { Service, Inject } from 'typedi';

import { ErrorMessage } from '../utils/Errors';

@Service()
export default class UserService {
  @Inject('AccountModel')
  private AccountModel: AccountModel;

  @Inject('AccountResetModel')
  private AccountResetModel: AccountResetModel;

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

  /**
   * Get a user's application to a given event.
   * @param event The event associated with the application.
   * @param account The account that created the application.
   * @param publicOnly Select only the public fields to return.
   */
  async getUserApplication(event: TESCEvent, account: TESCAccount, publicOnly: boolean = false) {
    let query = this.UserModel
      .findOne({account: account, event: event});

    if (publicOnly) {
      query = query.select(PUBLIC_USER_FIELDS);
    }

    return query
      .populate('event')
      .populate('account')
      .exec();
  }

  /**
   * Resets an account password by a given reset string.
   * @param resetString The string associated with the reset.
   * @param newPassword The new password for the account.
   */
  async resetUserPassword(resetString: string, newPassword: string) {
    const reset = await this.AccountResetModel
      .findOne({resetString})
      .populate('account')
      .exec();

    if (!reset || !reset.valid || moment(reset.expires).isBefore(moment())) {
      throw new Error(ErrorMessage.INVALID_RESET());
    }

    reset.valid = false;

    reset.account.password = newPassword;
    await (reset.account as AccountDocument).save();
    return reset.save();
  }

  /**
   * Get an account by the registered email.
   * @param email The email associated with the account.
   * @param caseSensitive Determines whether the search is case sensitive.
   */
  async getAccountByEmail(email: string, caseSensitive: boolean = false) {
    if (caseSensitive) {
      return this.AccountModel
        .findOne({email: email})
        .exec();
    }

    return this.AccountModel
      .findOne({email: {
        $regex: new RegExp(email, 'i'),
      }})
      .exec();
  }

  /**
   * Creates a new account with the given information.
   * @param email The email to associate with the new account.
   * @param password The password to associate with the new account.
   */
  async createNewAccount(email: string, password: string) {
    return this.AccountModel
      .create({
        email,
        password,
      } as AccountDocument);
  }

  /**
   * Registers a new user in the database based on the given fields.
   * @param account The account to associate with the new user.
   * @param event The event to associate with the new user.
   * @param request The request data to fill in the user.
   */
  async createNewUser(account: AccountDocument, event: EventDocument, request: RegisterUserRequest) {
    const {customQuestionResponses, ...strippedRequest} = request;

    const newUser = new this.UserModel({
      account: account,
      event: event,
      customQuestionResponses: customQuestionResponses as any,
      ...strippedRequest,
    } as TESCUser);

    return newUser.save();
  }

  /**
   * Updates the resume on a given user.
   * @param user The user for which to update.
   * @param resume The new resume for the given user.
   */
  async updateUserResume(user: UserDocument, resume: Express.Multer.File) {
    await user.attach('resume', {path: resume.path});
    return user.save();
  }

  /**
   * Updates a given user with new values that are allowed to be edited by the user.
   * @param user The user document to update.
   * @param delta The new field values to set.
   * @param newResume A new resume to upload.
   */
  async updateUserEditables(user: UserDocument, delta: Partial<TESCUser>, newResume?: Express.Multer.File) {
    // Filter out all the fields that aren't editable
    const editableDelta: Partial<TESCUser> = {};
    Object.keys(delta).forEach(field => {
      if (EDITABLE_USER_FIELDS.includes(field)) {
        editableDelta[field] = delta[field];
      }
    });

    const newUser = await this.UserModel
      .findOneAndUpdate({_id: user._id}, {$set: editableDelta}, {new: true}).exec();

    if (!newResume) {
      return newUser;
    }

    await newUser.attach('resume', {path: newResume.path});
    return newUser.save();
  }

  /**
   * Sets the given account to confirmed.
   * @param accountId The ID associated with the account.
   */
  async confirmAccountEmail(accountId: string) {
    return this.AccountModel
      .findOneAndUpdate({_id: accountId}, {
        confirmed: true,
      })
      .exec();
  }

  /**
   * RSVPs a user that was extended an invitation.
   * @param user The user who is RSVPing.
   * @param accept Whether to accept the invitation.
   * @param acceptBus Whether to accept the bussing option.
   */
  async RSVPUser(user: UserDocument, accept: boolean, acceptBus: boolean = false) {
    if (user.status !== UserStatus.Unconfirmed) {
      throw new Error(ErrorMessage.PERMISSION_ERROR());
    }

    user.status = accept ? UserStatus.Confirmed : UserStatus.Declined;
    user.bussing = user.availableBus && acceptBus;
    return user.save();
  }

  /**
   *
   * @param account The account for which to reset.
   * @param expires Optionally, the time at which the reset expires.
   */
  async createAccountReset(account: AccountDocument, expires?: Date) {
    if (!expires) {
      // By default give the user one day to reset
      expires = moment().add(1, 'days').toDate();
    }

    const resetString = generate({
      length: 16,
      numbers: true,
    }).toUpperCase();

    return this.AccountResetModel
      .create({
        account,
        resetString,
        expires,
        valid: true,
      } as AccountPasswordReset);
  }
}
