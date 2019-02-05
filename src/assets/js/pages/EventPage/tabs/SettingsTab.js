import PropTypes from 'prop-types';
import React from 'react';

import {updateOptions} from '~/data/Api';

import EventOptions from '../components/EventOptions';
import CustomQuestions from '../components/CustomQuestions';

import {Event as EventPropType} from '~/proptypes';

export default class ActionsTab extends React.Component {
  static propTypes = {
    event: PropTypes.shape(EventPropType).isRequired,
    addEventAlert: PropTypes.func.isRequired
  };

  /**
   * Handles the EventOptions callback for when options should be updated.
   * @param {Object} options The new options to send to the server.
   */
  onOptionsUpdate = (options) => {
    let {event, addEventAlert} = this.props;

    updateOptions(event.alias, options)
      .then(() => {
        addEventAlert(event.alias, 'Successfully updated options!', 'success',
          'Event Options');
      })
      .catch((err) => {
        addEventAlert(event.alias, err.message, 'danger', 'Event Options');
        console.error(err);
      });
  };

  render() {
    let {event} = this.props;

    return (
      <div className="event-tab">
        <div className="row">
          <div className="col-lg-5 col-md-5">
            <EventOptions options={event.options}
              onOptionsUpdate={this.onOptionsUpdate} />
          </div>
          <div className="col-lg-5 col-md-5 offset-md-2 offset-lg-1">
            <CustomQuestions options={event.options}
              onOptionsUpdate={this.onOptionsUpdate} />
          </div>
        </div>
      </div>
    );
  }
}
