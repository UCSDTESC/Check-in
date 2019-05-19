import React from 'react';
import { WrappedFieldProps } from 'redux-form';
import AutoSuggest from '~/components/AutoSuggest';
import * as FormFields from '~/components/Fields';
import { getSuggestions } from '~/static/Universities';

interface UniversityFieldProps {
  className?: string;
  placeholder?: string;
}

type Props = WrappedFieldProps & UniversityFieldProps;

export default class UniversityField extends React.Component<Props> {
  
  /**
   * Function that is called when the user selects a suggestion from the AutoSuggest
   * TODO: better documentation
   * @param {String} suggestion The suggestion that the user selected
   */
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
