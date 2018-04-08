import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showLoading, hideLoading} from 'react-redux-loading-bar';

import {replaceApplicants, replaceFiltered} from './actions';

import {applyResumeFilter} from '~/static/ResumeFilter';

import {loadAllApplicants} from '~/data/Api';

import {Applicants as ApplicantPropType} from '~/proptypes';

import ResumeList from './components/ResumeList';

class ResumesPage extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        eventAlias: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,

    replaceApplicants: PropTypes.func.isRequired,
    showLoading: PropTypes.func.isRequired,
    hideLoading: PropTypes.func.isRequired,
    updateFiltered: PropTypes.func.isRequired,
    applicants: PropTypes.arrayOf(PropTypes.shape(
      ApplicantPropType
    ).isRequired).isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isCompacted: false
    };
  }

  toggleCompacted = () => this.setState({isCompacted: !this.state.isCompacted});

  componentWillMount() {
    let {showLoading, hideLoading, replaceApplicants} = this.props;

    showLoading();

    loadAllApplicants(this.props.match.params.eventAlias)
      .then(res => {
        hideLoading();
        return replaceApplicants(res);
      })
      .catch(console.error);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.applicants.length !== this.props.applicants.length) {
      this.props.updateFiltered(this.props.applicants.length);
    }
  }

  render() {
    let {applicants} = this.props;
    let {isCompacted} = this.state;

    return (
      <div className="resume-body">
        <div className="d-none d-md-block">
          <ResumeList isCompacted={isCompacted}
            onCompactChange={this.toggleCompacted} applicants={applicants} />
        </div>
        <div className="resume-body__mobile d-block d-md-none p-4">
          <h4><i className="fa fa-ban"></i>&nbsp;Unavailable on Mobile</h4>
          <h5>We recommend that you view this page from a computer</h5>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  applicants: applyResumeFilter(state.admin.filters,
    state.admin.resumes.applicants),
  totalApplicants: state.admin.resumes.applicants.length
});

const mapDispatchToProps = (dispatch) => ({
  replaceApplicants: bindActionCreators(replaceApplicants, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
  updateFiltered: bindActionCreators(replaceFiltered, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ResumesPage);
