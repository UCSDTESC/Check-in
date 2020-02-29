import React, { FormEvent } from 'react';
import Autosuggest, { InputProps } from 'react-autosuggest';

interface AutoSuggestProps {
  inputProps: object;
  getSuggestions: (value: string) => string[];
  onSuggestionSelected: (suggestion: string) => void;
  minChars?: number;
}

interface AutoSuggestState {
  value: string;
  suggestions: string[];
}

export default class AutoSuggest extends React.Component<AutoSuggestProps, AutoSuggestState> {
  state: Readonly<AutoSuggestState> = {
    value: '',
    suggestions: [],
  };

  /**
   * As defined by the react-autosuggest documentation
   */
  defaultTheme =
    {
      container: 'react-autosuggest__container',
      containerOpen: 'react-autosuggest__container--open',
      input: 'react-autosuggest__input',
      inputOpen: 'react-autosuggest__input--open',
      inputFocused: 'react-autosuggest__input--focused',
      suggestionsContainer: 'react-autosuggest__suggestions-container',
      suggestionsContainerOpen: 'react-autosuggest__suggestions-container--open',
      suggestionsList: 'react-autosuggest__suggestions-list',
      suggestion: 'react-autosuggest__suggestion',
      suggestionFirst: 'react-autosuggest__suggestion--first',
      suggestionHighlighted: 'react-autosuggest__suggestion--highlighted',
      sectionContainer: 'react-autosuggest__section-container',
      sectionContainerFirst: 'react-autosuggest__section-container--first',
      sectionTitle: 'react-autosuggest__section-title',
    };

  onChange = (event: FormEvent, { newValue }: { newValue: string }) => {
    this.setState({
      value: newValue,
    });
  }

  onFetchRequested = ({ value }: { value: string }) => {
    const suggestions = this.props.getSuggestions(value);
    this.setState({
      suggestions,
    });
  }

  onClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  }

  renderSuggestion = (suggestion: string) => {
    return (
      <div
        tabIndex={-1}
        onClick={() => this.props.onSuggestionSelected(suggestion)}
        className="sd-form__suggestions-link"
      >
        {suggestion}
      </div>
    );
  }

  getSuggestionValue = (suggestion: string) => suggestion;

  shouldRenderSuggestions = (value: string) => value.trim().length >=
    (this.props.minChars ? this.props.minChars : 0)

  render() {
    const { suggestions, value } = this.state;

    const defaultTheme = this.defaultTheme;

    const theme = {
      ...defaultTheme,
      suggestionsContainer: `${defaultTheme.suggestionsContainer}
        sd-form__suggestions-container`,
      suggestionsList: `${defaultTheme.suggestionsList}
        sd-form__suggestions-list`,
      suggestion: `${defaultTheme.suggestion}
        sd-form__suggestions-suggestion`,
    };

    const inputProps = {
      onChange: this.onChange,
      value,
      ...this.props.inputProps,
    } as InputProps<string>;

    return (
      <div>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onFetchRequested}
          onSuggestionsClearRequested={this.onClearRequested}
          renderSuggestion={this.renderSuggestion}
          getSuggestionValue={this.getSuggestionValue}
          shouldRenderSuggestions={this.shouldRenderSuggestions}
          inputProps={inputProps}
          theme={theme}
        />
      </div>
    );
  }
}
