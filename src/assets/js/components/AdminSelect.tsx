import StyledSelect from './StyledSelect';
import {Admin} from '~/static/types';

interface AdminSelectProps {
  onChange?: (value: any, action: any) => void;
  exclude: Admin[];
  value: Admin;
}

// Match the React-Select style
interface AdminSelectState {
  admins: Array<{
    value: string;
    label: string;
  }>;
}

export default class AdminSelect extends StyledSelect<AdminSelectProps, AdminSelectState> {

};