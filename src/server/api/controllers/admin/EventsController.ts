import Uploads from '@Config/Uploads';
import { AdminDocument } from '@Models/Admin';
import { EventDocument } from '@Models/Event';
import AdminService from '@Services/AdminService';
import EventService from '@Services/EventService';
import SponsorService from '@Services/SponsorService';
import UserService from '@Services/UserService';
import { TESCEvent, Admin, TESCUser } from '@Shared/ModelTypes';
import { Role, hasRankEqual, hasRankAtLeast } from '@Shared/Roles';
import {
  RegisterEventRequest, UpdateEventOptionsRequest, AddSponsorRequest, AddOrganiserRequest,
  CheckinUserRequest
} from '@Shared/api/Requests';
import { EventsWithStatisticsResponse, SuccessResponse } from '@Shared/api/Responses';
import {
  Get, JsonController, UseBefore, Param, QueryParam, Post, UploadedFile,
  BodyParam, Put, Body, BadRequestError
} from 'routing-controllers';
import { ErrorMessage } from 'utils/Errors';

import { SelectedEventID } from '../..//decorators/SelectedEventID';
import { ValidateEventID } from '../..//middleware/ValidateEventID';
import { AuthorisedAdmin } from '../../decorators/AuthorisedAdmin';
import { AdminAuthorisation } from '../../middleware/AdminAuthorisation';
import { RoleAuth } from '../../middleware/RoleAuth';

@JsonController('/events')
@UseBefore(AdminAuthorisation)
export class EventsController {
  constructor(
    private AdminService: AdminService,
    private EventService: EventService,
    private SponsorService: SponsorService,
    private UserService: UserService,
  ) { }

  @Get('/')
  @UseBefore(RoleAuth(Role.ROLE_SPONSOR))
  async getEvents(@AuthorisedAdmin() admin: Admin) {
    let events: EventDocument[];
    if (hasRankEqual(admin, Role.ROLE_SPONSOR)) {
      events = await this.EventService.getEventsBySponsor(admin);
    } else if (hasRankAtLeast(admin, Role.ROLE_DEVELOPER)) {
      events = await this.EventService.getAllPopulatedEvents();
    } else {
      events = await this.EventService.getEventsByOrganiser(admin);
    }

    const eventIDs = events.map(event => event._id.toHexString());
    let userCounts = await this.EventService.getAllUserCounts();
    // Filter UserCounts by events
    userCounts = userCounts.filter(count => eventIDs.includes(count._id));

    return {
      events,
      userCounts,
    };
  }

  @Post('/')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  async createNewEvent(@UploadedFile('logo', { options: Uploads }) logo: Express.Multer.File,
    @BodyParam('event') event: RegisterEventRequest, @AuthorisedAdmin() admin: AdminDocument) {
    let newEvent = await this.EventService.createNewEvent(event, logo.path);

    if (hasRankEqual(admin, Role.ROLE_ADMIN)) {
      newEvent = await this.EventService.addOrganiserToEvent(newEvent, admin);
    }
    return newEvent;
  }

  @Put('/')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  async updateEventOptions(@Body() body: UpdateEventOptionsRequest) {
    const event = await this.EventService.getEventByAlias(body.alias);
    if (!event) {
      throw new BadRequestError(ErrorMessage.NO_ALIAS_EXISTS(body.alias));
    }

    await this.EventService.updateEventOptions(event, body.options);

    return SuccessResponse.Positive;
  }

  @Post('/:eventId/sponsors')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  @UseBefore(ValidateEventID)
  async addSponsor(@SelectedEventID() event: EventDocument, @Body() body: AddSponsorRequest) {
    const sponsor = await this.AdminService.getAdminById(body.sponsorId);
    await this.EventService.addSponsorToEvent(event, sponsor);

    return SuccessResponse.Positive;
  }

  @Post('/:eventId/organisers')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  @UseBefore(ValidateEventID)
  async addOrganiser(@SelectedEventID() event: EventDocument, @Body() body: AddOrganiserRequest) {
    const organiser = await this.AdminService.getAdminById(body.organiserId);
    await this.EventService.addOrganiserToEvent(event, organiser);

    return SuccessResponse.Positive;
  }

  @Get('/:eventId/users')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  @UseBefore(ValidateEventID)
  async get(@AuthorisedAdmin() admin: Admin, @SelectedEventID() event: EventDocument): Promise<TESCUser[]> {
    let users: TESCUser[];
    const isOrganiser = await this.EventService.isAdminOrganiser(event.alias, admin);
    const isSponsor = await this.EventService.isAdminSponsor(event.alias, admin);
    if (isOrganiser) {
      users = await this.UserService.getAllUsersByEvent(event);
    } else if (isSponsor) {
      users = await this.SponsorService.getSponsorApplicantsByEvent(event);
    } else {
      throw new BadRequestError(ErrorMessage.PERMISSION_ERROR());
    }

    return users;
  }

  @Get('/:eventId/sponsor-users')
  @UseBefore(RoleAuth(Role.ROLE_SPONSOR))
  @UseBefore(ValidateEventID)
  async getSponsorUsers(@AuthorisedAdmin() admin: Admin, @SelectedEventID() event: EventDocument): Promise<TESCUser[]> {
    const isOrganiser = await this.EventService.isAdminOrganiser(event.alias, admin);
    const isSponsor = await this.EventService.isAdminSponsor(event.alias, admin);
    if (isSponsor || isOrganiser) {
      return await this.SponsorService.getSponsorApplicantsByEvent(event);
    }

    throw new BadRequestError(ErrorMessage.PERMISSION_ERROR());
  }

  @Post('/:eventId/checkin')
  @UseBefore(RoleAuth(Role.ROLE_ADMIN))
  @UseBefore(ValidateEventID)
  async checkinUser(@AuthorisedAdmin() admin: Admin, @SelectedEventID() event: EventDocument,
    @Body() request: CheckinUserRequest): Promise<SuccessResponse> {
    const isOrganiser = await this.EventService.isAdminOrganiser(event.alias, admin);
    if (!isOrganiser) {
      throw new BadRequestError(ErrorMessage.PERMISSION_ERROR());
    }

    await this.UserService.checkinUserById(request.id);
    return SuccessResponse.Positive;
  }
}
