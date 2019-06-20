import React from 'react';
import AutoSuggest from '~/components/AutoSuggest';

interface EnumFilterComponentProps {
  label: string;
  getSuggestions: any;
  minChars?: number;
  onChange: (newValue: string) => void;
}

interface EnumFilterComponentState {
}

export default class EnumFilterComponent
  extends React.Component<EnumFilterComponentProps, EnumFilterComponentState> {
  onUniversitySelected = (suggestion: string) => {
    this.props.onChange(suggestion);
  }

  render() {
    const { label, getSuggestions, minChars } = this.props;

    return (
      <>
        {label}
        <AutoSuggest
          getSuggestions={getSuggestions}
          inputProps={{
            className: 'sd-form__input-text w-100',
          }}
          onSuggestionSelected={this.onUniversitySelected}
          minChars={minChars ? minChars : 3}
        />
      </>
    );
  }
}
