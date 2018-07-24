import React from 'react';
import PropTypes from 'prop-types';

class SubmittedSection extends React.Component {
  static propTypes = {
    event: PropTypes.object.isRequired
  };

  render() {
    let {event} = this.props;

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12 text-center">
            <h3>You have successfully applied for {event.name} </h3>
            <h5>Please check your email for confirmation</h5>
            <a href={event.homepage} className="rounded-button sd-form__home">
              Return to {event.name}
            </a>
          </div>
        </div>
      </div>
    );
  }
};

export default SubmittedSection;
