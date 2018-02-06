import React from 'react';
import {Link} from 'react-router-dom';

class SubmittedSection extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12 text-center">
            <h3>You have successfully applied for SD Hacks 2017!</h3>
            <h5>Please check your email for confirmation</h5>
            <a href="/" className="rounded-button sd-form__home">
              Home
            </a>
          </div>
        </div>
      </div>
    );
  }
};

export default SubmittedSection;
