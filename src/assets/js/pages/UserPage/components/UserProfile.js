import React from 'react';
import PropTypes from 'prop-types';
import {Field, reduxForm} from 'redux-form';

import FileField from '~/components/FileField';

class UserProfile extends React.Component {
  static propTypes = {
    pristine: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    toggleRSVP: PropTypes.func.isRequired,

    user: PropTypes.object.isRequired
  };

  genderSelect = ({input, className}) => {
    let genders = [
      'Male', 'Female', 'Non-Binary', 'Transgender',
      'I prefer not to say', 'Other'
    ];

    return (<select {...input} className={className}>
      {genders.map((gender, i) =>
        <option key={i} value={gender}>{gender}</option>)}
    </select>);
  };

  shirtSizeSelect = ({input, className}) => {
    let sizes = [
      'Small', 'Medium', 'Large', 'X-Large', 'XX-Large'
    ];
    let values = [
      'S', 'M', 'L', 'XL', 'XXL'
    ];

    return (<select {...input} className={className}>
      {sizes.map((size, i) =>
        <option key={i} value={values[i]}>{size}</option>)}
    </select>);
  };

  /**
   * Renders the status for the navigation bar.
   * @param {String} status The status of the user in the database.
   * @returns {Component}
   */
  renderUserStatus(status) {
    // If there is no status
    if (!status) {
      status = 'Applied';
    }
    let button = <span></span>;

    switch (status) {
    case ('Unconfirmed'):
      button = (<button type="button" className={`btn rounded-button
        rounded-button--small rounded-button--short user-profile__rsvp`}
        onClick={this.props.toggleRSVP}>
        RSVP
      </button>);
    };

    let statusText = status;
    switch (status) {
    case ('Declined'):
    case ('Rejected'):
      statusText = 'Not Attending';
      break;
    case ('Confirmed'):
      statusText = 'Attending';
      break;
    case ('Waitlisted'):
      statusText = 'On Waitlist';
      break;
    }

    return (<span>
      Status:{' '}
      <span className={`user-profile__status
        user-profile__status--${status.toLowerCase()}`}>
        {statusText}
      </span>
      {button}
    </span>);
  }

  /**
   * Renders the bussing status for the current user.
   * @param {Object} user The current user to render for.
   * @returns {Component}
   */
  renderUserBussing = (user) => {
    if (user.status !== 'Confirmed') {
      return <span></span>;
    }

    let statusClass = 'user-profile__bussing user-profile__bussing--';

    if (!user.availableBus) {
      return (<span>Bussing:&nbsp;
        <span className={statusClass + 'unavailable'}>
          Not Available
        </span>
      </span>);
    }

    return (<span>Bussing:&nbsp;
      <span className={statusClass + (user.bussing ? 'confirmed' : 'declined')}>
        {user.bussing ? user.availableBus : 'Declined'}
      </span>
    </span>);
  }

  renderPhoneNumber = (phone) => (
    phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
  );

  renderApplicantInfoSection = (user) => (
    <div className="user-profile__section">
      <h4>Applicant Info</h4>
      If you&#39;ve made a mistake in this section, please{' '}
      <a href="mailto:nick.thomson@tesc.ucsd.edu"
        className="sd-link__underline">
        email us
      </a>{' '}
      to request a change.

      <div className="user-profile__school row">
        <div className="col-4 col-md-6 col-lg-3">
          <img className="user-profile__school-image"
            src="/img/site/featurette-ucsd.svg" />
        </div>
        <div className="col-8 col-md-6 col-lg-9 user-profile__school-info">
          <div>School: </div>
          <div className="user-profile__school-name">
            {user.university}
          </div>
        </div>
      </div>

      <div className="user-profile__email">
        Email: {user.email}
      </div>
      <div className="user-profile__phone">
        Phone: {this.renderPhoneNumber(String(user.phone))}
      </div>
    </div>
  );

