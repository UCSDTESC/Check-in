import { EventModel } from '@Models/event';
import { getRoleRank, Role } from '@Shared/Roles';
import { Admin } from '@Shared/Types';
import { Service, Inject } from 'typedi';

@Service()
export default class EventService {
  @Inject('EventModel')
  private EventModel: EventModel;

  /**
   * Get an event by its associated alias.
   * @param eventAlias The alias associated with the event.
   */
  async getEventByAlias(eventAlias: string) {
    return await this.EventModel.findOne({ alias: eventAlias });
  }

  /**
   * Determines whether the given user has organiser privileges for the event.
   * Returns true if the user is a developer, false if the user is less than an
   * admin, otherwise checks against the list of organisers.
   * @param eventAlias The alias associated with the event.
   * @param organiser The user to check has organiser privileges.
   */
  async isAdminOrganiser(eventAlias: string, organiser: Admin) {
    if (getRoleRank(organiser.role) >= getRoleRank(Role.ROLE_DEVELOPER)) {
      return true;
    }

    if (getRoleRank(organiser.role) < getRoleRank(Role.ROLE_ADMIN)) {
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
    if (getRoleRank(sponsor.role) >= getRoleRank(Role.ROLE_DEVELOPER)) {
      return true;
    }

    if (getRoleRank(sponsor.role) === getRoleRank(Role.ROLE_ADMIN)) {
      return this.isAdminOrganiser(eventAlias, sponsor);
    }

    const event = await this.EventModel.findOne({alias: eventAlias});
    if (event === null) {
      return false;
    }

    return (event.sponsors.indexOf(sponsor) !== -1);
  }
}
