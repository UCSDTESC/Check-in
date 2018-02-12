import React from 'react';
import PropTypes from 'prop-types';

export default class Header extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired
  };

  render() {
    let {name, logo} = this.props;

    if (!name || !logo) {
      return (<div></div>);
    }

    return (
      <div className="container sd-form__header">
        <div className="row">
          <div className="col-12 col-md-2 text-center">
            <img className="sd-form__header-logo" src={logo} />
          </div>
          <div className="col-12 col-md-10 text-left align-self-center">
            <div className="sd-form__header-text">Register for {name}</div>
          </div>
        </div>
      </div>
    );
  }
};
