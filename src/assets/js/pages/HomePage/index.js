import React from 'react';
import {Link} from 'react-router-dom';

import * as Api from '~/data/Api';

import About from './components/About';
import Hero from '~/components/Hero';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div className="page home-page">
    	<Hero />
      <div className="home-page__contents">
        <About />
      </div>
    </div>);
  }
}
