import PropTypes from 'prop-types';
import React from 'react';
import {Button} from 'reactstrap';
import {Link} from 'react-router-dom';
import FontAwesome from 'react-fontawesome';

import {Event as EventPropTypes} from '~/proptypes';

export default class EventList extends React.Component {
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.shape(
      EventPropTypes
    ).isRequired).isRequired
  };

  constructor(props) {
    super(props);
  }
  render() {
    let {events} = this.props;

    return (
      <div className="event-list">
        <h2>Your Events</h2>
        <div className="row">
          {events.map((event) =>
          <div className="col-md-2">
            <div className="card">
              <img className="card__image card-img-top" src={event.logo} alt={event.name} />
              <div className="card-body">
                <h5 className="card-title">
                  <Link to={"/admin/events/" + event._id}>{event.name}</Link>
                </h5>
                <p className="card-text">
                  A useful statistic
                </p>
              </div>
            </div>
          </div>)}
        </div>
      </div>
    );
  }
}
