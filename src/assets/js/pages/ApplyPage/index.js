import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import Progress from 'react-progress';
import ReactGA from 'react-ga';
import {Link} from 'react-router-dom';

import {registerUser, loadEventByAlias, checkUserExists} from '~/data/Api';

import Loading from '~/components/Loading';

import NavHeader from '~/components/NavHeader.js';

import Header from './components/Header';
import PersonalSection from './components/PersonalSection';
import ResponseSection from './components/ResponseSection';
import SubmittedSection from './components/SubmittedSection';
import UserSection from './components/UserSection';
import createValidator from './validate';

class ApplyPage extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        eventAlias: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
  }

  constructor(props) {
    super(props);
    this.onFinalSubmit = this.onFinalSubmit.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.state = {
      page: 1,
      error: null,
      isSubmitting: false,
      event: null,
      emailExists: false
    };
  }

  /**
   * Loads information about the event given its event alias.
   */
  loadEventInformation() {
    let {eventAlias} = this.props.match.params;
    loadEventByAlias(eventAlias)
      .then((res) => {
        this.setState({event: res});
      })
      .catch((err) => {
        console.error(err);
        this.setState({error: err});
      });
  };

  /**
   * Check for a URL hash and change pages.
   */
  loadPageFromHash() {
    const {history} = this.props;
    if (!history.location.hash) {
      if (this.state.page !== 1) {
        this.setState({page: 1});
      }
      return;
    }

    let page = parseInt(history.location.hash.substring(1));
    if (this.state.page === page) {
      return;
    }
    this.setState({page: page});
  }

  componentWillMount() {
    this.loadEventInformation();
    this.loadPageFromHash();
  }

  componentWillUpdate() {
    this.loadPageFromHash();
  }

  sanitiseValues(values) {
    values.birthdateDay = ('00' + values.birthdateDay)
      .substring(values.birthdateDay.length);
    values.birthdateYear = ('0000' + values.birthdateYear)
      .substring(values.birthdateYear.length);

    // Check for UCSD institution
    if (values.institution === 'ucsd') {
      values.institution = 'uni';
      values.university = 'The University of California, San Diego';
    }
    if (values.institution === 'hs') {
      values.university = values.highSchool;
    }

    return values;
  }

  /**
   * Looks up emails to link previous accounts.
   * @param {String} email The new value of the email address.
   */
  lookupEmail = (email) => {
    if (email.length === 0) {
      this.setState({
        emailExists: false
      });
      return;
    }

    checkUserExists(email)
      .then((ret) => {
        this.setState({
          emailExists: ret.exists
        });
      });
  }

  /**
   * Modifies then submits the validated data to register the user.
   * @param {Object} values The validated form data.
   */
  onFinalSubmit(values) {
    this.setState({
      isSubmitting: true
    });


    values.customQuestionResponses = JSON.stringify(values.customQuestionResponses);
    console.log(values);
    // Clean up values
    // values = this.sanitiseValues(values);

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
          isSubmitting: false
        });
      });
  }

  /**
   * Update the URL hash, adding the application page.
   * @param {Integer} page The new page index.
   */
  updateHash(page) {
    const {history} = this.props;

    history.push({
      pathname: history.location.pathname,
      hash: '#' + page
    });
  }

  /**
   * Navigate to the next application page.
   */
  nextPage() {
    const newPage = this.state.page + 1;
    this.setState({page: newPage});
    this.updateHash(newPage);
  }

  /**
   * Navigate to the previous application page.
   */
  previousPage() {
    const newPage = this.state.page - 1;
    this.setState({page: newPage});
    this.updateHash(newPage);
  }

  render() {
    const {page, event, emailExists} = this.state;

    if (!event) {
      return (<div className="page apply-page apply-page--loading">
        <NavHeader />
        <Loading title="Registration" />
      </div>);
    }

    let options = event.options;
    let validator = createValidator(options, event.customQuestions);

    // Check for closed
    if (new Date(event.closeTime) < Date.now()) {
      return (<div className="page apply-page">
        <NavHeader />
        <div className="container">
          <div className="row">
            <div className="col-md-4 text-md-right text-center">
              <img className="apply-page__logo" src={event.logo} />
            </div>
            <div className="col-md-8 text-md-left text-center">
              <h2>Applications for {event.name} are now closed</h2>
              <Link className="btn rounded-button rounded-button--small"
                to="/login">Log In</Link>{' '}
              <a className="btn rounded-button rounded-button--small
                rounded-button--secondary mt-2 mt-md-0" href={event.homepage}>
                Event Homepage
              </a>
            </div>
          </div>
        </div>
      </div>);
    }

    return (
      <div className="page apply-page">
        <NavHeader />
        <div className="sd-form__wrapper">
          <Progress percent={(page * 100) / 4} className="sd-form__progress" />
          <div className="sd-form">
            {event && <Header name={event.name} logo={event.logo}
              description={event.description} />}
            {page === 1 && <PersonalSection onSubmit={this.nextPage}
              validate={validator} event={event} options={options}
              onEmailChange={this.lookupEmail} />}
            {page === 2 && <ResponseSection onSubmit={this.nextPage}
              previousPage={this.previousPage}
              validate={validator} options={options} 
              customQuestions={event.customQuestions}/>}
            {page === 3 && <UserSection onSubmit={this.onFinalSubmit}
              previousPage={this.previousPage} submitError={this.state.error}
              isSubmitting={this.state.isSubmitting}
              validate={validator} options={options}
              emailExists={emailExists} />}
            {page === 4 && <SubmittedSection event={event} />}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ApplyPage);
