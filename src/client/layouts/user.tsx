import React from 'react';

export default class UserLayout extends React.Component {
  render() {
    return (
      <div className="page">
        {this.props.children}
      </div>
    );
  }
}