  renderDesiredTeammatesSection = () => (
    <div className="user-profile__section sd-form">
      <h4>Desired Teammates</h4>
      <Field component="input" name="teammates[0]" type="email"
        className={`sd-form__input-text user-profile__input
        user-profile__teammate`}
        placeholder="teammate@email.io"/>
      <Field component="input" name="teammates[1]" type="email"
        className={`sd-form__input-text user-profile__input
        user-profile__teammate`}
        placeholder="teammate@email.io"/>
      <Field component="input" name="teammates[2]" type="email"
        className={`sd-form__input-text user-profile__input
        user-profile__teammate`}
        placeholder="teammate@email.io"/>
    </div>
  );

  renderPreferencesSection = (user) => (
    <div className="user-profile__section sd-form">
      <h4>Preferences</h4>
      <h5>Food Preferences:</h5>
      <Field component="input" type="text" name="food"
        className={`sd-form__input-text user-profile__input
        user-profile__food`}
        placeholder="Soylent only"/>
      <h5>Dietary Restrictions:</h5>
      <Field component="input" name="diet" type="text"
        className={`sd-form__input-text user-profile__input
        user-profile__diet`}
        placeholder="No Soylent"/>
      <div className="row mt-3">
        <div className="col-lg-6 mb-3">
          <h5>Gender:</h5>
          <Field component={this.genderSelect} name="gender"
            className="sd-form__input-select user-profile__select" />
        </div>
        <div className="col-lg-6 mb-3">
          <h5>T-Shirt Size (Unisex):</h5>
          <Field component={this.shirtSizeSelect} name="shirtSize"
            className="sd-form__input-select user-profile__select" />
        </div>
        <div className="col-lg-6 mb-3">
          <h5>Github Username:</h5>
          <Field component="input" name="github" type="text"
            className={`sd-form__input-text user-profile__input
            user-profile__github`}
            placeholder="GithubUser" />
        </div>
        <div className="col-lg-6 mb-3">
          <h5>Personal Website:</h5>
          <Field component="input" type="text" name="website"
            className={`sd-form__input-text user-profile__input
            user-profile__website`}
            placeholder="https://www.tesc.events/" />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-lg-6">
          <a tabIndex="-1" href={user.resume ? user.resume.url : ''} download
            className="btn rounded-button rounded-button--small">
            View Current Resume
          </a>
        </div>
        <div className="col-lg-6 mt-3 mt-lg-0">
          <Field component={FileField} name="resume"
            placeholder="Resume" button className="sd-form__dropzone--button"
            secondary text="Upload New Resume"/>
        </div>
      </div>
      <div className="mt-4 user-profile__sharing">
        <Field component="input" type="checkbox" name="shareResume"
          className="sd-form__input-checkbox" />
        Share my resume and personal information so that companies
        may contact me about job opportunities.
      </div>
    </div>
  );

  render() {
    let {user, pristine, submitting, handleSubmit} = this.props;

    return (
      <form className="user-profile" onSubmit={handleSubmit}>
        <div className="user-profile__header">
          <div className="user-profile__hello row">
            <div className={`order-1 order-md-2 col-md-2 col-lg-4
              user-profile__status-box`}>
              {this.renderUserBussing(user)}
              {this.renderUserStatus(user.status)}
            </div>

            <h1 className="order-2 order-md-1 col-md-10 col-lg-8">
              Hello, <span className="user-profile__name">
                {user.firstName} {user.lastName}
              </span>!
            </h1>
          </div>
          <div className={`user-profile__apply ${pristine ?
            'user-profile__apply--hidden' : ''}`}>
            <input type="submit" value="Update"
              className="btn rounded-button rounded-button--small mb-3 mb-md-0"
              disabled={pristine || submitting} />
          </div>
        </div>

        <div className="user-profile__form">
          <div className="user-profile__column user-profile__column--left">
            {this.renderApplicantInfoSection(user)}
            {this.renderDesiredTeammatesSection()}
          </div>
          <div className="user-profile__column user-profile__column--right">
            {this.renderPreferencesSection(user)}
          </div>
        </div>
      </form>
    );
  }
};

export default reduxForm({
  form: 'userProfile',
  enableReinitialize : true
})(UserProfile);
