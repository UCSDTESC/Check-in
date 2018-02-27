import {Field, SubmissionError, reduxForm} from 'redux-form';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {UncontrolledAlert} from 'reactstrap';

import {registerUser} from './actions';

const form = reduxForm({
  form: 'adminRegister',
  validate
});

const renderField = ({input, type, meta}) =>
  (<div>
    <input className="form-control" type={type} {...input}/>
    {meta && meta.touched && meta.error &&
      <div className="error">{meta.error}</div>}
  </div>);

renderField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  meta: PropTypes.object
};

/**
 * Validated the raw form data for errors.
 * @param {Object} formProps The unvalidated form data.
 * @returns {Object} The errors with the key as the form input name and value
 * as the error.
 */
function validate(formProps) {
  const errors = {};

  if (!formProps.username) {
    errors.username = 'Please enter an username';
  }

  if (!formProps.password) {
    errors.password = 'Please enter a password';
  }

  return errors;
}

class RegisterPage extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    registerUser: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    errorMessage: PropTypes.string
  };

  /**
   * Handles the validated form data and registers the new administrator.
   * @param {Object} formProps The validated form data.
   */
  handleFormSubmit(formProps) {
    this.props.registerUser(formProps)
      .then(() => {
        console.log('Registered!');
        this.context.router.push('/admin/dashboard');
      })
      .catch(() => {
        throw new SubmissionError({_error: 'Registration failed'});
      });
  }

  /**
   * Creates a new error alert if there was an error during registration.
   * @returns {Component}
   */
  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <UncontrolledAlert color="danger" transitionLeaveTimeout={5}>
          Error <strong>{this.props.errorMessage}</strong>
        </UncontrolledAlert >
      );
    }
  }

  render() {
    const {handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        {this.renderAlert()}

        <div className="row">
          <div className="col-md-12">
            <label>Username</label>
            <Field name="username" className="form-control" type="text"
              component={renderField} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <label>Password</label>
            <Field name="password" className="form-control" type="password"
              component={renderField} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.admin.auth.error,
    message: state.admin.auth.message
  };
}

export default connect(mapStateToProps, {registerUser})(form(RegisterPage));
