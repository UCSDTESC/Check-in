import {Field, reduxForm} from 'redux-form';
import PropTypes from 'prop-types';
import React from 'react';
import {UncontrolledAlert} from 'reactstrap';

const form = reduxForm({
  form: 'adminLogin'
});

class Login extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    loginUser: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
  };

  /**
   * Handles the validated form data, and logs the user in.
   * @param {Object} formProps The validated form data.
   */
  handleFormSubmit(formProps) {
    return this.props.loginUser(formProps)
      .catch((e) => {
        console.error('Could not log in', e);
      });
  }

  /**
   * Creates a new error alert if there was a login error
   * @returns {Component}
   */
  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="admin-login__error">
          <UncontrolledAlert color="danger">
            <strong>{this.props.errorMessage}</strong>
          </UncontrolledAlert>
        </div>
      );
    }
  }

  render() {
    const {handleSubmit} = this.props;

    return (
      <form className="sd-form admin-login"
        onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <div className="admin-login__background">
        </div>
        <div className="admin-login__above">
          {this.renderAlert()}
        </div>
        <div className="admin-login__container">
          <div className="admin-login__username">
            Username
            <Field name="username" className={`form-control rounded-input
              rounded-input--small rounded-input--full admin-login__input`}
              component="input" type="text" placeholder="Username" />
          </div>
          <div className="admin-login__password">
            Password
            <Field name="password" className={`form-control rounded-input
              rounded-input--small rounded-input--full admin-login__input`}
              component="input" type="password" placeholder="Password" />
          </div>
          <button type="submit" className={`btn rounded-button
            rounded-button--small rounded-button--full`}>
            Login
          </button>
        </div>
        <div className="admin-login__below">
        </div>
      </form>
    );
  }
}

export default form(Login);
