import React from 'react';
import {Link} from 'react-router-dom';

import * as Api from '~/data/Api';

import About from './components/About';
import Featurette from './components/Featurette';
import NavHeader from '~/components/NavHeader';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div className="home-page">
    	<NavHeader />
    	<Featurette />
      <div className="home-page__contents">
        <About />
      </div>
    </div>);
  }
}
