import React from 'react';
import {Link} from 'react-router-dom';

import NavHeader from '~/components/NavHeader';

export default class Hero extends React.Component {
  render() {
    let {background, white} = this.props;
    let heroStyle = {};
    let heroClass = "hero";
    let headerClass = "hero__header";
    let loginClass = "hero__login";

    if (background) {
      heroStyle['backgroundImage'] = `url(${background})`;
      heroClass += " hero--expanded";
      headerClass += " hero__header--expanded";
      loginClass += " hero__login--inverse";
    }

    if (white) {
      heroClass += " hero--white";
      headerClass += " hero__header--expanded";
      loginClass += " hero__login--trasparent";
    }

    return (<div className={heroClass} style={heroStyle}>
      <NavHeader />
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <h1>Welcome to the TESC Check-In System</h1>
          </div>
        </div>
      </div>
    </div>);
  }
};