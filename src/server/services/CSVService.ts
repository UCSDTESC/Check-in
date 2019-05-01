import { Logger } from '@Config/Logging';
import { UserModel, UserDocument } from '@Models/User';
import { EventModel } from '@Models/event';
import { Response } from 'express';
import * as csv from 'fast-csv';
import { Parser } from 'json2csv';
import { Service, Inject } from 'typedi';

@Service()
export default class CSVService {
  /**
   * Convert a JSON array into a CSV file ready to sent as an attachment.
   * @param jsonContents The desired contents of the CSV file.
   */
  parseJSONToCSV(jsonContents: any) {
    const parser = new Parser();
    return parser.parse(jsonContents);
  }

  /**
   * Alter the headers on a response object ready for sending a CSV file.
   * @param response The response object to alter the headers on.
   * @param filename The download name as it will appear to the user.
   */
  setJSONReturnHeaders(response: Response, filename: string = 'data.csv') {
    response.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    response.setHeader('Content-Type', 'text/csv');
    return response;
  }

  /**
   * Writes the users CSV file to the resume zip file.
   * @param users The list of users to write to the archive.
   * @param archive The archiver zip to append.
   * @param callback The callback to call after finishing the operation.
   * @param fileName The name of the CSV file that is added to the archive.
   */
  writeUserResumeData(users: UserDocument[], archive: any, callback: () => void,
    fileName: string = 'applicants.csv') {
    const csvStream = csv.createWriteStream({headers: true});

    for (const user of users) {
      csvStream.write({
        firstName: user.firstName,
        lastName: user.lastName,
        schoolYear: user.year,
        email: user.account.email,
        university: user.university,
        gender: user.gender,
        status: user.status,
        website: user.website,
        github: user.github,
        resumeFile: user.resume.name,
        resumeLink: user.resume.url,
      });
    }

    archive.append(csvStream, {name: fileName});
    callback();

    csvStream.end();
  }
}
