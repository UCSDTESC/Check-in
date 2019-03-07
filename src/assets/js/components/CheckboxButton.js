import React from 'react';
import PropTypes from 'prop-types';

class CheckboxButton extends React.Component {
  static propTypes = {
    input: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.input.value
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({value: nextProps.input.value});
  }

  /**
   * Updates the value of the checkbox to the opposite value
   */
  updateValue() {
    let newState = !this.state.value;
    this.setState({value: newState});
    this.props.input.onChange(newState);
  }

  render() {
    const {value} = this.state;
    const isChecked = value === 'true';

    let active = isChecked ? 'active' : '';
    let text = isChecked ? 'True' : 'False';
    return (
      <div className="btn-group-toggle" data-toggle="buttons">
        <label className={`btn btn-outline-primary ${active}`}
          onClick={() => this.updateValue()}>
          <input type="checkbox" checked={isChecked}
            autoComplete="off" /> {text}
        </label>
      </div>
    );
  }
}

export default CheckboxButton;
