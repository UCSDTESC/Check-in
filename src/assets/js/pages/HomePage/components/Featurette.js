import React from 'react';

import Hero from '~/components/Hero';

export default class Featurette extends React.Component {
  render() {
    return (<div className="featurette">
      <Hero white />
      <div className="container">
        <div className="row">
          <div className="col-md-6 d-flex flex-column justify-content-center">
            <h2 className="d-block text-center">Check-In</h2>
            <p className="d-block text-center">For TESC</p>
          </div>
          <div className="col-md-6 text-center">
            <img className="featurette__frog img-fluid" src="/img/frog_shadow.png" />
          </div>
        </div>
      </div>
    </div>);
  }
};