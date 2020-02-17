import { Logger } from '@Config/Logging';
import { EventModel, EventSchema, EventDocument, PUBLIC_EVENT_FIELDS } from '@Models/Event';
import { QuestionModel, QuestionDocument } from '@Models/Question';
import { UserModel } from '@Models/User';
import { Admin, TESCEvent, Question, TESCEventOptions, TESCAccount, TESCUser } from '@Shared/ModelTypes';
import { QuestionType } from '@Shared/Questions';
import { Role, hasRankAtLeast, hasRankEqual } from '@Shared/Roles';
import { RegisterEventRequest } from '@Shared/api/Requests';
import { ObjectID } from 'bson';
import moment = require('moment');
import { DocumentQuery, Query, Types } from 'mongoose';
import { Service, Inject } from 'typedi';

import { ErrorMessage } from '../utils/Errors';

/**
 * Defines the result of a summation aggregate
 */
type SumAggregateResult = {
  _id: Types.ObjectId;
  count: number;
};

@Service()
export default class EventService {
  @Inject('EventModel')
  private EventModel: EventModel;

  @Inject('QuestionModel')
  private QuestionModel: QuestionModel;

  @Inject('UserModel')
  private UserModel: UserModel;

  /**
   * Create a new question in the database.
   * @param question The question to create in the database.
   */
  async createQuestion(question: Question) {
    return new this.QuestionModel(question).save();
  }

  /**
   * Updates an existing question.
   * @param question The new question document to write.
   */
  async updateQuestion(question: Question) {
    if (!question._id) {
      throw new Error(ErrorMessage.NO_QUESTION_EXISTS());
    }

    return this.QuestionModel.findByIdAndUpdate(question._id, question);
  }

  /**
   * Deletes an existing question.
   * @param question The question to delete.
   */
  async deleteQuestion(question: Question) {
    if (!question._id) {
      throw new Error(ErrorMessage.NO_QUESTION_EXISTS());
    }

    return this.QuestionModel.findByIdAndDelete(question._id);
  }

  /**
   * Get an event by its associated objectID.
   * @param eventId The object ID associated with the event.
   */
  async getEventById(eventId: string) {
    return await this.EventModel.findById(eventId);
  }

  /**
   * Get an event by its associated alias.
   * @param eventAlias The alias associated with the event.
   */
  async getEventByAlias(eventAlias: string) {
    return await this.EventModel.findOne({ alias: eventAlias });
  }

  /**
   * Get all public events, selecting only the public fields.
   */
  async getAllPublicEvents() {
    return await this.EventModel.find()
      .select(PUBLIC_EVENT_FIELDS.join(' '))
      .exec();
  }

  /**
   * Determines whether an account has already applied for a given event.
   * @param accountId The account to check for.
   * @param event The event for which to check for the user.
   */
  async accountHasApplied(account: TESCAccount, event: EventDocument) {
    const user = await this.UserModel
      .findOne({ event: event, account: account })
      .exec();

    return !!user;
  }

  /**
   * Gets the user counts for all events.
   */
  async getAllUserCounts(): Promise<Array<{
    _id: string;
    count: number;
  }>> {
    const result: SumAggregateResult[] = await this.UserModel.aggregate([{
      $group: {
        _id: '$event',
        count: {
          $sum: 1,
        },
      },
    }]).exec();
    return result.map(result => ({
      ...result,
      _id: result._id.toHexString(),
    }));
  }

  /**
   * Get all events where the given user is in the list of sponsors.
   * @param sponsor The admin in the sponsor list for the events.
   */
  async getEventsBySponsor(sponsor: Admin): Promise<EventDocument[]> {
    return this.getPopulatedEvents(true, this.EventModel.find({ sponsors: sponsor }));
  }

  /**
   * Get all events where the given user is in the list of organisers.
   * @param organiser The admin in the organiser list for the events.
   */
  async getEventsByOrganiser(organiser: Admin): Promise<EventDocument[]> {
    return this.getPopulatedEvents(true, this.EventModel.find({ organisers: organiser }));
  }

  /**
   * Get the event associated with the given alias with populated fields that are publicly accessible.
   * @param eventId The event ID to query.
   */
  async getPublicPopulatedEvents(eventId?: string) {
    if (eventId) {
      const query = this.EventModel.findOne({ _id: eventId });
      return await this.getPopulatedEvents(false, query);
    }
    return await this.getPopulatedEvents(false, this.EventModel.find());
  }

  /**
   * Get all events and populate all fields within each document.
   * @param populatePrivateFields Populate all fields that are not publicly accessible.
   */
  async getAllPopulatedEvents(populatePrivateFields: boolean = true) {
    return this.getPopulatedEvents(populatePrivateFields, this.EventModel.find());
  }

  /**
   * Get all events for the given query and populate all fields within each document.
   * @param populatePrivateFields Populate all fields that are not publicly accessible.
   * @param query The query stem for filtering certain events.
   */
  async getPopulatedEvents<R = EventDocument[]>(populatePrivateFields: boolean = true,
    query: DocumentQuery<R, EventDocument>): Promise<R> {
    query = query
      .populate('customQuestions.longText')
      .populate('customQuestions.shortText')
      .populate('customQuestions.checkBox');

    if (populatePrivateFields) {
      query = query
        .populate('organisers')
        .populate('sponsors');
    }

    return query.exec();
  }

