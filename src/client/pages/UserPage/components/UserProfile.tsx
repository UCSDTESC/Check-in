import { TESCUser, TESCEvent, TESCTeam } from '@Shared/ModelTypes';
import { UserStatus } from '@Shared/UserStatus';
import React from 'react';
import { Field, reduxForm, InjectedFormProps, WrappedFieldProps } from 'redux-form';
import { CustomFieldProps } from '~/components/Fields';
import FileField from '~/components/FileField';

export interface UserProfileFormData {
  gender: string;
  pronoun: string;
  newResume: File[];
  shareResume: boolean;
  majorGPA: string;
  gpa: string;
  website: string;
  github: string;
  shirtSize: string;
  diet: string;
  food: string;
}

interface UserProfileProps {
  user: TESCUser;
  event: TESCEvent;
  toggleRSVP: () => void;
}

type Props = InjectedFormProps<UserProfileFormData, UserProfileProps> & UserProfileProps;

class UserProfile extends React.Component<Props> {
  genderSelect: React.StatelessComponent<CustomFieldProps> = ({ input, className }) => {
    const genders = [
      'Male', 'Female', 'Non-Binary', 'Transgender',
      'I prefer not to say', 'Other',
    ];

    return (
      <select {...input} className={className}>
        {genders.map((gender, i) =>
          <option key={i} value={gender}>{gender}</option>)}
      </select>
    );
  };

  pronounSelect: React.StatelessComponent<CustomFieldProps> = ({ input, className }) => {
    const pronouns = [
      'He/Him/His', 'She/Her/Hers', 'They/Them/Theirs',
      'I prefer not to say', 'Other',
    ];

    return (
      <select {...input} className={className}>
        {pronouns.map((pronoun, i) =>
          <option key={i} value={pronoun}>{pronoun}</option>)}
      </select>
    );
  };

  shirtSizeSelect: React.StatelessComponent<CustomFieldProps> = ({ input, className }) => {
    const sizes = [
      'Small', 'Medium', 'Large', 'X-Large', 'XX-Large',
    ];
    const values = [
      'S', 'M', 'L', 'XL', 'XXL',
    ];

    return (
      <select {...input} className={className}>
        {sizes.map((size, i) =>
          <option key={i} value={values[i]}>{size}</option>)}
      </select>
    );
  };

  /**
   * Renders the status for the navigation bar.
   * @param {String} status The status of the user in the database.
   * @returns {Component}
   */
  renderUserStatus(status: UserStatus) {
    let statusText: string = status;

    let button = <span />;

    if (status === UserStatus.Unconfirmed) {
      button = (
        <button
          type="button"
          className={`btn rounded-button
          rounded-button--small rounded-button--short user-profile__rsvp`}
          onClick={this.props.toggleRSVP}
        >
          RSVP
        </button>
      );
    }

    switch (status) {
      case (UserStatus.Declined):
      case (UserStatus.Rejected):
        statusText = 'Not Attending';
        break;
      case (UserStatus.Confirmed):
        statusText = 'Attending';
        break;
      case (UserStatus.Waitlisted):
        statusText = 'On Waitlist';
        break;
      case (UserStatus.NoStatus):
        statusText = 'Applied';
    }

    return (
      <span>
        Status:{' '}
        <span
          className={`user-profile__status
        user-profile__status--${status.toLowerCase()}`}
        >
          {statusText}
        </span>
        {button}
      </span>
    );
  }

  /**
   * Renders the bussing status for the current user.
   * @param {Object} user The current user to render for.
   * @returns {Component}
   */
  renderUserBussing = (user: TESCUser) => {
    if (user.status !== UserStatus.Confirmed) {
      return <span />;
    }

    const statusClass = 'user-profile__bussing user-profile__bussing--';

    if (!user.availableBus) {
      return (
        <span>Bussing:{' '}
          <span className={statusClass + 'unavailable'}>
            Not Available
        </span>
        </span>
      );
    }

    return (
      <span>Bussing: {' '}
        <span className={statusClass + (user.bussing ? 'confirmed' : 'declined')}>
          {user.bussing ? user.availableBus : 'Declined'}
        </span>
      </span>
    );
  }

  renderPhoneNumber = (phone: string) => (
    phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
  );

  renderApplicantInfoSection = (user: TESCUser) => {
    const institution = user.university || user.highSchool;
    return (
      <div className="user-profile__section">
        <h4>
          Hello, <span className="user-profile__name">
            {user.firstName} {user.lastName}
          </span>!
      </h4>

        If you&#39;ve made a mistake in this section, please{' '}
        <a
          href={'mailto:' + user.event.email}
          className="sd-link__underline"
        >
          email us
        </a>{' '}
        to request a change.

      <div className="user-profile__school row">
          <div className="col-4 col-md-6 col-lg-3">
            <img
              className="user-profile__school-image"
              src="/img/site/featurette-ucsd.svg"
            />
          </div>
          <div className="col-8 col-md-6 col-lg-9 user-profile__school-info">
            <div>School: </div>
            <div className="user-profile__school-name">
              {institution}
            </div>
          </div>
        </div>

        <div className="user-profile__email">
          Email: {user.account.email}
        </div>
        <div className="user-profile__phone">
          Phone: {this.renderPhoneNumber(String(user.phone))}
        </div>
      </div>
    );
  }

