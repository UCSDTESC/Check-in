import {Field, reduxForm} from 'redux-form';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import {Alert, UncontrolledAlert} from 'reactstrap';

import NavHeader from '~/components/NavHeader';

const form = reduxForm({
  form: 'userLogin'
});

class Login extends React.Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  static propTypes = {
    loginUser: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
    alerts: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    }).isRequired).isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isErrorVisible: false
    };
  }

  componentWillReceiveProps(newProps) {
    // Show error message if new one appears
    if (newProps.errorMessage) {
      this.setState({
        isErrorVisible: true
      });
    }
  }

  dismissError = () => this.setState({
    isErrorVisible: false
  });

  /**
   * Handles the validated form data, and logs the user in.
   * @param {Object} formProps The validated form data.
   */
  handleFormSubmit(formProps) {
    this.props.loginUser(formProps);
  }

  /**
   * Creates a new alert at the top of the page.
   * @param {String} type The type of alert to display.
   * @param {String} text The text of the alert.
   * @return {Component}
   */
  renderAlert(type, text) {
    return (
      <div key={text} className="user-login__alert">
        <UncontrolledAlert color={type}>
          {text}
        </UncontrolledAlert>
      </div>
    );
  }

  /**
   * Creates a new error alert if there was a login error.
   * @returns {Component}
   */
  renderErrorAlert() {
    if (this.props.errorMessage) {
      return (
        <div className="user-login__error user-login__alert">
          <Alert color="danger" isOpen={this.state.isErrorVisible}
            toggle={this.dismissError}>
            {this.props.errorMessage}
          </Alert>
        </div>
      );
    }
  }

  render() {
    const {handleSubmit, alerts} = this.props;

    return (
      <form className="user-login"
        onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
        <div className="user-login__above">
          <div className="user-login__alerts">
            {this.renderErrorAlert()}
            {alerts.map(({type, text}) => this.renderAlert(type, text))}
          </div>
          <NavHeader title="Login" />
        </div>
        <div className="user-login__container sd-form">
          <div className="user-login__username row sd-form__row">
            <div className="col-12">
              <label>Email</label>
              <Field name="email" component="input" type="email"
                className="form-control sd-form__input-text"
                placeholder="email@ucsd.edu" />
            </div>
          </div>
          <div className="user-login__password row sd-form__row">
            <div className="col-12">
              <label>Password</label>
              <Field name="password" component="input" type="password"
                className="form-control sd-form__input-text"
                placeholder="Password" />
            </div>
          </div>
          <div className="row sd-form__row">
            <div className="col-12">
              <button type="submit" className={`btn rounded-button
                rounded-button--small user-login__button`}>
                Login
              </button>
            </div>
          </div>
        </div>
        <div className="user-login__below">
          <div className="row sd-form__row">
            <div className="col-12">
              <Link to="/register/hackxx" className={`btn rounded-button
                rounded-button--secondary rounded-button--small
                user-login__apply`}>
                I don‘t have an account, I still need to apply
              </Link>
            </div>
          </div>
          <div className="row sd-form__row">
            <div className="col-12">
              <Link to="/user/forgot"
                className="sd-link__underline user-login__forgot">
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
