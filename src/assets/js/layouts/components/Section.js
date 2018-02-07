import React from 'react';
import PropTypes from 'prop-types';

export default class Section extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired
  };

  render() {
    let {name, children} = this.props;

    return (<div className="admin-sidebar__section">
      {name && <div className="admin-sidebar__section-title text-uppercase">
        {name}
      </div>}
      {children}
    </div>);
  }
};
