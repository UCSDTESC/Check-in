import { Admin } from '@Shared/ModelTypes';
import { Role, getRoleRank } from '@Shared/Roles';
import React from 'react';
import { loadAllAdmins } from '~/data/AdminApi';

import AdminSelect from './AdminSelect';
import StyledSelect from './StyledSelect';

export default class OrganiserSelect extends AdminSelect {
  componentDidMount() {
    loadAllAdmins()
      .then(admins => admins.filter(admin => getRoleRank(admin.role) ===
        getRoleRank(Role.ROLE_ADMIN)))
      .then(admins => this.setState({
        // Map them into the required react-select format
        admins: admins
          .map((admin: Admin) => ({
            value: admin._id,
            label: admin.username,
          })),
      }))
      .catch(console.error);
  }

  render() {
    const { admins } = this.state;
    const { onChange, value, exclude } = this.props;

    const excludeIds: string[] = exclude.map(sponsor => sponsor._id);
    return (

      <StyledSelect
        isSearchable={true}
        isClearable={true}
        options={admins.filter(option => !excludeIds.includes(option.value))}
        isLoading={admins.length === 0}
        onChange={onChange}
        value={value}
        placeholder="Add Organiser..."
      />
    );
  }
}
