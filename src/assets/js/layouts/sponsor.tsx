import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {showLoading, hideLoading} from 'react-redux-loading-bar';

import {applyResumeFilter} from '~/static/ResumeFilter';

import {downloadResumes, pollDownload} from '~/data/Api';

import {toggleFilter, filterOptionActions, selectAllOptions,
  selectNoneOptions, ApplicationDispatch} from '../actions';

import Sidebar from './components/SponsorSidebar';
import { ApplicationState } from '~/reducers';
import { TESCUser } from '~/static/types';

const mapStateToProps = (state: ApplicationState) => ({
  filters: state.admin.filters,
  resumes: state.admin.resumes,
  user: state.admin.auth.user,
  filtered: state.admin.resumes.filtered,
});

const mapDispatchToProps = (dispatch: ApplicationDispatch) => bindActionCreators({
  toggleFilter,
  toggleFilterOption: filterOptionActions.toggleFilterOption,
  selectAllOptions,
  selectNoneOptions,
  addFilterOption: filterOptionActions.addFilterOption,
  showLoading,
  hideLoading,
}, dispatch);

interface SponsorLayoutProps {
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & SponsorLayoutProps;

interface SponsorLayoutState {
  isDownloading: boolean;
}

class SponsorLayout extends React.Component<Props, SponsorLayoutState> {
  state: Readonly<SponsorLayoutState> = {
    isDownloading: false,
  };

  /**
   * Creates an object which maps all properties of every applicant to a unique
   * list of values for that property.
   * @param {Object[]} applicants The list of applicants to iterate over.
   * @returns {Object} A mapping of applicant property to unique array of
   * values.
   */
  createFilterOptions = (applicants: TESCUser[]) => {
    if (applicants.length < 1) {
      return {};
    }

    const modelApplicant = applicants[0];
    return Object.keys(modelApplicant)
      .reduce((total: any, curr) => {
        // TODO: Rewrite logo
        // @ts-ignore: Access dynamic properties of user
        total[curr] = [...new Set(applicants.map(item => item[curr]))];
        return total;
      }, {});
  }

  /**
   * Gives the request to download the resumes that are currently selected.
   */
  downloadResumes = () => {
    const {showLoading, filters, resumes} = this.props;
    showLoading();

    const filtered = applyResumeFilter(filters, resumes.applicants)
      .map(user => user._id);

    downloadResumes(filtered)
      .then((res) => {
        this.setState({
          isDownloading: true,
        });
        this.startPolling(res._id);
      })
      .catch(console.error);
  }

  /**
   * Polls a requested to download until it completes or errors.
   * @param {String} downloadId The ID of the download to poll for.
   */
  startPolling = (downloadId: string) => {
    const pollingInterval = 1000;
    const {hideLoading} = this.props;

    pollDownload(downloadId)
      .then((res) => {
        if (res.accessUrl) {
          hideLoading();
          this.setState({
            isDownloading: false,
          });
          return window.open(res.accessUrl);
        }

        setTimeout(() => this.startPolling(downloadId), pollingInterval);
      })
      .catch((err) => {
        console.error(err);
        hideLoading();
      });
  }

  render() {
    const {user, filters, resumes, filtered} = this.props;
    const filterOptions = this.createFilterOptions(resumes.applicants);

    return (
      <div className="admin-body d-flex flex-column">
        <div className="container-fluid p-0 w-100 max-height">
          <div className="d-flex flex-column flex-md-row h-100">
            <div
              className={`admin-sidebar__container
              admin-sidebar__container--authenticated`}
            >
              <Sidebar
                user={user}
                selected={filtered}
                total={resumes.applicants.length}
                toggleFilter={this.props.toggleFilter}
                toggleFilterOption={this.props.toggleFilterOption}
                selectAllOptions={this.props.selectAllOptions}
                selectNoneOptions={this.props.selectNoneOptions}
                filters={filters}
                filterOptions={filterOptions}
                onDownloadResumes={this.downloadResumes}
                isDownloading={this.state.isDownloading}
                addFilterOption={this.props.addFilterOption}
              />
            </div>

            <main className={'admin-body__content'}>
              {this.props.children}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SponsorLayout);
