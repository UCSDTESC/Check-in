import React from 'react';
import QrReader from 'react-qr-reader';

import { USER_ID_LENGTH } from '..';

import Scanner from './Scanner';

/**
 * Renders a QR Code Scanner and reads the user ID.
 */
export default class WebcamScanner extends Scanner {

  /**
   * The callback to be called with the scanned data from the QR code.
   * 
   * @param {String} data The data scanned from the QR code.
   */
  onScan = (data: string) => {
    if (data === null || data.length !== USER_ID_LENGTH) {
      return;
    }

    this.props.onUserScanned(data);
  }

  render() {
    const previewStyle = {
      maxWidth: '100%',
      maxHeight: '50vh',
      display: 'inline',
    };

    return (
      <div className="row">
        <div className="col-12 text-center">
          <QrReader
            delay={200}
            style={previewStyle}
            onError={console.error}
            onScan={this.onScan}
          />
        </div>
      </div>
    );
  }
}
