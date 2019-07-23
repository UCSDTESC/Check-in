import React, { RefObject, HTMLProps } from 'react';

export enum CheckboxState {
  CHECKED,
  UNCHECKED,
  INDETERMINATE,
}

interface SelectAllCheckboxProps {
  state: CheckboxState;
}

type Props = SelectAllCheckboxProps & HTMLProps<HTMLInputElement>;

export default class SelectAllCheckbox extends React.Component<Props> {
  ref: RefObject<HTMLInputElement>;

  constructor(props: Props) {
    super(props);

    this.ref = React.createRef<HTMLInputElement>();
  }

  updateState(newState: CheckboxState) {
    if (newState === CheckboxState.INDETERMINATE) {
      this.ref.current.indeterminate = true;
      this.ref.current.checked = false;
    } else {
      this.ref.current.indeterminate = false;
      this.ref.current.checked = newState === CheckboxState.CHECKED;
    }
  }

  componentDidMount() {
    this.updateState(this.props.state);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.state !== this.props.state) {
      this.updateState(this.props.state);
    }
  }

  render() {
    return (
      <input {...this.props} type="checkbox" ref={this.ref} />
    );
  }
}
