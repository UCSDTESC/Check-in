import React from 'react';
import PropTypes from 'prop-types';

import ToggleSwitch from '~/components/ToggleSwitch';

import AutoSuggest from '~/components/AutoSuggest';

export default class Filter extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    editable: PropTypes.bool.isRequired,

    enabled: PropTypes.bool.isRequired,
    onEnableChange: PropTypes.func.isRequired,

    availableOptions: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    options: PropTypes.object.isRequired,
    onOptionChange: PropTypes.func.isRequired,
    addFilterOption: PropTypes.func.isRequired,

    selectAllOptions: PropTypes.func.isRequired,
    selectNoneOptions: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      newOption: '',
      isHidden: true
    };
  }

  /**
   * Toggles whether the filter information is showing.
   */
  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden
    });
  }

  /**
   * Renders the optional filter with a given name, and a checkbox.
   * @param {String} optionName The name of the option to render.
   * @param {Boolean} checked True if the filter is chosen.
   * @param {Integer} key Render key for React.
   * @returns {Component} The optional filter components.
   */
  renderFilterOption(optionName, checked, key) {
    let {onOptionChange} = this.props;
    return (
      <div className="sd-form sidebar-filter__filter" key={key}>
        <input type="checkbox" className="sd-form__input-checkbox"
          checked={checked} onChange={() =>
            onOptionChange(optionName)} />
        {optionName}
      </div>
    );
  }

  getOptionSuggestions = (val) => this.props.availableOptions
    .filter(opt => opt.toLowerCase().indexOf(val.toLowerCase()) !== -1);

  updateNewOption = (event, {newValue}) => {
    this.setState({
      newOption: newValue
    });
  }

  addFilterOption = (args) => {
    this.props.addFilterOption(args);
    this.setState({
      newOption: ''
    });
  }

  /**
   * Renders the new filter option field with autosuggestion.
   * @returns {Component} The new filter option field.
   */
  renderNewOptionField() {
    let inputProps = {
      placeholder: 'New Filter',
      className: 'sd-form__input-text sidebar-filter__search',
      value: this.state.newOption,
      onChange: this.updateNewOption
    };

    return (
      <div className="sidebar-filter__autosuggest">
        <AutoSuggest
          getSuggestions={this.getOptionSuggestions}
          inputProps={inputProps}
          onSuggestionSelected={this.addFilterOption}
        />
      </div>
    );
  }

  render() {
    let {name, enabled, options, onEnableChange, editable} = this.props;
    let {isHidden} = this.state;

    // Hide if disabled
    isHidden = enabled ? isHidden : true;

    let disabledClass = !enabled ? 'sidebar-filter--disabled' : '';
    let showDisabled = !enabled ? 'sidebar-filter__show--disabled' : '';

    return (<div className={`sidebar-filter ${disabledClass}`}>
      <a className="sidebar-filter__header"
        onClick={this.toggleHidden.bind(this)}>
        <ToggleSwitch checked={enabled} onChange={onEnableChange} />
        <span className="sidebar-filter__name">{name}</span>
        <span
          className={`sidebar-filter__show ${showDisabled}`}>
          {isHidden && <i className="fa fa-angle-down"></i>}
          {!isHidden && <i className="fa fa-angle-up"></i>}
        </span>
      </a>
      {!isHidden && <div className="sidebar-filter__settings">
        <div className="sidebar-filter__toggles">
          <button className={`btn rounded-button rounded-button--small
            rounded-button--success sidebar-filter__toggle`}
            onClick={this.props.selectAllOptions}>
            Select All
          </button>
          <button className={`btn rounded-button rounded-button--small
            rounded-button--alert sidebar-filter__toggle`}
            onClick={this.props.selectNoneOptions}>
            Select None
          </button>
        </div>

        {options && Object.keys(options).map((optionName, i) =>
          this.renderFilterOption(optionName, options[optionName], i))}

        {editable && this.renderNewOptionField()}
      </div>}
    </div>);
  }
};
