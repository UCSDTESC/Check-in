import { UserModel } from '@Models/User';
import { EventModel } from '@Models/event';
import { Response } from 'express';
import { Parser } from 'json2csv';
import { Service, Inject } from 'typedi';

@Service()
export class CSVService {
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
}
