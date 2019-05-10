import { RegisterModel as Account } from './Account';
import { RegisterModel as AccountResetModel } from './AccountReset';
import { RegisterModel as Admin } from './Admin';
import { RegisterModel as Download } from './Download';
import { RegisterModel as Event } from './Event';
import { RegisterModel as Question } from './Question';
import { RegisterModel as User } from './User';

export const RegisterModels = () => {
  Account();
  AccountResetModel();
  Admin();
  Download();
  Event();
  Question();
  User();
};
