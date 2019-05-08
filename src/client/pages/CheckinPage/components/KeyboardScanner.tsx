import React from 'react';

import { USER_ID_LENGTH } from '..';

import Scanner from './Scanner';

interface KeyboardScannerState {
  currentCode: string;
}

export default class KeyboardScanner extends Scanner<{}, KeyboardScannerState> {
  state: Readonly<KeyboardScannerState> = {
    currentCode: '',
  };

  onChangeInput = (event: React.FormEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;

    if (newValue.length === USER_ID_LENGTH) {
      this.props.onUserScanned(newValue);
      this.setState({
        currentCode: '',
      });
    } else {
      this.setState({
        currentCode: newValue,
      });
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col text-center">
          <input
            type="text"
            placeholder="QR Input"
            className="rounded-input"
            value={this.state.currentCode}
            onChange={this.onChangeInput}
          />
        </div>
      </div>
    );
  }
}