  renderTeamSection = (user: TESCUser) => {
    if (!user.team) {
      return <></>;
    }

    return (
      <div className="user-profile__section sd-form">
        <h4>Team <small>{user.team.code}</small></h4>
        {user.team.members
          .filter(member => !!member.account)
          .map(member => (
            <div key={member._id}>
              {`${member.firstName} ${member.lastName}`} <small className="text-muted">{member.account.email}</small>
            </div>
          ))}
      </div>
    );
  };

  renderPreferencesSection = (user: TESCUser) => (
    <div className="user-profile__section sd-form">
      <h4>Preferences</h4>
      <h5>Food Preferences:</h5>
      <Field
        component="input"
        type="text"
        name="food"
        className={`sd-form__input-text user-profile__input
        user-profile__food`}
        placeholder="Soylent only"
      />
      <h5>Dietary Restrictions:</h5>
      <Field
        component="input"
        name="diet"
        type="text"
        className={`sd-form__input-text user-profile__input
        user-profile__diet`}
        placeholder="No Soylent"
      />
      <div className="row mt-3">
        <div className="col-lg-4 mb-3">
          <h5>Gender:</h5>
          <Field
            component={this.genderSelect}
            name="gender"
            className="sd-form__input-select user-profile__select"
          />
        </div>
        <div className="col-lg-4 mb-3">
          <h5>Pronoun:</h5>
          <Field
            component={this.pronounSelect}
            name="pronoun"
            className="sd-form__input-select user-profile__select"
          />
        </div>
        <div className="col-lg-4 mb-3">
          <h5>T-Shirt Size (Unisex):</h5>
          <Field
            component={this.shirtSizeSelect}
            name="shirtSize"
            className="sd-form__input-select user-profile__select"
          />
        </div>
        <div className="col-lg-6 mb-3">
          <h5>Github Username:</h5>
          <Field
            component="input"
            name="github"
            type="text"
            className={`sd-form__input-text user-profile__input
            user-profile__github`}
            placeholder="GithubUser"
          />
        </div>
        <div className="col-lg-6 mb-3">
          <h5>Personal Website:</h5>
          <Field
            component="input"
            type="text"
            name="website"
            className={`sd-form__input-text user-profile__input
            user-profile__website`}
            placeholder="https://tesc.events/"
          />
        </div>
        {user.event.options.requireGPA &&
          <div className="col-lg-6 mb-3">
            <h5>GPA:</h5>
            <Field
              component="input"
              name="gpa"
              type="text"
              className={`sd-form__input-text user-profile__input
                user-profile__github`}
              placeholder="4.00"
            />
          </div>
        }
        {user.event.options.requireMajorGPA &&
          <div className="col-lg-6 mb-3">
            <h5>Major GPA:</h5>
            <Field
              component="input"
              name="majorGPA"
              type="text"
              className={`sd-form__input-text user-profile__input
              user-profile__github`}
              placeholder="4.00"
            />
          </div>
        }

      </div>
      <div className="row mt-4">
        {user.resume && <div className="col-lg-6">
          <a
            tabIndex={-1}
            href={user.resume ? user.resume.url : ''}
            download={true}
            className="btn rounded-button rounded-button--small"
          >
            View Current Resume
          </a>
        </div>}
        <div className="col-lg-6 mt-3 mt-lg-0">
          <Field
            component={FileField}
            name="newResume"
            placeholder="Resume"
            button={true}
            className="sd-form__dropzone--button"
            secondary={true}
            text="Upload New Resume"
          />
        </div>
      </div>
      <div className="mt-4 user-profile__sharing">
        <Field
          component="input"
          type="checkbox"
          name="shareResume"
          className="sd-form__input-checkbox"
        />
        Share my resume and personal information so that companies
        may contact me about job opportunities.
      </div>
    </div>
  );

  render() {
    const { user, event, pristine, submitting, handleSubmit } = this.props;
    const tPT = user.event.thirdPartyText;

    return (
      <form className="user-profile" onSubmit={handleSubmit}>
        <div className="user-profile__header">
          <div className="user-profile__hello row">
            <div
              className={`order-1 order-md-2 col-md-12 col-lg-4
              user-profile__status-box`}
            >
              {this.renderUserBussing(user)}
              {this.renderUserStatus(user.status)}
            </div>

            <div className="order-2 order-md-1 col-md-12 col-lg-8">
              <h1>Your {' '}
                <a
                  href={user.event.homepage}
                  className="sd-link__underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {user.event.name}
                </a>
                {' '} Application</h1>
              <h5 className={`pt-3 ${tPT ? 'd-block' : 'd-none'}`}>{tPT}</h5>
            </div>
          </div>
        </div>
        <div
          className={`user-profile__apply ${pristine ?
            'user-profile__apply--hidden' : ''}`}
        >
          <input
            type="submit"
            value="Update"
            className="btn rounded-button rounded-button--small mb-3 mb-md-0"
            disabled={pristine || submitting}
          />
        </div>

        <div className="user-profile__form">
          <div className="user-profile__column user-profile__column--left">
            {this.renderApplicantInfoSection(user)}
            {event.options.allowTeammates && this.renderTeamSection(user)}
          </div>
          <div className="user-profile__column user-profile__column--right">
            {this.renderPreferencesSection(user)}
          </div>
        </div>
      </form>
    );
  }
}

export default reduxForm<UserProfileFormData, UserProfileProps>({
  form: 'userProfile',
  enableReinitialize: true,
})(UserProfile);
