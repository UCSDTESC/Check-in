import {Field, reduxForm, InjectedFormProps} from 'redux-form';
import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';
import {Alert, UncontrolledAlert} from 'reactstrap';

import NavHeader from '~/components/NavHeader';
import { AlertType } from '~/pages/AlertPage';

const form = reduxForm<ResetFormData, ResetProps>({
  form: 'userReset',
});

interface ResetFormData {
}

interface ResetProps {
  errorMessage: string;
  successMessage: string;
}

type Props = InjectedFormProps<ResetFormData, ResetProps> & ResetProps;

interface ResetState {
  isErrorVisible: boolean;
}

class Reset extends React.Component<Props, ResetState> {
  state: Readonly<ResetState> = {
    isErrorVisible: false,
  };

  componentDidReceiveProps(newProps: Props) {
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
   * Creates a new error alert if there was a request error.
   * @returns {Component}
   */
  renderErrorAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="user-login__error">
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

  /**
   * Creates a new success alert if the request was successful.
   * @returns {Component}
   */
  renderSuccessAlert() {
    if (this.props.successMessage) {
      return (
        <div className="user-login__error">
          <UncontrolledAlert color="success">
            {this.props.successMessage}
          </UncontrolledAlert>
        </div>
      );
    }
  }

  render() {
    const {pristine, submitting} = this.props;

    return (
      <form
        className="user-login"
        onSubmit={this.props.handleSubmit}
      >
        <div className="user-login__above">
          <div className="user-login__alerts">
            {this.renderErrorAlert()}
            {this.renderSuccessAlert()}
          </div>
          <NavHeader />
        </div>
        <div className="user-login__container sd-form">
          <div className="user-login__username row sd-form__row">
            <div className="col-12">
              <label>New Password</label>
              <Field
                name="password"
                component="input"
                type="password"
                className="form-control sd-form__input-text"
                placeholder="Password"
              />
            </div>
          </div>
          <div className="user-login__username row sd-form__row">
            <div className="col-12">
              <label>Repeat New Password</label>
              <Field
                name="passwordRepeat"
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
                className="btn rounded-button rounded-button--small user-login__button"
                disabled={pristine || submitting}>
                Reset My Password
              </button>
            </div>
          </div>
        </div>
        <div className="user-login__below">
          <div className="row sd-form__row">
            <div className="col-12">
              <Link
                to="/user/login"
                className="sd-link__underline user-login__forgot"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default form(Reset);
