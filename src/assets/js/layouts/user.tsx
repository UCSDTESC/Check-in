import React from 'react';
import PropTypes from 'prop-types';

export default class UserLayout extends React.Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="page">
        {this.props.children}
      </div>
    );
  }
}
