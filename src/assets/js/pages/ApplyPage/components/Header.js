import React from 'react';

export default class Header extends React.Component {
  render() {
    return (
      <div className="container sd-form__header">
        <div className="row no-gutters">
          <div className="col-2 col-md-12">
            <img className="sd-form__logo"
              src="/assets/img/vectors/logo.svg" />
          </div>
          <div className="col-10 col-md-12 align-self-center">
            <div className="sd-form__header--text">Apply for SD Hacks 2017</div>
          </div>
        </div>
      </div>
    );
  }
};
