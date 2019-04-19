import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { UncontrolledAlert } from 'reactstrap';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';

const form = reduxForm<LoginFormData, LoginProps>({
  form: 'adminLogin',
});

export interface LoginFormData {
  username: string;
  password: string;
}

interface LoginProps {
  loginUser: (user: LoginFormData) => Promise<{}>;
  errorMessage: string;
}

type Props = InjectedFormProps<LoginFormData, LoginProps> & RouteComponentProps & LoginProps;

class Login extends React.Component<Props> {
  /**
   * Handles the validated form data, and logs the user in.
   * @param {Object} formProps The validated form data.
   */
  handleFormSubmit = (formProps: LoginFormData) => {
    this.props.loginUser(formProps)
      .catch((e) => {
        console.error('Could not log in', e);
      });
  }

  /**
   * Creates a new error alert if there was a login error
   * @returns {Component}
   */
  renderAlert = () => {
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
      <form
        className="sd-form admin-login"
        onSubmit={handleSubmit(this.handleFormSubmit)}
      >
        <div className="admin-login__background" />
        <div className="admin-login__above">
          {this.renderAlert()}
        </div>
        <div className="admin-login__container">
          <div className="admin-login__username">
            Username
            <Field
              name="username"
              className={`form-control rounded-input
              rounded-input--small rounded-input--full admin-login__input`}
              component="input"
              type="text"
              placeholder="Username"
            />
          </div>
          <div className="admin-login__password">
            Password
            <Field
              name="password"
              className={`form-control rounded-input
              rounded-input--small rounded-input--full admin-login__input`}
              component="input"
              type="password"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            className={`btn rounded-button rounded-button--small rounded-button--full`}
          >
            Login
          </button>
        </div>
        <div className="admin-login__below" />
      </form>
    );
  }
}

export default form(Login);
