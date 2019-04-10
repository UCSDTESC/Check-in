import React from 'react';
import Scanner from './Scanner';
import QrReader from 'react-qr-reader';
import { USER_ID_LENGTH } from '..';

export default class WebcamScanner extends Scanner {
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