import {Field, reduxForm} from 'redux-form';
import React from 'react';
import PropTypes from 'prop-types';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {default as UUID} from 'node-uuid';

import {User as UserPropType} from '~/proptypes';

import {getRole, Roles} from '~/static/Roles';

import CheckboxButton from './CheckboxButton';

class User extends React.Component {
  static propTypes = {
    user: PropTypes.shape(
      UserPropType
    ).isRequired,
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    resume: PropTypes.object,
    role: PropTypes.string.isRequired
  };

  handleFormSubmit(formProps) {
    return formProps;
  }

  /**
   * Create a download resume button with associated label.
   * @returns {Component[]} The components to render.
   */
  renderResume() {
    return [
      <label key="0" className="col-sm-3 col-form-label">
        Download Resume
      </label>,
      <div key="1" className="col-sm-3">
        <a className="btn btn-primary form-control"
          role="button" target="_blank"
          disabled={!this.props.resume} href={this.props.resume.url}>
          View
        </a>
      </div>
    ];
  }

  /**
   *
   * @param {String} label The label of the checkbox.
   * @param {String} value The name of the checkbox input.
   * @param {String} [fieldSize=col-sm-10] The class name of the input.
   * @param {String} [labelSize =col-sm-4] The class name of the label.
   * @returns {Component[]} The components to render.
   */
  renderFormCheckbox(label, value, fieldSize = 'col-sm-10',
    labelSize='col-sm-2') {
    return [
      <label key="0" className={labelSize + ' col-form-label'}>{label}</label>,
      <div key="1" className={fieldSize + ' btn-group'} data-toggle="buttons">
        <Field component={CheckboxButton} name={value} />
      </div>];
  }

  /**
   *
   * @param {String} label The label of the input field.
   * @param {String} value The name of the input field.
   * @param {String} [fieldSize=col-sm-10] The class name of the input.
   * @param {String} [fieldType=text] The input type.
   * @param {String} [labelSize=col-sm-4] The class name of the label.
   */
  renderFormField(label, value, fieldSize = 'col-sm-4',
    fieldType = 'text', labelSize = 'col-sm-2') {
    return [
      <label key="0" className={labelSize + ' col-form-label'}>{label}</label>,
      <div key="1" className={fieldSize}>
        <Field name={value} className="form-control"
          component="input" type={fieldType} />
      </div>];
  }

  render() {
    const {handleSubmit, pristine, reset, submitting} = this.props;

    return (
      <div>
        <h3>User <small>{this.props.user._id}</small></h3>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-6">
              <h5>Login Information</h5>
              <div className="form-group row mb-2">
                {this.renderFormField('Username', 'username')}
                {this.renderFormField('Email', 'email')}
              </div>
              <h5>Portfolio</h5>
              <div className="form-group row mb-2">
                {this.renderFormField('Github', 'github')}
                {this.renderFormField('Website', 'website')}
              </div>
              {this.props.resume &&
              <span>
                <h5>Resume</h5>
                <div className="form-group row mb-2">
                  {this.renderResume()}
                  {this.renderFormCheckbox('Share Resume', 'shareResume',
                    'col-sm-4')}
                </div>
              </span>}
              <h5>Travel</h5>
              <div className="form-group row mb-2">
                {this.renderFormCheckbox('Out Of State', 'travel.outOfState',
                  'col-sm-4')}
                {this.renderFormField('Coming From', 'travel.city')}
              </div>
              {getRole(this.props.role) >= getRole(Roles.ROLE_ADMIN) &&
                <span>
                  <h5>Admin Flags</h5>
                  <div className="form-group row mb-2">
                    {this.renderFormCheckbox('Confirmed', 'confirmed',
                      'col-sm-4')}
                    {this.renderFormCheckbox('Checked In', 'checkedIn',
                      'col-sm-4')}
                    {this.renderFormCheckbox('Bussing', 'bussing', 'col-sm-4')}
                    {this.renderFormCheckbox('Sanitized', 'sanitized',
                      'col-sm-4')}
                    {this.renderFormField('Status', 'status', 'col-sm-4')}
                  </div>
                </span>
              }
            </div>
            <div className="col-6">
              <h5>Personal Details</h5>
              <div className="form-group row mb-2">
                {this.renderFormField('First Name', 'firstName', 'col-sm-4')}
                {this.renderFormField('Last Name', 'lastName', 'col-sm-4')}
                {this.renderFormField('Gender', 'gender', 'col-sm-4')}
                {this.renderFormField('Birthdate', 'birthdate', 'col-sm-4')}
                {this.renderFormField('Year', 'year', 'col-sm-4')}
                {this.renderFormField('Phone', 'phone', 'col-sm-4', 'tel')}
                {this.renderFormField('University', 'university', 'col-sm-4')}
                {this.renderFormField('Major', 'major', 'col-sm-4')}
                {this.renderFormField('Shirt Size', 'shirtSize', 'col-sm-4')}
                {this.renderFormField('Diet', 'diet', 'col-sm-4')}
                {this.renderFormField('Food', 'food', 'col-sm-4')}
              </div>
              <button type="submit"
                className="btn rounded-button rounded-button--small"
                disabled={pristine || submitting}>Apply</button>
              <button type="button" disabled={pristine || submitting}
                className={`btn rounded-button rounded-button--small
                  rounded-button--secondary`} onClick={reset}>
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

// Sets the form name to the id of the user
const mapStateToProps = (state, ownProps) => {
  return {
    resume: ownProps.user.resume ? ownProps.user.resume : null,
    //form: ownProps.user._id,
    role: state.admin.auth.user.role
  };
};

export default compose(
  connect(mapStateToProps),
  reduxForm({
    form: UUID.v4(),
    destroyOnUnmount: true,
    enableReinitialize: true
  })
)(User);
