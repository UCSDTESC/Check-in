import PropTypes from 'prop-types';
import React from 'react';

import {Admin as AdminPropTypes} from '~/proptypes';

export default class EventList extends React.Component {
  static propTypes = {
    organisers: PropTypes.arrayOf(PropTypes.shape(
      AdminPropTypes
    ).isRequired).isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    let {organisers} = this.props;

    return (
      <div className="organiser-list">
        <h2>Organisers</h2>
        <ul className="list-group">
          {organisers.map(organiser =>
            <li className="list-group-item organiser-list__username"
              key={organiser.username}>
              {organiser.username}
            </li>
          )}
        </ul>
      </div>
    );
  }
}
