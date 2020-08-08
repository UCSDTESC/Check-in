import React from 'react';
import NavHeader from '~/components/NavHeader';

class PublicLayout extends React.Component {
  render() {
    return (
      <>
        <NavHeader />
        {this.props.children}
      </>
    );
  }
}

export default PublicLayout;
