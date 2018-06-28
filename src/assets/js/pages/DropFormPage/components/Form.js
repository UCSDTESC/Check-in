import PropTypes from 'prop-types';
import React from 'react';
import {Field, reduxForm} from 'redux-form';

import {Event as EventPropTypes} from '~/proptypes';

export default class Form extends React.Component {
  static propTypes = {
    event: PropTypes.shape(
      EventPropTypes
    ).isRequired
  };

  render() {
    let {event} = this.props;
    return (
      <div>

      </div>
    );
  }
}
