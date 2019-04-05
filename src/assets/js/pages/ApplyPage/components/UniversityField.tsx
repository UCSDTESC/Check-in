import React from 'react';

import AutoSuggest from '~/components/AutoSuggest';

import {getSuggestions} from '~/static/Universities';

import * as FormFields from '~/components/Fields';
import { WrappedFieldProps } from 'redux-form';

interface UniversityFieldProps {
  className?: string;
  placeholder?: string;
}

type Props = WrappedFieldProps & UniversityFieldProps;

export default class UniversityField extends React.Component<Props> {
  onUniversitySelected = (suggestion: string) => {
    const {input} = this.props;
    input.onChange(suggestion);
  }

  render() {
    const {input, className, placeholder, meta: {touched, error}} = this.props;
    const suggestClass = `${className} ${error && touched ? 'sd-form__input--error' : ''}`;

    const inputProps = {
      ...input,
      placeholder,
      className: suggestClass,
    };

    return (
      <div>
        <AutoSuggest
          getSuggestions={getSuggestions}
          inputProps={inputProps}
          onSuggestionSelected={this.onUniversitySelected}
          minChars={3}
        />
        {touched && error && FormFields.createError(error)}
      </div>
    );
  }
}
