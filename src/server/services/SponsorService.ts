import { AdminModel } from '@Models/admin';
import { Role } from '@Shared/Roles';
import { Service, Inject } from 'typedi';

@Service()
export default class SponsorService {
  @Inject('AdminModel')
  private AdminModel: AdminModel;

  /**
   * Get a list of all sponsors.
   */
  async getAllSponsors() {
    return await this.AdminModel.find({role: Role.ROLE_SPONSOR}).exec();
  }
}
