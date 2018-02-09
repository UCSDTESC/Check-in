import React from 'react';

import Hero from '~/components/Hero';

export default class Featurette extends React.Component {
  render() {
    return (<div className="featurette">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-md-offset-4">
            <h2>
              Welcome to the SDHacks Check-In Page.
            </h2>
          </div>
        </div>
      </div>
    </div>);
  }
};