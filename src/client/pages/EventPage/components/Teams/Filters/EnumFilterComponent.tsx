import React from 'react';
import AutoSuggest from '~/components/AutoSuggest';

import FilterComponent from './FilterComponent';
import StringFilter, { StringOperation } from './StringFilter';

interface EnumFilterComponentProps {
  getSuggestions: any;
  minChars?: number;
}

interface EnumFilterComponentState {
}

export default class EnumFilterComponent
  extends FilterComponent<EnumFilterComponentProps, EnumFilterComponentState> {
  onEnumSelected = (suggestion: string) => {
    const { label, propertyName } = this.props;
    const newFilter: StringFilter = new StringFilter(propertyName, label, StringOperation.EQUALS, suggestion);
    this.props.onFiltersChanged(newFilter);
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
