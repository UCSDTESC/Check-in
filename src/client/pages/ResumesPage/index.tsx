 import { TESCUser } from '@Shared/ModelTypes';
 import { UserStatus } from '@Shared/UserStatus';
 import React from 'react';
 import { connect } from 'react-redux';
 import { showLoading, hideLoading } from 'react-redux-loading-bar';
 import { RouteComponentProps } from 'react-router';
 import { bindActionCreators } from 'redux';
 import { ApplicationDispatch, loadAllAdminEvents } from '~/actions';
 import { loadAllSponsorUsers } from '~/data/AdminApi';
 import { ApplicationState } from '~/reducers';
 import { applyResumeFilter } from '~/static/Resumes';

 import { replaceApplicants, replaceFiltered } from './actions';
 import ResumeList from './components/ResumeList';

 type RouteProps = RouteComponentProps<{
  eventAlias: string;
}>;

 const mapStateToProps = (state: ApplicationState, ownProps: RouteProps) => {
  const eventAlias = ownProps.match.params.eventAlias;
  return {
    event: state.admin.events[eventAlias],
    applicants: applyResumeFilter(state.admin.filters,
      state.admin.resumes.applicants),
    totalApplicants: state.admin.resumes.applicants.length,
  };
};

 const mapDispatchToProps = (dispatch: ApplicationDispatch) => bindActionCreators({
  replaceApplicants,
  showLoading,
  hideLoading,
  replaceFiltered,
  loadAllAdminEvents,
}, dispatch);

 interface ResumesPageProps {
}

// the props of this event are the union of the react-router data, redux actions and dispatch, and the
// regular props of the component
 type Props = RouteComponentProps<{
  eventAlias: string;
}> & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & ResumesPageProps;

 interface ResumesPageState {

  // boolean to track compact state
  isCompacted: boolean;
}

/**
 * This is the sponsor tool that shows a list of applicants to an event and their resumes
 */
 class ResumesPage extends React.Component<Props, ResumesPageState> {
  state: Readonly<ResumesPageState> = {
    isCompacted: false,
  };

  /**
   * Toggle to compact react state
   */
  toggleCompacted = () => this.setState({isCompacted: !this.state.isCompacted});

  componentDidMount() {
    const { showLoading, hideLoading } = this.props;

    showLoading();

    if (!this.props.event) {
      this.props.loadAllAdminEvents()
        .catch(console.error)
        .then(this.loadApplicants)
        .finally(hideLoading);
    } else {
      this.loadApplicants()
        .finally(hideLoading);
    }
  }

  loadApplicants = () =>
    loadAllSponsorUsers(this.props.event._id)
      .then(this.props.replaceApplicants)
      .catch(console.error);

  componentDidUpdate(prevProps: Props) {
    if (prevProps.applicants.length !== this.props.applicants.length) {
      this.props.replaceFiltered(this.props.applicants.length);
    }
  }

  render() {
    const { applicants } = this.props;
    const { isCompacted } = this.state;

    return (
      <div className="resume-body">
        <div className="d-none d-md-block">
          <ResumeList
            isCompacted={isCompacted}
            onCompactChange={this.toggleCompacted}
            applicants={applicants}
          />
        </div>
        <div className="resume-body__mobile d-block d-md-none p-4">
          <h4><i className="fa fa-ban" />&nbsp;Unavailable on Mobile</h4>
          <h5>We recommend that you view this page from a computer</h5>
        </div>
      </div>
    );
  }
}

 export default connect(mapStateToProps, mapDispatchToProps)(ResumesPage);
