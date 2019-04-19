import React, { FormEvent } from 'react';
import AutoSuggest from '~/components/AutoSuggest';
import ToggleSwitch from '~/components/ToggleSwitch';
import { FilterOptions } from '~/static/types';

interface FilterProps {
  name: string;
  editable: boolean;

  enabled: boolean;
  onEnableChange: (newEnabled: boolean) => void;

  availableOptions: string[];
  options: FilterOptions;
  onOptionChange: (optionName: string) => void;
  addFilterOption: (optionName: string) => void;

  selectAllOptions: () => void;
  selectNoneOptions: () => void;
}

interface FilterState {
  newOption: string;
  isHidden: boolean;
}

export default class Filter extends React.Component<FilterProps, FilterState> {
  state: Readonly<FilterState> = {
    newOption: '',
    isHidden: true,
  };

  /**
   * Toggles whether the filter information is showing.
   */
  toggleHidden = () => {
    this.setState({
      isHidden: !this.state.isHidden,
    });
  }

  /**
   * Renders the optional filter with a given name, and a checkbox.
   * @param {String} optionName The name of the option to render.
   * @param {Boolean} checked True if the filter is chosen.
   * @param {Integer} key Render key for React.
   * @returns {Component} The optional filter components.
   */
  renderFilterOption(optionName: string, checked: boolean, key: number) {
    const {onOptionChange} = this.props;
    return (
      <div className="sd-form sidebar-filter__filter" key={key}>
        <input
          type="checkbox"
          className="sd-form__input-checkbox"
          checked={checked}
          onChange={() => onOptionChange(optionName)}
        />
        {optionName}
      </div>
    );
  }

  getOptionSuggestions = (val: string) => this.props.availableOptions
    .filter(opt => opt.toLowerCase().indexOf(val.toLowerCase()) !== -1);

  updateNewOption = (event: FormEvent<any>, {newValue}: {newValue: string}) => {
    this.setState({
      newOption: newValue,
    });
  }

  addFilterOption = (optionName: string) => {
    this.props.addFilterOption(optionName);
    this.setState({
      newOption: '',
    });
  }

  /**
   * Renders the new filter option field with autosuggestion.
   * @returns {Component} The new filter option field.
   */
  renderNewOptionField() {
    const inputProps = {
      placeholder: 'New Filter',
      className: 'sd-form__input-text sidebar-filter__search',
      value: this.state.newOption,
      onChange: this.updateNewOption,
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
    const {name, enabled, options, onEnableChange, editable} = this.props;
    let {isHidden} = this.state;

    // Hide if disabled
    isHidden = enabled ? isHidden : true;

    const disabledClass = !enabled ? 'sidebar-filter--disabled' : '';
    const showDisabled = !enabled ? 'sidebar-filter__show--disabled' : '';

    return (
    <div className={`sidebar-filter ${disabledClass}`}>
      <a
        className="sidebar-filter__header"
        onClick={this.toggleHidden}
      >
        <ToggleSwitch checked={enabled} onChange={onEnableChange} />
        <span className="sidebar-filter__name">{name}</span>
        <span className={`sidebar-filter__show ${showDisabled}`}>
          {isHidden &&  <i className="fa fa-angle-down"/>}
          {!isHidden &&  <i className="fa fa-angle-up"/>}
        </span>
      </a>
      {!isHidden && <div className="sidebar-filter__settings">
        <div className="sidebar-filter__toggles">
          <button
            className="btn rounded-button rounded-button--small rounded-button--success sidebar-filter__toggle"
            onClick={this.props.selectAllOptions}
          >
            Select All
          </button>
          <button
            className="btn rounded-button rounded-button--small rounded-button--alert sidebar-filter__toggle"
            onClick={this.props.selectNoneOptions}
          >
            Select None
          </button>
        </div>

        {options && Object.keys(options).map((optionName, i) =>
          this.renderFilterOption(optionName, options[optionName], i))}

        {editable && this.renderNewOptionField()}
      </div>}
    </div>
    );
  }
}
