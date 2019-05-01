import { AdminModel, AdminDocument } from '@Models/admin';
import { Admin } from '@Shared/ModelTypes';
import { RegisterAdminRequest } from '@Shared/api/Requests';
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
    return this.AdminModel
      .find();
  }

  /**
   * Get an admin by a given ID.
   * @param adminId The object ID of the admin.
   */
  async getAdminById(adminId: string) {
    return this.AdminModel
      .findById(adminId)
      .exec();
  }

  /**
   * Registers a new admin in the database.
   * @param request The request with the new admin information.
   */
  async registerAdmin(request: RegisterAdminRequest) {
    return this.AdminModel
      .create({
        ...request,
      } as AdminDocument);
  }

  /**
   * Deletes an admin by a given ID.
   * @param adminId The object ID of the admin.
   */
  async deleteAdmin(adminId: string) {
    return this.AdminModel
      .deleteOne({_id: adminId})
      .exec();
  }
}
