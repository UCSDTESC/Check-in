import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {showLoading, hideLoading} from 'react-redux-loading-bar';

import {replaceApplicants, replaceFiltered} from './actions';

import {applyResumeFilter} from '~/static/ResumeFilter';

import {loadAllApplicants} from '~/data/Api';

import ResumeList from './components/ResumeList';
import { RouteComponentProps } from 'react-router';
import { ApplicationState } from '~/reducers';
import { TESCUser, UserStatus } from '~/static/types';
import { ApplicationDispatch } from '~/actions';

const mapStateToProps = (state: ApplicationState) => ({
  applicants: applyResumeFilter(state.admin.filters,
    state.admin.resumes.applicants),
  totalApplicants: state.admin.resumes.applicants.length,
});

const mapDispatchToProps = (dispatch: ApplicationDispatch) => bindActionCreators({
  replaceApplicants,
  showLoading,
  hideLoading,
  replaceFiltered,
}, dispatch);

interface ResumesPageProps {
}

type Props = RouteComponentProps<{
  eventAlias: string;
}> & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & ResumesPageProps;

interface ResumesPageState {
  isCompacted: boolean;
}

class ResumesPage extends React.Component<Props, ResumesPageState> {
  state: Readonly<ResumesPageState> = {
    isCompacted: false,
  };

  toggleCompacted = () => this.setState({isCompacted: !this.state.isCompacted});

  componentDidMount() {
    const {showLoading, hideLoading, replaceApplicants} = this.props;

    showLoading();

    loadAllApplicants(this.props.match.params.eventAlias)
      .then((res: TESCUser[]) => {
        hideLoading();
        return replaceApplicants(res);
      })
      .catch(console.error);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.applicants.length !== this.props.applicants.length) {
      this.props.replaceFiltered(this.props.applicants.length);
    }
  }

  render() {
    const {applicants} = this.props;
    const {isCompacted} = this.state;

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