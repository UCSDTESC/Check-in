import PropTypes from 'prop-types';
import React from 'react';

import {Event as EventPropType} from '~/proptypes';

export default class ActionsTab extends React.Component {
  static propTypes = {
    event: PropTypes.shape(EventPropType).isRequired
  };

  render() {
    return (
      <div className="event-tab">
        <div className="row">

        </div>
      </div>
    );
  }
}
