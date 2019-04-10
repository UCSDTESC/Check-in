import React from 'react';
import FA from 'react-fontawesome';
import { ScannerType } from '..';

interface ScannerSelectorProps {
  selectedScanner: ScannerType;
  onSelectScanner: (newScanner: ScannerType) => void;
}

export default class ScannerSelector extends React.Component<ScannerSelectorProps> {

  render() {
    const {selectedScanner, onSelectScanner} = this.props;

    const selectedClass = 'btn btn-primary active';
    const deselectedClass = 'btn btn-outline-primary';

    const isKeyboard = selectedScanner === ScannerType.Keyboard;
    const isWebcam = selectedScanner === ScannerType.Webcam;
    const isManual = selectedScanner === ScannerType.Manual;

    return (
      <div className="btn-group btn-group-toggle" data-toggle="buttons">
        <button
          className={isKeyboard ? selectedClass : deselectedClass}
          onClick={() => onSelectScanner(ScannerType.Keyboard)}
        >
          <FA name="qrcode" /><br/>
          Scanner
        </button>
        <button
          className={isWebcam ? selectedClass : deselectedClass}
          onClick={() => onSelectScanner(ScannerType.Webcam)}
        >
          <FA name="video-camera" /><br/>
          Webcam
        </button>
        <button
          className={isManual ? selectedClass : deselectedClass}
          onClick={() => onSelectScanner(ScannerType.Manual)}
        >
          <FA name="search" /><br/>
          Manual
        </button>
      </div>
    );
  }
}
