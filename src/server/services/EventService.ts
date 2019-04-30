import { QuestionModel, QuestionDocument } from '@Models/Question';
import { UserModel } from '@Models/User';
import { EventModel, EventSchema, EventDocument, PUBLIC_EVENT_FIELDS } from '@Models/event';
import { QuestionType } from '@Shared/Questions';
import { Role, hasRankAtLeast, hasRankEqual } from '@Shared/Roles';
import { Admin, TESCEvent, Question } from '@Shared/Types';
import { DocumentQuery, Query, Types } from 'mongoose';
import { Service, Inject } from 'typedi';
import { ErrorMessage } from 'utils/Errors';

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
    return this.getPopulatedEvents(true, this.EventModel.find({sponsors: sponsor}));
  }

  /**
   * Get all events where the given user is in the list of organisers.
   * @param organiser The admin in the organiser list for the events.
   */
  async getEventsByOrganiser(organiser: Admin): Promise<EventDocument[]> {
    return this.getPopulatedEvents(true, this.EventModel.find({organisers: organiser}));
  }

  /**
   * Get the event associated with the given alias with populated fields that are publicly accessible.
   * @param eventAlias The alias to query.
   */
  async getPublicPopulatedEventByAlias(eventAlias: string) {
    const query = this.EventModel.findOne({alias: eventAlias});
    return await this.getPopulatedEvents(false, query);
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

    const event = await this.EventModel.findOne({alias: eventAlias});
    if (event === null) {
      return false;
    }

    return (event.organisers.indexOf(organiser) !== -1);
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

    const event = await this.EventModel.findOne({alias: eventAlias});
    if (event === null) {
      return false;
    }

    return (event.sponsors.indexOf(sponsor) !== -1);
  }

  /**
   * Adds a custom question to a given event.
   * @param event The event for which to add the question.
   * @param question The question that should be added.
   * @param type The type of question that is being added.
   */
  async addQuestionToEvent(event: EventDocument, question: QuestionDocument, type: QuestionType) {
    const {customQuestions} = event;

    switch (type) {
    case QuestionType.QUESTION_LONG:
      customQuestions.longText.push(question);
      break;
    case QuestionType.QUESTION_SHORT:
      customQuestions.shortText.push(question);
      break;
    case QuestionType.QUESTION_CHECKBOX:
      customQuestions.checkBox.push(question);
      break;
    default:
      throw new Error(ErrorMessage.INVALID_QUESTION_TYPE());
    }

    return event.save();
  }
}
