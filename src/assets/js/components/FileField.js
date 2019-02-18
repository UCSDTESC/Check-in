import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

import fields from './Fields';

export default class FileField extends React.Component {
  static propTypes = {
    input: PropTypes.object.isRequired,
    meta: PropTypes.object.isRequired,
    accept: PropTypes.string,
    multiple: PropTypes.bool,
    className: PropTypes.string,

    button: PropTypes.bool,
    text: PropTypes.string,
    secondary: PropTypes.bool
  };

  /**
   * Event handler for dropping or clicking a new file into the zone.
   */
  handleDropOrClick = (acceptedFiles, rejectedFiles, e) => {
    let eventOrValue = e;
    let {input: {onChange, onBlur}} = this.props;
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

  renderAsButton(text) {
    let {secondary} = this.props;

    const className = `btn rounded-button rounded-button--small
      ${secondary ? 'rounded-button--secondary' : ''}`;
    return (<a tabIndex='-1'
      className={className}>
      {text}
    </a>);
  }

  renderAsDropzone(text) {
    return (<div className="sd-form__dropzone text-center">
      <div className={'sd-form__dropzone--icon d-flex ' +
        'flex-column justify-content-end'}>
        <i className="fa fa-cloud-upload"></i>
      </div>
      <div className="sd-form__dropzone--text">
        {text}
      </div>
    </div>);
  }

  render() {
    let {input, meta: {touched, error}, button, className} = this.props;
    let {accept, multiple} = this.props;
    let selectedFile = (input && input.value && input.value[0]) || null;
    let dropzoneProps = {
      accept,
      multiple,
      onDrop: this.handleDropOrClick,
      className: className
    };

    let text = this.props.text ? this.props.text : 'Drop Your File';

    return (
      <div>
        <input type='hidden' disabled {...input} />
        {selectedFile? <span>{selectedFile.name}</span> : null}
        <Dropzone {...dropzoneProps}>
          {button ? this.renderAsButton(text) : this.renderAsDropzone(text)}
        </Dropzone>
        {touched && error && fields.createError(error)}
      </div>
    );
  }
};
