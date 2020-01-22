import { UserDiversityOptions, UserYearOptions, UserGenderOptions, UserShirtSizeOptions } from '@Shared/UserEnums';
import React, { FunctionComponent } from 'react';
import { Field, WrappedFieldProps } from 'redux-form';
import majors from '~/static/Majors.json';

export type CustomFieldProps = WrappedFieldProps & {
  className?: string;
  placeholder?: string;
  type?: string;
  label?: string;
  defaultVal?: string;
  maxLength?: number;
};

type ApplicationColProps = {
  className?: string;
};

type ApplicationLabelProps = {
  required?: boolean;
  className?: string;
  forTag?: string;
  // hack?
  children?: string | JSX.Element[] | JSX.Element;
};

export type ApplicationInputProps = {
  className?: string;
  name?: string;
  placeholder?: string;
  type?: string;
  normalize?: (value: any, previousValue: any) => void;
};

export type ApplicationTextAreaProps = {
  name?: string;
  placeholder?: string;
  maxLength?: number;
  className?: string;
};

type ApplicationRadioProps = {
  name?: string;
  value?: any;
  label?: string;
  className?: string;
};

/**
 * Defines all of the custom fields for the application.
 * Anything beginning with "error" contains a label which renders the error, and
 * should be rendered only through a redux-form {@link Field}.
 */

export function createRow(...content: any[]) {
  return (
    <div className="row sd-form__row">
      {content}
    </div>
  );
}

export const ApplicationRow: FunctionComponent = (props) => (
  <div className="row sd-form__row">
    {props.children}
  </div>
);

export const ApplicationCol: FunctionComponent<ApplicationColProps> = (props) => (
  <div className={props.className}>
    {props.children}
  </div>
);

export function createColumn(size: string, ...content: any[]) {
  return (
    <div className={size}>
      {content}
    </div>
  );
}

export function createError(text: string) {
  return (
    <div className="sd-form__error">
      <strong><i className="fa fa-exclamation-triangle" /> </strong>
      {text}
    </div>
  );
}

export function errorClass(className: string, touched: boolean, error: boolean) {
  return className + (touched && error ? ' ' + 'sd-form__input--error' : '');
}

export const errorTextInput: React.StatelessComponent<CustomFieldProps> = ({ input, className, placeholder, type,
                                                                             meta: { touched, error } }) => {
  const errorClassName = errorClass(className, touched, error);
  return (
    <div>
      <input
        {...input}
        className={errorClassName}
        placeholder={placeholder}
        type={type}
      />
      {touched && error && createError(error)}
    </div>
  );
};

export const errorRadio: React.StatelessComponent<CustomFieldProps> = ({ input, className, label, defaultVal }) => {
  return (
    <div className="form-check form-check-inline">
      <label className="form-check-label">
        <input
          {...input}
          className={className}
          type="radio"
          value={defaultVal}
          checked={input.value === defaultVal}
        />
        {label}
      </label>
    </div>
  );
};

export const errorTextArea: React.StatelessComponent<CustomFieldProps> = ({ input, className, placeholder, maxLength,
                                                                            meta: { touched, error } }) => {
  const errorClassName = errorClass(className, touched, error);
  return (
    <div>
      <textarea
        {...input}
        className={errorClassName}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      {touched && error && createError(error)}
    </div>
  );
};

export const errorMonthPicker: React.StatelessComponent<CustomFieldProps> = ({ input, className,
                                                                               meta: { touched, error } }) => {
  const errorClassName = errorClass(className, touched, error);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December',
  ];

  return (
    <div>
      <select
        {...input}
        className={errorClassName}
      >
        <option key={-1}>Month</option>
        {months.map((month, i) => (
          <option key={i} value={i + 1}>
            {month}
          </option>),
        )}
      </select>
      {touched && error && createError(error)}
    </div>
  );
};

export const errorTShirtSizePicker: React.StatelessComponent<CustomFieldProps> = ({ input, className, type,
                                                                                    meta: { touched, error } }) => {
  const errorClassName = errorClass(className, touched, error);
  const sizes = Object.values(UserShirtSizeOptions);
  const values = Object.keys(UserShirtSizeOptions);

  return (
    <div>
      <select
        {...input}
        className={errorClassName}
      >
        <option key={-1} />
        {sizes.map((size, i) =>
          <option key={i} value={values[i]}>{size}</option>)}
      </select>
      {touched && error && createError(error)}
    </div>
  );
};

