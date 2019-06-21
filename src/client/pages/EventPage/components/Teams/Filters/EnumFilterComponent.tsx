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
  onEnumSelected = (suggestion: string) => {
    this.props.onChange(suggestion);
  }

  render() {
    const { label, getSuggestions, minChars } = this.props;

    return (
      <>
        <div>
          {label}
        </div>
        <AutoSuggest
          getSuggestions={getSuggestions}
          inputProps={{
            className: 'sd-form__input-text',
          }}
          onSuggestionSelected={this.onEnumSelected}
          minChars={!!minChars ? minChars : 3}
        />
      </>
    );
  }
}
