import { UserModel } from "@Models/User";
import { EventModel, EventDocument } from "@Models/Event";
import { EventStatistics } from "@Shared/api/Responses";
import { Container, Service, Inject } from "typedi";

import { DatabaseError, ErrorMessage } from "../utils/Errors";
import { getResumeConditions } from "../utils/Resumes";

@Service()
export default class StatisticsService {
  @Inject("EventModel")
  private EventModel: EventModel;

  @Inject("UserModel")
  private UserModel: UserModel;

  /**
   * Aggregate a list of statistics about user count and diversity for a given
   * event.
   * @param event The event to gather statistics for.
   */
  getEventStatistics(event: EventDocument): Promise<EventStatistics> {
    return Promise.all([
      this.UserModel.countDocuments({ event: event }),
      this.UserModel.find({
        event: event._id
      })
        .distinct("university")
        .exec(),
      this.UserModel.aggregate([
        {
          $match: { event: event._id }
        },
        {
          $group: { _id: "$gender", count: { $sum: 1 } }
        }
      ]).exec(),
      this.UserModel.countDocuments({ event: event, checkedIn: true }),
      this.UserModel.aggregate([
        {
          $match: { event: event._id }
        },
        {
          $group: { _id: "$status", count: { $sum: 1 } }
        }
      ]).exec(),
      this.UserModel.countDocuments(getResumeConditions(event)),
      this.UserModel.aggregate([
        {
          $match: { event: event._id }
        },
        {
          $group: { _id: { date: { $dateToString: { format: "%m-%d", date: "$createdAt" } } }, count: { $sum: 1 }}
        },
        {
          $sort: { "_id.date": 1 }
        }
      ])
    ])
      .catch(err => {
        throw new DatabaseError(ErrorMessage.DATABASE_ERROR());
      })
      .then(values => {
        const genders = values[2].reduce((ret, gender) => {
          ret[gender._id] = gender.count;
          return ret;
        }, {});

        const status = values[4].reduce((ret, status) => {
          ret[status._id] = status.count;
          return ret;
        }, {});

        // Create cumulative applicant count each day
        let csum = 0;
        const appsOverTime = values[6].reduce((ret, day) => {
          csum += day.count;
          ret[day._id.date] = csum;

          return ret;
        }, {});

        return {
          count: values[0],
          universities: values[1].length,
          genders,
          checkedIn: values[3],
          status,
          resumes: values[5],
          appsOverTime
        } as EventStatistics;
      });
  }
}