  /**
   * Determines whether the given user has organiser privileges for the event.
   * Returns true if the user is a developer, false if the user is less than an
   * admin, otherwise checks against the list of organisers.
   * @param eventAlias The alias associated with the event.
   * @param organiser The user to check has organiser privileges.
   */
  async isAdminOrganiser(eventAlias: string, organiser: Admin) {
    if (hasRankAtLeast(organiser, Role.ROLE_DEVELOPER)) {
      return true;
    }

    if (!hasRankAtLeast(organiser, Role.ROLE_ADMIN)) {
      return false;
    }

    const event: EventDocument = await this.EventModel
      .findOne({ alias: eventAlias })
      .populate('organisers');
    if (event === null) {
      return false;
    }

    return (event.organisers.some(org => org._id.toHexString() === organiser._id.toHexString()));
  }

  /**
   * Determine whether the admin has sponsor privileges for a particular event.
   * @param eventAlias The alias associated with the event.
   * @param sponsor The admin account to check against.
   */
  async isAdminSponsor(eventAlias: string, sponsor: Admin) {
    if (hasRankAtLeast(sponsor, Role.ROLE_DEVELOPER)) {
      return true;
    }

    if (hasRankEqual(sponsor, Role.ROLE_ADMIN)) {
      return this.isAdminOrganiser(eventAlias, sponsor);
    }

    const event: EventDocument = await this.EventModel
      .findOne({ alias: eventAlias })
      .populate('sponsors');
    if (event === null) {
      return false;
    }

    return (event.sponsors.some(spo => spo._id.toHexString() === sponsor._id.toHexString()));
  }

  /**
   * Adds a custom question to a given event.
   * @param event The event for which to add the question.
   * @param question The question that should be added.
   * @param type The type of question that is being added.
   */
  async addQuestionToEvent(event: EventDocument, question: QuestionDocument, type: QuestionType) {
    const { customQuestions } = event;

    switch (type) {
      case QuestionType.QUESTION_LONG:
      case QuestionType.QUESTION_SHORT:
      case QuestionType.QUESTION_CHECKBOX:
        if (!customQuestions[type]) {
          customQuestions[type] = [];
        }
        customQuestions[type].push(question);
        break;
      default:
        throw new Error(ErrorMessage.INVALID_QUESTION_TYPE());
    }

    return event.save();
  }

  /**
   * Removes an existing custom question from a given event.
   * @param event The event from which to remove the question.
   * @param question The question object to delete.
   * @param type The type of the question that is being removed.
   */
  async removeQuestionFromEvent(event: EventDocument, question: Question, type: QuestionType) {
    const typeKey = `customQuestions.${type}`;
    return this.EventModel.findOneAndUpdate({ _id: event._id }, {
      $pull: {
        [typeKey]: question._id,
      },
    }).exec();
  }

  /**
   * Update the options for a given event.
   * @param event The event for which the options will be changed.
   * @param newOptions The new options for the given event.
   */
  async updateEventOptions(event: EventDocument, newOptions: TESCEventOptions) {
    event.options = newOptions;
    return event.save();
  }

  /**
   * Adds an admin to the sponsor list for a given event.
   * @param event The event for which the sponsor will be added.
   * @param sponsor The admin that should be added as a sponsor.
   */
  async addSponsorToEvent(event: EventDocument, sponsor: Admin) {
    event.sponsors.push(sponsor);
    return event.save();
  }

  /**
   * Adds an admin to the organiser list for a given event.
   * @param event The event for which the organiser will be added.
   * @param organiser The admin that should be added as a organiser.
   */
  async addOrganiserToEvent(event: EventDocument, organiser: Admin) {
    event.organisers.push(organiser);
    return event.save();
  }

  /**
   * Creates a new event with given attributes.
   * @param request The request with the new event parameters.
   * @param logoPath The file path of the logo to associate with the new event.
   */
  async createNewEvent(request: RegisterEventRequest, logoPath: string) {
    const newEvent = new this.EventModel({
      ...request,
    } as TESCEvent);

    try {
      await newEvent.attach('logo', { path: logoPath });
    } catch (err) {
      throw new Error(ErrorMessage.DATABASE_ERROR());
    }

    return newEvent.save();
  }

  /**
   * Edits an existing event with given attributes.
   * @param request The request with event parameters.
   * @param logoPath The file path of the logo to associate with the new event.
   */
  async editExistingEvent(id: string, request: Partial<RegisterEventRequest>, logoPath?: string) {
    const event = await this.EventModel.findByIdAndUpdate(id, request);
    if (logoPath) {
      try {
        await event.attach('logo', { path: logoPath });
      } catch (err) {
        throw new Error(ErrorMessage.DATABASE_ERROR());
      }
    }
    await event.save();
  }

  /**
   * Determines whether an event's registration is still publicly open.
   * @param event The event for which to check.
   */
  async isRegistrationOpen(event: EventDocument) {
    return (!moment(event.closeTime).isBefore());
  }
}
