import { TESCEvent } from '@Shared/ModelTypes';
import React from 'react';
import ReactGA from 'react-ga';
import Progress from 'react-progress';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Loading from '~/components/Loading';
import NavHeader from '~/components/NavHeader';
import { registerUser, loadEventByAlias, checkUserExists } from '~/data/UserApi';

import Header from './components/Header';
import PersonalSection, { PersonalSectionFormData, InstitutionType } from './components/PersonalSection';
import ResponseSection, { ResponseSectionFormData } from './components/ResponseSection';
import SubmittedSection from './components/SubmittedSection';
import UserSection, { UserSectionFormData } from './components/UserSection';
import createValidator from './validate';

interface ApplyPageProps {
}

type Props = RouteComponentProps<{
  eventAlias: string;
}>;

interface ApplyPageState {
  page: number;
  error: Error;
  isSubmitting: boolean;
  event: TESCEvent;
  emailExists: boolean;
}

export type ApplyPageFormData = PersonalSectionFormData & ResponseSectionFormData & UserSectionFormData;

class ApplyPage extends React.Component<Props, ApplyPageState> {
  state: Readonly<ApplyPageState> = {
    page: 1,
    error: null,
    isSubmitting: false,
    event: null,
    emailExists: false,
  };

  /**
   * Loads information about the event given its event alias.
   */
  loadEventInformation = () => {
    const {eventAlias} = this.props.match.params;
    loadEventByAlias(eventAlias)
      .then((res) => {
        // Take the first (and only event) from the response
        const thisEvent = res.events[0];
        this.setState({
          event: thisEvent,
        });
      })
      .catch((err) => {
        console.error(err);
        this.setState({error: err});
      });
  };

  /**
   * Check for a URL hash and change pages.
   */
  loadPageFromHash = () => {
    const {history} = this.props;
    if (!history.location.hash) {
      if (this.state.page !== 1) {
        this.setState({page: 1});
      }
      return;
    }

    const page = parseInt(history.location.hash.substring(1), 10);
    if (this.state.page === page) {
      return;
    }
    this.setState({page: page});
  }

  componentDidMount() {
    this.loadEventInformation();
    this.loadPageFromHash();
  }

  componentDidUpdate() {
    this.loadPageFromHash();
  }

  sanitiseValues(values: ApplyPageFormData) {
    values.birthdate = new Date(
      values.birthdateYear,
      values.birthdateMonth - 1,
      values.birthdateDay
    ).toISOString();

    // Check for UCSD institution
    if (values.institution === InstitutionType.UCSD) {
      values.institution = InstitutionType.University;
      values.university = 'The University of California, San Diego';
    }
    if (values.institution === InstitutionType.HighSchool) {
      values.university = values.highSchool;
    }

    if (values.outOfState) {
      values.travel = {
        outOfState: values.outOfState,
        city: values.city,
      };
    }

    if (values.phone) {
      values.phone = values.phone.replace(/\D/g, '');
    }

    return values;
  }

  /**
   * Looks up emails to link previous accounts.
   * @param {String} email The new value of the email address.
   */
  lookupEmail = (email: string) => {
    if (email.length === 0) {
      this.setState({
        emailExists: false,
      });
      return;
    }

    checkUserExists(email)
      .then((ret) => {
        this.setState({
          emailExists: ret.exists,
        });
      });
  }

  /**
   * Modifies then submits the validated data to register the user.
   * @param {Object} values The validated form data.
   */
  onFinalSubmit = (values: ApplyPageFormData) => {
    values = this.sanitiseValues(values);

    this.setState({
      isSubmitting: true,
    });

    registerUser(this.props.match.params.eventAlias, values)
      .then(() => {
        // Log successful application with Google Analytics
        ReactGA.event({
          category: 'Application',
          action: 'Successful',
        });

        this.nextPage();
      })
      .catch((err) => {
        console.error(err);
        this.setState({error: err});
      })
      .finally(() => {
        this.setState({
          isSubmitting: false,
        });
      });
  }

  /**
   * Update the URL hash, adding the application page.
   * @param {Integer} page The new page index.
   */
  updateHash(page: number) {
    const {history} = this.props;

    history.push({
      pathname: history.location.pathname,
      hash: '#' + page,
    });
  }

  /**
   * Navigate to the next application page.
   */
  nextPage = () => {
    const newPage = this.state.page + 1;
    this.setState({page: newPage});
    this.updateHash(newPage);
  }

  /**
   * Navigate to the previous application page.
   */
  previousPage = () => {
    const newPage = this.state.page - 1;
    this.setState({page: newPage});
    this.updateHash(newPage);
  }

  render() {
    const {page, event, emailExists} = this.state;

    if (!event) {
      return (
      <div className="page apply-page apply-page--loading">
        <NavHeader />
        <Loading title="Registration" />
      </div>
      );
    }

    const options = event.options;
    const validator = createValidator(options, event.customQuestions);

    // Check for closed
    if (new Date(event.closeTime) < new Date()) {
      return (
      <div className="page apply-page">
        <NavHeader />
        <div className="container">
          <div className="row">
            <div className="col-md-4 text-md-right text-center">
              <img className="apply-page__logo" src={event.logo.url} />
            </div>
            <div className="col-md-8 text-md-left text-center">
              <h2>Applications for {event.name} are now closed</h2>
              <Link
                className="btn rounded-button rounded-button--small"
                to="/login"
              >
                Log In
              </Link>{' '}
              <a
                className="btn rounded-button rounded-button--small
                rounded-button--secondary mt-2 mt-md-0"
                href={event.homepage}
              >
                Event Homepage
              </a>
            </div>
          </div>
        </div>
      </div>
      );
    }

    return (
      <div className="page apply-page">
        <NavHeader />
        <div className="sd-form__wrapper">
          <Progress percent={(page * 100) / 4} className="sd-form__progress" />
          <div className="sd-form">
            {event && <Header
              name={event.name}
              logo={event.logo}
              description={event.description}
            />}
            {page === 1 && <PersonalSection
              onSubmit={this.nextPage}
              validate={validator}
              event={event}
              onEmailChange={this.lookupEmail}
            />}
            {page === 2 && <ResponseSection
              onSubmit={this.nextPage}
              goToPreviousPage={this.previousPage}
              validate={validator}
              event={event}
            />}
            {page === 3 && <UserSection
              onSubmit={this.onFinalSubmit}
              goToPreviousPage={this.previousPage}
              submitError={this.state.error}
              isSubmitting={this.state.isSubmitting}
              validate={validator}
              event={event}
              emailExists={emailExists}
            />}
            {page === 4 && <SubmittedSection event={event} />}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ApplyPage);
