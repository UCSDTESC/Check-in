import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import Progress from 'react-progress';
import ReactGA from 'react-ga';

import {registerUser} from '~/data/Api';

import Header from './components/Header';
import PersonalSection from './components/PersonalSection';
import ResponseSection from './components/ResponseSection';
import SubmittedSection from './components/SubmittedSection';
import UserSection from './components/UserSection';
import NavHeader from '~/components/NavHeader.js'

class ApplyPage extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.onFinalSubmit = this.onFinalSubmit.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
    this.state = {
      page: 1,
      error: null,
      isSubmitting: false
    };
  }

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
    this.loadPageFromHash();
  }

  componentWillUpdate() {
    this.loadPageFromHash();
  }

  /**
   * Modifies then submits the validated data to register the user.
   * @param {Object} values The validated form data.
   */
  onFinalSubmit(values) {
    this.setState({
      isSubmitting: true
    });

    // Clean up values
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

    registerUser(values)
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
    const {page} = this.state;

    return (
      <div className="home-page">
        < NavHeader />
        <div className="sd-form__wrapper">
          <Progress percent={(page * 100) / 4} />
          <div className="sd-form">
            <Header />
            {page === 1 && <PersonalSection onSubmit={this.nextPage} />}
            {page === 2 && <ResponseSection onSubmit={this.nextPage}
              previousPage={this.previousPage} />}
            {page === 3 && <UserSection onSubmit={this.onFinalSubmit}
              previousPage={this.previousPage} submitError={this.state.error}
              isSubmitting={this.state.isSubmitting} />}
            {page === 4 && <SubmittedSection />}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(ApplyPage);
