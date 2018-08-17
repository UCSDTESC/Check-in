import React from 'react';
import PropTypes from 'prop-types';
import {Field, Fields, reduxForm} from 'redux-form';

import {loadDropByAlias} from '~/data/Api';

import Loading from '~/components/Loading';

import NavHeader from '~/components/NavHeader';

class DropPage extends React.Component {

  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        dropAlias: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      event: null
    };
  }

  componentWillMount() {
    let {dropAlias} = this.props.match.params;
    loadDropByAlias(dropAlias)
      .then(e => {
        this.setState({event: e});
      });
  }


  render() {
    const {event} = this.state;
    const {dropAlias} = this.props.match.params;

    if (!event) {
      return (
        <div>
          <NavHeader />
          <Loading title={dropAlias} />
        </div>
      );
    }
    return (
      <div>
        <NavHeader />
        <div className="container">
          Redux Form Here
        </div>
      </div>
    );
  }
}
export default DropPage;
