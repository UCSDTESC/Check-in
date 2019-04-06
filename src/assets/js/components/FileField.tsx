import React, {DragEvent} from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

import * as FormFields from './Fields';
import { WrappedFieldProps } from 'redux-form';

interface FileFieldProps {
  accept?: string;
  multiple?: boolean;
  className?: string;

  button?: boolean;
  text?: string;
  secondary?: boolean;
}

interface FileFieldState {
  selectedFiles?: string[];
}

type Props = WrappedFieldProps & FileFieldProps;

export default class FileField extends React.Component<Props, FileFieldState> {
  state: Readonly<FileFieldState> = {
    selectedFiles: [],
  };

  onDrop = (acceptedFiles: File[]) => {
    this.props.input.onChange(acceptedFiles);
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
      onDrop: this.onDrop,
    };

    const text = this.props.text ? this.props.text : 'Drop Your File';

    return (
      <div>
        <input type="hidden" disabled={true} {...input} />
        {selectedFile ? <span>{selectedFile.name}</span> : null}
        <Dropzone {...dropzoneProps} >
          {({getRootProps, getInputProps}) => (
            <div {...getRootProps()} className={className}>
              <input {...getInputProps()} />
              {button ? this.renderAsButton(text) : this.renderAsDropzone(text)}
            </div>
          )}
        </Dropzone>
        {touched && error && FormFields.createError(error)}
      </div>
    );
  }
}
