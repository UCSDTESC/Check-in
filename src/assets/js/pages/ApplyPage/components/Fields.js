/* eslint-disable react/prop-types */
import {Field} from 'redux-form';
import React from 'react';

import majors from '~/static/Majors.json';

/**
 * Defines all of the custom fields for the application.
 * Anything beginning with "error" contains a label which renders the error, and
 * should be rendered only through a redux-form {@link Field}.
 */

let creates = {};

creates.createRow = function createRow(...content) {
  return (<div className='row sd-form__row'>
    {content}
  </div>);
};

creates.createColumn = function createColumn(size, ...content) {
  return (<div className={size}>
    {content}
  </div>);
};

creates.createError = function createError(text) {
  return (<div className="sd-form__error">
    <strong><i className="fa fa-exclamation-triangle"></i> </strong>
    {text}
  </div>);
};

creates.errorClass = function errorClass(className, touched, error) {
  return className +
    (touched && error ? ' ' + 'sd-form__input--error' : '');
};

creates.errorTextInput =
  function errorTextInput({input, className, placeholder, type,
    meta: {touched, error}}) {
    let errorClass = creates.errorClass(className, touched, error);
    return (
      <div>
        <input {...input} className={errorClass}
          placeholder={placeholder} type={type} />
        {touched && error && creates.createError(error)}
      </div>);
  };

creates.errorRadio =
  function errorRadio({input, className, label, defaultVal}) {
    return (
      <div className='form-check form-check-inline'>
        <label className='form-check-label'>
          <input {...input} className={className} type="radio"
            value={defaultVal} checked={input.value === defaultVal} />
          {label}
        </label>
      </div>);
  };

creates.errorTextArea =
  function errorTextArea({input, className, placeholder, maxLength,
    meta: {touched, error}}) {
    let errorClass = creates.errorClass(className, touched, error);
    return (
      <div>
        <textarea {...input} className={errorClass} placeholder={placeholder}
          maxLength={maxLength} />
        {touched && error && creates.createError(error)}
      </div>);
  };

creates.errorMonthPicker =
  function errorMonthPicker({input, className, type,
    meta: {touched, error}}) {
    let errorClass = creates.errorClass(className, touched, error);
    let months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];

    return (
      <div>
        <select {...input} className={errorClass}
          type={type}>
          <option key={-1}>Month</option>
          {months.map((month, i) => (
            <option key={i} value={(i+1) < 10 ? '0' + (i+1) : (i+1)}>
              {month}
            </option>)
          )}
        </select>
        {touched && error && creates.createError(error)}
      </div>);
  };

creates.errorTShirtSizePicker =
  function errorTShirtSizePicker({input, className, type,
    meta: {touched, error}}) {
    let errorClass = creates.errorClass(className, touched, error);
    let sizes = [
      'Small', 'Medium', 'Large', 'X-Large', 'XX-Large'
    ];
    let values = [
      'S', 'M', 'L', 'XL', 'XXL'
    ];

    return (
      <div>
        <select {...input} className={errorClass}
          type={type}>
          <option key={-1}></option>
          {sizes.map((size, i) =>
            <option key={i} value={values[i]}>{size}</option>)}
        </select>
        {touched && error && creates.createError(error)}
      </div>);
  };

creates.errorGenderPicker =
  function errorGenderPicker({input, className, type,
    meta: {touched, error}}) {
    let errorClass = creates.errorClass(className, touched, error);
    let genders = [
      'Male', 'Female', 'Non-Binary', 'Transgender',
      'I prefer not to say', 'Other'
    ];

    return (
      <div>
        <select {...input} className={errorClass}
          type={type}>
          <option key={-1}></option>
          {genders.map((gender, i) =>
            <option key={i} value={gender}>{gender}</option>)}
        </select>
        {touched && error && creates.createError(error)}
      </div>);
  };

creates.errorYearPicker =
  function errorYearPicker({input, className, type,
    meta: {touched, error}}) {
    let errorClass = creates.errorClass(className, touched, error);
    let years = [
      '1', '2', '3', '4', '5+'
    ];

    return (
      <div>
        <select {...input} className={errorClass}
          type={type}>
          <option key={-1}></option>
          {years.map((year, i) =>
            <option key={i} value={year}>{year}</option>)}
        </select>
        {touched && error && creates.createError(error)}
      </div>);
  };

creates.errorMajorPicker =
  function errorMajorPicker({input, className, type,
    meta: {touched, error}}) {
    let errorClass = creates.errorClass(className, touched, error);

    return (
      <div>
        <select {...input} className={errorClass}
          type={type}>
          <option key={-1}></option>
          {majors.map((major, i) =>
            <option key={i} value={major}>{major}</option>)}
        </select>
        {touched && error && creates.createError(error)}
      </div>);
  };

creates.createLabel = function createLabel(text, required=true, className='',
  forTag='') {
  return (<label className={required ? 'sd-form__required ' +
    className : className} htmlFor={forTag}>{text}</label>);
};

creates.createInput = function createInput(name, placeholder, type='text',
  className='sd-form__input-text', normalize=null) {
  return (<Field className={className}
    name={name} component={creates.errorTextInput} placeholder={placeholder}
    type={type} normalize={normalize} />);
};

creates.createTextArea = function createTextArea(name, placeholder,
  maxLength=null, className='sd-form__input-textarea') {
  return (<Field className={className} name={name} maxLength={maxLength}
    component={creates.errorTextArea} placeholder={placeholder} />);
};

creates.createMonthPicker = function createMonthPicker() {
  return (<Field component={creates.errorMonthPicker}
    className="sd-form__input-select mb-1 mb-md-0" name="birthdateMonth" />);
};

creates.createGenderPicker = function createGenderPicker() {
  return (<Field component={creates.errorGenderPicker}
    className="sd-form__input-select" name="gender" />);
};

creates.createTShirtSizePicker = function createTShirtSizePicker() {
  return (<Field component={creates.errorTShirtSizePicker}
    className="sd-form__input-select" name="shirtSize" />);
};

creates.createYearPicker = function createYearPicker() {
  return (<Field component={creates.errorYearPicker}
    className="sd-form__input-select" name="year" />);
};

creates.createMajorPicker = function createMajorPicker() {
  return (<Field component={creates.errorMajorPicker}
    className="sd-form__input-select" name="major" />);
};

creates.createRadio = function createRadio(name, value, label,
  className='sd-form__input-radio form-check-input') {
  return (<Field component={creates.errorRadio} className={className}
    name={name} defaultVal={String(value)} label={label} />);
};

export default creates;
