import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

export default class UserEvents extends React.Component {
  static propTypes = {
    events: PropTypes.array.isRequired,
  };

  render() {
    let {events} = this.props;

    return (<div className="about">
      <div className="container">
        <div className="row">

          <div className="col-md-12 text center">
            <h1>Your Events</h1>
          </div>

          {events.map(event => (
            <div key={event._id} className="col-12">
              <Link to={`/user/${event.alias}`}>
                <div className="card mb-4 box-shadow container">
                  <div className="row">
                    <div className="col-4">
                      <img src={event.logo.url} className="card-img-top" />
                    </div>
                    <div className="col-8 d-flex align-items-center">
                      <h4 className="mb-0">{event.name}</h4>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>);
  }
};
