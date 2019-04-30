import { Admin } from '@Shared/ModelTypes';

import StyledSelect from './StyledSelect';

// Has to match React-Select style
// TODO: Abstract out select type to match Admin
export interface AdminSelectType {
  value: string;
  label: string;
}

interface AdminSelectProps {
  onChange?: (value: AdminSelectType, action: any) => void;
  exclude: Admin[];
  value: AdminSelectType;
}

interface AdminSelectState {
  admins: AdminSelectType[];
}

export default class AdminSelect extends StyledSelect<AdminSelectProps, AdminSelectState> {
  state: Readonly<AdminSelectState> = {
    admins: [],
  };
}
