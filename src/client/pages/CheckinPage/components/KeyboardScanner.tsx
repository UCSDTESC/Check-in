import React from 'react';

import { USER_ID_LENGTH } from '..';

import Scanner from './Scanner';

interface KeyboardScannerState {
  currentCode: string;
}

/**
 * React Component to render an input where an organizer can scan in a user ID 
 * through a QR scanner.
 */
export default class KeyboardScanner extends Scanner<{}, KeyboardScannerState> {
  state: Readonly<KeyboardScannerState> = {
    currentCode: '',
  };

  /**
   * Callback to be made after the user ID is scanned.
   * 
   * @param {React.FormEvent} event the input event being responded to.
   */
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
