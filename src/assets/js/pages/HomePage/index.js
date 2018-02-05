import React from 'react';
import {Link} from 'react-router-dom';

import * as Api from '~/data/Api';

import Featurette from './components/Featurette';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<div className="home-page">
      <Featurette />
    </div>);
  }
}