export const errorGenderPicker: React.StatelessComponent<CustomFieldProps> = ({ input, className, type,
                                                                                meta: { touched, error } }) => {
  const errorClassName = errorClass(className, touched, error);

  return (
    <div>
      <select
        {...input}
        className={errorClassName}
      >
        <option key={-1} />
        {UserGenderOptions.map((gender, i) =>
          <option key={i} value={gender}>{gender}</option>)}
      </select>
      {touched && error && createError(error)}
    </div>
  );
};

export const errorDiversityOptions: React.StatelessComponent<CustomFieldProps> = ({ input, className, type,
                                                                                    meta: { touched, error } }) => {
  const errorClassName = errorClass(className, touched, error);

  return (
    <div>
      <select
        {...input}
        className={errorClassName}
      >
        <option key={-1} />
        {UserDiversityOptions.map((opt, i) =>
          <option key={i} value={opt}>{opt}</option>)}
      </select>
      {touched && error && createError(error)}
    </div>
  );
};

export const errorYearPicker: React.StatelessComponent<CustomFieldProps> = ({ input, className, type,
                                                                              meta: { touched, error } }) => {
  const errorClassName = errorClass(className, touched, error);

  return (
    <div>
      <select
        {...input}
        className={errorClassName}
      >
        <option key={-1} />
        {UserYearOptions.map((year, i) =>
          <option key={i} value={year}>{year}</option>)}
      </select>
      {touched && error && createError(error)}
    </div>
  );
};

export const errorMajorPicker: React.StatelessComponent<CustomFieldProps> = ({ input, className, type,
                                                                               meta: { touched, error } }) => {
  const errorClassName = errorClass(className, touched, error);

  return (
    <div>
      <select
        {...input}
        className={errorClassName}
      >
        <option key={-1} />
        {majors.map((major, i) =>
          <option key={i} value={major}>{major}</option>)}
      </select>
      {touched && error && createError(error)}
    </div>
  );
};

export const ApplicationLabel: FunctionComponent<ApplicationLabelProps> =
  ({required = true, className = '', forTag = '', children}) => (
    <label
      className={'sd-form__label ' + (required ? 'sd-form__required ' + className : className)}
      htmlFor={forTag}
    >
      <>{children}</>
    </label>
);

export function createLabel(text: string, required: boolean = true, className: string = '',
  forTag: string = '') {
  return (
    <label
      className={'sd-form__label ' + (required ? 'sd-form__required ' + className : className)}
      htmlFor={forTag}
    >
      {text}
    </label>
  );
}

export const ApplicationInput: React.StatelessComponent<ApplicationInputProps> = ({
  className = 'sd-form__input-text' ,
  name,
  type = 'text',
  normalize,
  placeholder,
}) => (
  <Field
    className={className}
    name={name}
    component={errorTextInput}
    type={type}
    normalize={normalize}
    placeholder={placeholder}
  />
);

export function createInput(name: string, placeholder: string, type: string = 'text',
  className: string = 'sd-form__input-text',
  normalize: (value: any, previousValue: any) => void = null) {
  return (
    <Field
      className={className}
      name={name}
      component={errorTextInput}
      placeholder={placeholder}
      type={type}
      normalize={normalize}
    />
  );
}

export const ApplicationTextArea: React.FunctionComponent<ApplicationTextAreaProps> =
  ({className = 'sd-form__input-textarea', name, maxLength = null, placeholder}) => (
    <Field
      className={className}
      name={name}
      maxLength={maxLength}
      component={errorTextArea}
      placeholder={placeholder}
    />
);

export function createMonthPicker(name: string = null) {
  return (
    <Field
      component={errorMonthPicker}
      className="sd-form__input-select mb-1 mb-md-0"
      name={`${name || 'birthdateMonth'}`}
    />
  );
}

export function createGenderPicker() {
  return (
    <Field
      component={errorGenderPicker}
      className="sd-form__input-select"
      name="gender"
    />
  );
}

export function createDiversityOptions() {
  return (
    <Field
      component={errorDiversityOptions}
      className="sd-form__input-select"
      name="race"
    />
  );
}

export function createTShirtSizePicker() {
  return (
    <Field
      component={errorTShirtSizePicker}
      className="sd-form__input-select"
      name="shirtSize"
    />
  );
}

export function createYearPicker() {
  return (
    <Field
      component={errorYearPicker}
      className="sd-form__input-select"
      name="year"
    />
  );
}

export function createMajorPicker() {
  return (
    <Field
      component={errorMajorPicker}
      className="sd-form__input-select"
      name="major"
    />
  );
}

export const ApplicationRadio: FunctionComponent<ApplicationRadioProps> =
  ({className = 'sd-form__input-radio', name, value, label}) => (
    <Field
      component={errorRadio}
      className={className}
      name={name}
      defaultVal={String(value)}
      label={label}
    />
);
