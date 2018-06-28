import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

export default class CurrentEvents extends React.Component {
  static propTypes = {
    events: PropTypes.array.isRequired,
  };

  render() {
    let {events} = this.props;

    return (
      <div className="container">
        <div className="event-list">
          <h2>Choose Event For Resume Drop</h2>
          <div className="row">
            {events.map((event) => (
              <div className="col-lg-2 col-md-6" key={event._id}>
                <div className="card">
                  <img className="card__image card-img-top event-list__image"
                    src={event.logo} alt={event.name} />
                  <div className="card-body">
                    <h2 className="card-text text-center">
                      {event.name}{' '}
                    </h2>
                    <Link to={'/drop/' + event.alias}>
                      Go To Form
                    </Link>
                  </div>
                </div>
              </div>)
            )}
          </div>
        </div>
      </div>
    );
  }
};
