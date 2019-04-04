import React from 'react';

import StyledSelect from './StyledSelect';

import {loadSponsors} from '~/data/Api';

import AdminSelect from './AdminSelect';

export default class SponsorSelect extends AdminSelect {
  componentDidMount() {
      loadSponsors()
      .then(sponsors => this.setState({
        // Map them into the required react-select format
        admins: sponsors
        .map(sponsor => ({
          value: sponsor._id,
          label: sponsor.username,
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
        placeholder="Add Sponsor..."
      />
    );
  }
}
