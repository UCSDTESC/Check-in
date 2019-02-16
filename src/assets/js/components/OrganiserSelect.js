import React from 'react';
import PropTypes from 'prop-types';

import StyledSelect from './StyledSelect';

import {loadAllAdmins} from '~/data/Api';

import {Admin as AdminPropTypes} from '~/proptypes';

import {Roles, getRole} from '~/static/Roles';

export default class OrganiserSelect extends StyledSelect {
  static propTypes = {
    onChange: PropTypes.func,
    exclude: PropTypes.arrayOf(PropTypes.shape(
      AdminPropTypes
    ).isRequired).isRequired,
    value: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      admins: []
    };
  }

  componentDidMount() {
    loadAllAdmins()
      .catch(console.err)
      .then(admins => admins.filter(admin => getRole(admin.role) ===
        getRole(Roles.ROLE_ADMIN)))
      .then(admins => this.setState({
        // Map them into the required react-select format
        admins: admins
          .map(admin => ({
            value: admin._id,
            label: admin.username
          }))
      }));
  }

  render() {
    let {admins} = this.state;
    let {onChange, value, exclude} = this.props;

    let excludeIds = exclude.map(sponsor => sponsor._id);
    return (
      <StyledSelect
        isSearchable
        isClearable
        options={admins.filter(option =>
            excludeIds.indexOf(option.value) === -1)}
        isLoading={admins.length === 0}
        onChange={onChange}
        value={value}
        placeholder="Add Organiser...">
      </StyledSelect>
    );
  }
};
