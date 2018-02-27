import React from 'react';
import PropTypes from 'prop-types';

import NavHeader from '~/components/NavHeader';

export default class UserLayout extends React.Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  };

  render() {
    return (
      <div className="page">
        <NavHeader />
        {this.props.children}
      </div>
    );
  }
};
