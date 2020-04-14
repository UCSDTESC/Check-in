import { ResumesController } from '../../../api/controllers/admin/ResumesController';
import TestDatabaseConnection from '../../TestDatabaseConnection';
import { Container } from 'typedi';
import { generateFakeAdminDocument, generateFakeEventDocument, generateFakeUser, generateFakeUserDocument, generateFakeAccountDocument, generateFakeDownloadDocument } from '../../fake';
import { ErrorMessage } from '../../../utils/Errors';
import { UserModel, UserDocument } from '@Models/User';
import CSVService from '@Services/CSVService';
import SponsorService from '@Services/SponsorService';
import { Response } from 'express';
import { TESCUser } from '@Shared/ModelTypes';
import {ObjectID} from 'bson';

describe('ResumesController', () => {
  const dbConnection = new TestDatabaseConnection();
  const csvService = Container.get(CSVService);
  const sponsorService = Container.get(SponsorService);

  const userModel = Container.get<UserModel>('UserModel');

  const resumesController = new ResumesController(csvService, sponsorService);

  beforeAll(async () => await dbConnection.connect());

  afterEach(async () => await dbConnection.clearDatabase());

  afterAll(async () => await dbConnection.closeDatabase());

  describe('downloadResumes', () => {
    const admin = generateFakeAdminDocument();

    beforeEach(async () => {
      await admin.save()
    })

    describe('for no selected user', () => {
      test('throws error', async () => {
        try {
          await resumesController.downloadResumes(admin, {
            applicants: []
          }, {} as Response)
        } catch(e) {
          expect(e).toEqual(new Error(ErrorMessage.NO_USERS_SELECTED()))
        }
      })
    });

    describe('for selected users', () => {
      const users = Array<TESCUser>(4);
      const event = generateFakeEventDocument();

      beforeEach(async () => {
        for (let i = 0; i < users.length; i++) {
          const account = generateFakeAccountDocument({
            email: `fake-user-${i}@ucsd.edu`
          });

          const user = await generateFakeUserDocument({
            account,
            event
          }).save();

          users[i] = user;
        }
      });

      test('returns csv string', async () => {
        const res = await resumesController.downloadResumes(admin, {
          applicants: users.map<string>(u => u._id)
        }, {
          setHeader: (a, b) => null,
          send: a => a
        } as Response);

        // TODO: csv validation
        expect(res).not.toBeNull();
      });
    });
  });


  describe('pollDownload', () => {
    describe('for non existing download', () => {
      test('throws error', async () => {
        try {
          await resumesController.pollDownload(new ObjectID().toHexString());
        } catch(e) {
          expect(e).toEqual(new Error(ErrorMessage.RESUME_ZIPPING_ERROR()));
        }
      })
    }) 

    describe('for deleted download', () => {
      const fakeDownload = generateFakeDownloadDocument({
        deleted: true
      });

      beforeEach(async () => {
        await fakeDownload.save();
      });

      test('throws error', async () => {
        try {
          await resumesController.pollDownload(fakeDownload._id);
        } catch(e) {
          expect(e).toEqual(new Error(ErrorMessage.RESUME_ZIPPING_ERROR()));
        }
      });
    });

    describe('for valid download', () => {
      const fakeDownload = generateFakeDownloadDocument();

      beforeEach(async () => {
        await fakeDownload.save()
      });

      test('returns document', async () => {
        const doc = await resumesController.pollDownload(fakeDownload._id);

        expect(doc._id).not.toBeNull();
        expect(doc._id).toEqual(fakeDownload._id);
      })
    })
  })
});
