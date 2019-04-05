import {Field, reduxForm, InjectedFormProps} from 'redux-form';
import {Link, RouteComponentProps} from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import {Alert, UncontrolledAlert} from 'reactstrap';

import NavHeader from '~/components/NavHeader';
import { PageAlert, AlertType } from '~/pages/AlertPage';

const form = reduxForm<LoginFormData, LoginProps>({
  form: 'userLogin',
});

export interface LoginFormData {
  email: string;
  password: string;
}

interface LoginProps {
  loginUser: (user: LoginFormData) => Q.Promise<void>;
  errorMessage: string;
  alerts: PageAlert[];
}

type Props = InjectedFormProps<LoginFormData, LoginProps> & RouteComponentProps & LoginProps;

interface LoginState {
  isErrorVisible: boolean;
}

class Login extends React.Component<Props, LoginState> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  state: Readonly<LoginState> = {
    isErrorVisible: false,
  };

  componentDidUpdate(newProps: Props) {
    // Show error message if new one appears
    if (newProps.errorMessage) {
      this.setState({
        isErrorVisible: true,
      });
    }
  }

  dismissError = () => this.setState({
    isErrorVisible: false,
  });

  /**
   * Handles the validated form data, and logs the user in.
   * @param {Object} formProps The validated form data.
   */
  handleFormSubmit = (formProps: LoginFormData) => {
    this.props.loginUser(formProps);
  }

  renderAlert = (alert: PageAlert) => {
    return (
      <div key={alert.message} className="user-login__alert">
        <UncontrolledAlert color={alert.type}>
          {alert.message}
        </UncontrolledAlert>
      </div>
    );
  }

  /**
   * Creates a new error alert if there was a login error.
   * @returns {Component}
   */
  renderErrorAlert = () => {
    if (this.props.errorMessage) {
      return (
        <div className="user-login__error user-login__alert">
          <Alert
            color={AlertType.Danger}
            isOpen={this.state.isErrorVisible}
            toggle={this.dismissError}
          >
            {this.props.errorMessage}
          </Alert>
        </div>
      );
    }
  }

  render() {
    const {handleSubmit, alerts} = this.props;

    return (
      <form
        className="user-login"
        onSubmit={handleSubmit(this.handleFormSubmit)}
      >
        <div className="user-login__above">
          <div className="user-login__alerts">
            {this.renderErrorAlert()}
            {alerts.map(this.renderAlert)}
          </div>
          <NavHeader title="Login" />
        </div>
        <div className="user-login__container sd-form">
          <div className="user-login__username row sd-form__row">
            <div className="col-12">
              <label>Email</label>
              <Field
                name="email"
                component="input"
                type="email"
                className="form-control sd-form__input-text"
                placeholder="email@ucsd.edu"
              />
            </div>
          </div>
          <div className="user-login__password row sd-form__row">
            <div className="col-12">
              <label>Password</label>
              <Field
                name="password"
                component="input"
                type="password"
                className="form-control sd-form__input-text"
                placeholder="Password"
              />
            </div>
          </div>
          <div className="row sd-form__row">
            <div className="col-12">
              <button
                type="submit"
                className="btn rounded-button rounded-button--small user-login__button">
                Login
              </button>
            </div>
          </div>
        </div>
        <div className="user-login__below">
          <div className="row sd-form__row">
            <div className="col-12">
              <Link
                to="/user/forgot"
                className="sd-link__underline user-login__forgot"
              >
                Forgot your password?
              </Link>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default form(Login);
