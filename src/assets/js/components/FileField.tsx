import React, {DragEvent} from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

import fields from './Fields';

interface FileFieldProps {
  // TODO: Fix input type
  input: any;
  meta: any;
  accept?: string;
  multiple?: boolean;
  className?: string;

  button?: boolean;
  text?: string;
  secondary?: boolean;
}

export default class FileField extends React.Component<FileFieldProps> {
  /**
   * Event handler for dropping or clicking a new file into the zone.
   */
  handleDropOrClick = (acceptedFiles: File[], rejectedFiles: File[], e: DragEvent<HTMLDivElement>) => {
    let eventOrValue = null;
    const {input: {onChange, onBlur}} = this.props;
    if (e.type === 'drop') {
      if (acceptedFiles.length) {
        // FileList or [File]
        eventOrValue =
          (e.dataTransfer && e.dataTransfer.files) || acceptedFiles;
      } else {
        eventOrValue = null;
      }
    }
    onBlur(eventOrValue); // update touched
    onChange(eventOrValue); // update value
  }

  renderAsButton(text: string) {
    const {secondary} = this.props;

    const className = `btn rounded-button rounded-button--small
      ${secondary ? 'rounded-button--secondary' : ''}`;
    return (
      <a tabIndex={-1} className={className} >
        {text}
      </a>
    );
  }

  renderAsDropzone(text: string) {
    return (
    <div className="sd-form__dropzone text-center">
      <div
        className={'sd-form__dropzone--icon d-flex flex-column justify-content-end'}
      >
        <i className="fa fa-cloud-upload"/>
      </div>
      <div className="sd-form__dropzone--text">
        {text}
      </div>
    </div>
    );
  }

  render() {
    const {input, meta: {touched, error}, button, className} = this.props;
    const {accept, multiple} = this.props;
    const selectedFile = (input && input.value && input.value[0]) || null;
    const dropzoneProps = {
      accept,
      multiple,
      onDrop: this.handleDropOrClick,
      className: className,
    };

    const text = this.props.text ? this.props.text : 'Drop Your File';

    return (
      <div>
        <input type="hidden" disabled={true} {...input} />
        {selectedFile ? <span>{selectedFile.name}</span> : null}
        <Dropzone {...dropzoneProps}>
          {button ? this.renderAsButton(text) : this.renderAsDropzone(text)}
        </Dropzone>
        {touched && error && fields.createError(error)}
      </div>
    );
  }
}
