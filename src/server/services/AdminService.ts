import { AdminModel } from '@Models/admin';
import { Admin } from '@Shared/Types';
import { JWTAdminAuthToken } from '@Shared/api/Responses';
import { Service, Inject } from 'typedi';

@Service()
export default class AdminService {
  @Inject('AdminModel')
  private AdminModel: AdminModel;

  /**
   * Create a JWT token for a given admin account.
   * @param admin The admin account to fetch the JWT for.
   */
  getJwtAdmin(admin: Admin): JWTAdminAuthToken {
    return {
      username: admin.username,
      _id: admin._id,
      role: admin.role,
      checkin: admin.checkin,
    };
  }

  /**
   * Returns all the admins in the database.
   */
  async getAllAdmins() {
    return this.AdminModel.find();
  }

  /**
   * Get an admin by the given ID.
   * @param adminId The object ID of the admin.
   */
  async getAdminById(adminId: string) {
    return this.AdminModel.findById(adminId).exec();
  }
}
