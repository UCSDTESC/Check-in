import { RegisterModel as Account } from './Account';
import { RegisterModel as Admin } from './Admin';
import { RegisterModel as Download } from './Download';
import { RegisterModel as Event } from './Event';
import { RegisterModel as Question } from './Question';
import { RegisterModel as User } from './User';

export const RegisterModels = () => {
  Account();
  Admin();
  Download();
  Event();
  Question();
  User();
};
