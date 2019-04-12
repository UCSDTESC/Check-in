import React from 'react';

import StyledSelect from './StyledSelect';

import {loadAllAdmins} from '~/data/Api';

import {Role, getRole} from '~/static/Roles';
import AdminSelect from './AdminSelect';
import { Admin } from '~/static/types';

export default class OrganiserSelect extends AdminSelect {
  componentDidMount() {
    loadAllAdmins()
      .then(admins => admins.filter(admin => getRole(admin.role) ===
        getRole(Role.ROLE_ADMIN)))
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
    const {admins} = this.state;
    const {onChange, value, exclude} = this.props;

    const excludeIds = exclude.map(sponsor => sponsor._id);
    return (

      <StyledSelect
        isSearchable={true}
        isClearable={true}
        options={admins.filter(option =>
            excludeIds.indexOf(option.value) === -1)}
        isLoading={admins.length === 0}
        onChange={onChange}
        value={value}
        placeholder="Add Organiser..."
      />
    );
  }
}