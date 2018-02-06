import React from 'react';
import PropTypes from 'prop-types';

import AutoSuggest from '~/components/AutoSuggest';

import {getSuggestions} from '~/static/Universities';

import fields from './Fields';

export default class UniversityField extends React.Component {
  static propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    className: PropTypes.string,
    placeholder: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  onUniversitySelected = (suggestion) => {
    let {input} = this.props;
    input.onChange(suggestion);
  }

  render() {
    let {input, className, placeholder, meta: {touched, error}} = this.props;
    let suggestClass = `${className} ${error && touched ?
      'sd-form__input--error' : ''}`;

    let inputProps = {
      ...input,
      placeholder,
      className: suggestClass
    };

    return (
      <div>
        <AutoSuggest
          getSuggestions={getSuggestions}
          inputProps={inputProps}
          onSuggestionSelected={this.onUniversitySelected}
          minChars={3}
        />
        {touched && error && fields.createError(error)}
      </div>
    );
  }
};
