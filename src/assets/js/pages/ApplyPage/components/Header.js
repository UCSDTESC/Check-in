import React from 'react';
import Hero from '~/components/Hero'
export default class Header extends React.Component {
  render() {
    return (
          <div className="container sd-form__header">
            <div className="row no-gutters">
              <div className="col-2 col-md-12">
                <img className="sd-form__logo"
                  src="/img/logo-tesc-white.png" />
              </div>
              <div className="col-10 col-md-12 align-self-center">
                <div className="sd-form__header--text">Register for Event</div>
              </div>
            </div>
          </div>
    );
  }
};
