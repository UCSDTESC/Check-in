import React from 'react';
import { WrappedFieldProps } from 'redux-form';

interface CheckboxButtonProps {
}

interface CheckboxButtonState {
  value: boolean | string;
}

type Props = WrappedFieldProps & CheckboxButtonProps;

export default class CheckboxButton extends React.Component<Props, CheckboxButtonState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.input.value,
    };
  }

  componentDidReceiveProps(nextProps: Props) {
    this.setState({
      value: nextProps.input.value,
    });
  }

  /**
   * Updates the value of the checkbox to the opposite value
   */
  updateValue() {
    const newState = !this.state.value;
    this.setState({
        value: newState,
    });
    this.props.input.onChange(newState);
  }

  render() {
    const {value} = this.state;
    const isChecked: boolean = !!value || (value === 'true');

    const active = isChecked ? 'active' : '';
    const text = isChecked ? 'True' : 'False';
    return (
      <div className="btn-group-toggle" data-toggle="buttons">
        <label
          className={`btn btn-outline-primary ${active}`}
          onClick={() => this.updateValue()}
        >
          <input
            type="checkbox"
            checked={isChecked}
            autoComplete="off"
          /> {text}
        </label>
      </div>
    );
  }
}
