import React from 'react';
import AutoSuggest from '~/components/AutoSuggest';

import FilterComponent from './FilterComponent';
import StringFilter, { StringOperation } from './StringFilter';

interface StringFilterComponentProps {
  getSuggestions: any;
  minChars?: number;
}

interface StringFilterComponentState {
  values: string[];
}

export default class StringFilterComponent
  extends FilterComponent<StringFilterComponentProps, StringFilterComponentState> {
  state: Readonly<StringFilterComponentState> = {
    values: [],
  };

  componentDidMount() {
    // Resend the values when remounting.
    console.log('mounted');
    this.sendCurrentValues();
  }

  sendCurrentValues = () => {
    const { label, propertyName } = this.props;

    const newFilter: StringFilter = new StringFilter(propertyName, label,
      StringOperation.EQUALS, ...this.state.values);
    this.props.onFiltersChanged(newFilter);
  };

  onSuggestionSelected = (suggestion: string) => {
    const { values } = this.state;

    const newValues = [suggestion, ...values];
    this.setState({
      values: newValues,
    }, this.sendCurrentValues);
  }

  render() {
    const { label, getSuggestions, minChars } = this.props;
    const { values } = this.state;

    return (
      <>
        <div>
          {label}
        </div>
        <ul>
          {values.map(value =>
            <li key={value}>{value}</li>
          )}
        </ul>
        <AutoSuggest
          getSuggestions={getSuggestions}
          inputProps={{
            className: 'sd-form__input-text',
          }}
          onSuggestionSelected={this.onSuggestionSelected}
          minChars={!!minChars ? minChars : 3}
        />
      </>
    );
  }
}
