import { SponsorsController } from '../../../api/controllers/admin/SponsorsController';
import TestDatabaseConnection from '../../TestDatabaseConnection';
import { Container } from 'typedi';
import { generateFakeAdminDocument, generateFakeEventDocument, generateFakeUser, generateFakeUserDocument, generateFakeAccountDocument } from '../../fake';
import { ErrorMessage } from '../../../utils/Errors';
import { UserModel, UserDocument } from '@Models/User';
import AdminService from '@Services/AdminService';
import SponsorService from '@Services/SponsorService';
import { Role } from '@Shared/Roles';


describe('SponsorsController', () => {
  const dbConnection = new TestDatabaseConnection();
  const sponsorService = Container.get(SponsorService);
  const adminService = Container.get(AdminService);

  const userModel = Container.get<UserModel>('UserModel');

  const sponsorsController = new SponsorsController(adminService, sponsorService);

  beforeAll(async () => await dbConnection.connect());

  afterEach(async () => await dbConnection.clearDatabase());

  afterAll(async () => await dbConnection.closeDatabase());

  describe('getSponsors', () => {

    const admin = generateFakeAdminDocument();
    const event = generateFakeEventDocument({
      organisers: [admin]
    });
    
    beforeEach(async () => {
      await admin.save();
      await event.save();

      for (let i = 0; i < 4; i++) {
        await generateFakeAdminDocument({
          role: Role.ROLE_SPONSOR,
          username: `fake-admin-${i}`
        }).save();
      }
    });

    test('returns all sponsors irrespective of event', async () => {
      const res = await sponsorsController.getSponsors();
      expect(
        res.map<string>(r => r.username)
      ).toEqual(
        [...Array(4)].map((r, i) => `fake-admin-${i}`)
      );
    })
  });

});
