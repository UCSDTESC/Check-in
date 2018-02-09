import React from 'react';

import Hero from '~/components/Hero';

export default class About extends React.Component {
  render() {
    return (<div className="about">
      <img className="about__logo" src="https://www.sdhacks.io/assets/img/vectors/logo.svg"/>
      This is the about section.
    </div>);
  }
};