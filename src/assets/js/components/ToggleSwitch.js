import React from "react";
import PropTypes from "prop-types";
import {default as UUID} from "node-uuid";

class ToggleSwitch extends React.Component {
  static propTypes = {
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func,
    className: PropTypes.string,
    disabled: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      id: UUID.v4(),
    };
  }

  /**
   * Toggles the checkbox value
   */
  toggle = () => {
    let newState = !this.props.checked;

    if (this.props.onChange) {
      this.props.onChange(newState);
    }
  }

  render() {
    let {checked, disabled} = this.props;

    return (
      <div className={`switch ${this.props.className}`} >
        <input id={this.state.id}
          className="toggle-switch toggle-switch-round-flat"
          type="checkbox" onChange={this.toggle}
          checked={checked}
          disabled={disabled}
          />
        <label htmlFor={this.state.id}></label>
      </div>
    );
  }
}

export default ToggleSwitch;
