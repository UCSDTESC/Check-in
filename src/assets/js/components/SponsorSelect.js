import React from 'react';
import PropTypes from 'prop-types';

import StyledSelect from './StyledSelect';

import {loadSponsors} from '~/data/Api';

import {Admin as AdminPropTypes} from '~/proptypes';

export default class SponsorSelect extends StyledSelect {
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
      sponsors: []
    };
  }

  componentDidMount() {
    loadSponsors()
      .catch(console.err)
      .then(sponsors => this.setState({
        // Map them into the required react-select format
        sponsors: sponsors
          .map(sponsor => ({
            value: sponsor._id,
            label: sponsor.username
          }))
      }));
  }

  render() {
    let {sponsors} = this.state;
    let {onChange, value, exclude} = this.props;

    let excludeIds = exclude.map(sponsor => sponsor._id);
    return (
      <StyledSelect
        isSearchable
        isClearable
        options={sponsors.filter(option =>
            excludeIds.indexOf(option.value) === -1)}
        isLoading={sponsors.length === 0}
        onChange={onChange}
        value={value}
        placeholder="Add Sponsor...">
      </StyledSelect>
    );
  }
};
