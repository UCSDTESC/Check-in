import {Role} from '@Shared/Roles';
import AdminService from '../AdminService';
import {Container} from 'typedi';
import mockingoose from 'mockingoose';
import {RegisterModel as RegisterAdminModel} from '../../models/Admin';


describe('AdminService', () => {
  const adminModel = mockingoose(Container.get('AdminModel'));
  const adminService = Container.get(AdminService);
  const _adminDocument = {
    username: 'tesc-test-admin',
    role: Role.ROLE_ADMIN,
    password: 'password',
    checkin: true,
    lastAccessed: new Date(),
    deleted: false,
  }

  beforeEach(() => {
    adminModel.toReturn(_adminDocument, 'findOne');
  })

  test('getAdminById', async() => {
    let res = (await adminService.getAdminById('123')).toJSON();

    expect(res.username).toEqual(_adminDocument.username);
    expect(res.password).toEqual(_adminDocument.password);
    expect(res.role).toEqual(_adminDocument.role);
  })
});