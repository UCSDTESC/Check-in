import React from 'react';

import Hero from '~/components/Hero';

export default class About extends React.Component {
  render() {
    return (<div className="about">
<<<<<<< Updated upstream
      <img className="about__logo" src="https://www.sdhacks.io/assets/img/vectors/logo.svg"/>
      This is the about section.
=======
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <div className="card mb-4 box-shadow">
              <img src="#" className="card-img-top" />
              <div className="card-body">
                <p className="card-text">
                  HackXR
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card mb-4 box-shadow">
              <img src="#" className="card-img-top" />
              <div className="card-body">
                <p className="card-text">
                  SDHacks
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card mb-4 box-shadow">
              <img src="#" className="card-img-top" />
              <div className="card-body">
                <p className="card-text">
                  HackXX
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
>>>>>>> Stashed changes
    </div>);
  }
};