import PropTypes from 'prop-types';
import React from 'react';

import {Admin as AdminPropTypes} from '~/proptypes';

export default class SponsorList extends React.Component {
  static propTypes = {
    sponsors: PropTypes.arrayOf(PropTypes.shape(
      AdminPropTypes
    ).isRequired).isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    let {sponsors} = this.props;

    return (
      <div className="sponsor-list">
        <h2>Sponsors</h2>
        <ul className="list-group">
          {sponsors.map(sponsor => (
            <li className="list-group-item sponsor-list__username"
              key={sponsor.username}>
              {sponsor.username}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
