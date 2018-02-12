import React from 'react';

import Hero from '~/components/Hero';

import About from './components/About';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="page home-page">
        <Hero />
        <div className="home-page__contents">
          <About />
        </div>
      </div>);
  }
}
