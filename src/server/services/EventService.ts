import { EventModel } from '@Models/event';
import { Model } from 'mongoose';
import { Service } from 'typedi';

@Service()
export default class EventService {
  constructor(
    private EventModel: EventModel
  ) {}

  async getEventByAlias(eventAlias: string) {
    return await this.EventModel.findOne({ alias: eventAlias });
  }
}
