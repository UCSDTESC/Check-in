import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';

export default class AutoSuggest extends React.Component {
  static propTypes = {
    inputProps: PropTypes.object.isRequired,

    getSuggestions: PropTypes.func.isRequired,
    onSuggestionSelected: PropTypes.func.isRequired,

    minChars: PropTypes.number
  };

  constructor(props) {
    super(props);

    this.state = {
      suggestions: []
    };
  }

  onFetchRequested({value}) {
    let suggestions = this.props.getSuggestions(value);
    this.setState({
      suggestions
    });
  }

  onClearRequested() {
    this.setState({
      suggestions: []
    });
  }

  renderSuggestion(suggestion) {
    return (<a tabIndex="-1"
      onClick={() => this.props.onSuggestionSelected(suggestion)}
      className="sd-form__suggestions-link">
      {suggestion}
    </a>);
  }

  getSuggestionValue = (suggestion) => suggestion;

  shouldRenderSuggestions = (value) => value.trim().length >
    (this.props.minChars ? this.props.minChars : 0);

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
    sectionTitle: 'react-autosuggest__section-title'
  };

  render() {
    let {suggestions} = this.state;

    let defaultTheme = this.defaultTheme;

    let theme = {
      ...defaultTheme,
      suggestionsContainer: `${defaultTheme.suggestionsContainer}
        sd-form__suggestions-container`,
      suggestionsList: `${defaultTheme.suggestionsList}
        sd-form__suggestions-list`,
      suggestion: `${defaultTheme.suggest}
        sd-form__suggestions-suggestion`
    };

    return (
      <div>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onFetchRequested.bind(this)}
          onSuggestionsClearRequested={this.onClearRequested.bind(this)}
          renderSuggestion={this.renderSuggestion.bind(this)}
          renderSuggestionsContainer={this.renderSuggestionsContainer}
          getSuggestionValue={this.getSuggestionValue}
          shouldRenderSuggestions={this.shouldRenderSuggestions}
          inputProps={this.props.inputProps}
          theme={theme}
        />
      </div>
    );
  }
};
