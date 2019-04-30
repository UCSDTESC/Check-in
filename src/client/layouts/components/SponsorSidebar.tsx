import { Admin } from '@Shared/ModelTypes';
import { JWTAdminAuthToken } from '@Shared/api/Responses';
import React from 'react';
import { Link as RouteLink } from 'react-router-dom';
import { NavbarToggler } from 'reactstrap';
import { FiltersState } from '~/reducers/Admin/types';
import { FilterOption } from '~/static/Types';

import Filter from './Filter';
import Section from './Section';

interface SponsorSidebarProps {
  user: JWTAdminAuthToken;
  selected: number;
  total: number;
  filters: FiltersState;
  filterOptions: any;

  toggleFilter: (filterName: string) => void;
  toggleFilterOption: (filterOption: FilterOption) => void;
  selectAllOptions: (filterName: string) => void;
  selectNoneOptions: (filterName: string) => void;
  onDownloadResumes: () => void;
  isDownloading: boolean;
  addFilterOption: (filterOption: FilterOption) => void;

  isHidden?: boolean;
}

interface SponsorSidebarState {
  isHidden: boolean;
}

export default class SponsorSidebar extends React.Component<SponsorSidebarProps, SponsorSidebarState> {
  state: Readonly<SponsorSidebarState> = {
    isHidden: this.props.isHidden ? this.props.isHidden : true,
  };

  /**
   * Toggles whether the menu is hidden on small devices
   */
  toggleHidden = () => {
    this.setState({
      isHidden: !this.state.isHidden,
    });
  }

  /**
   * Creates the user menu for the authenticated user.
   */
  renderUser() {
    const {user, selected, isDownloading, onDownloadResumes} = this.props;

    return (
      <div className="admin-sidebar__user-box admin-sidebar__dark">
        <div className="d-flex">
          <div className="admin-sidebar__user-name text-uppercase">
            Welcome, {user.username}
          </div>
          <div className="admin-sidebar__logout">
            <RouteLink to="/admin/logout">Logout</RouteLink>
          </div>
        </div>
        <div className="admin-sidebar__download">
          <button
            className="btn rounded-button rounded-button--small"
            onClick={onDownloadResumes}
            disabled={selected === 0 || isDownloading}
          >
            {isDownloading ? 'Downloading' : `Download (${selected})`}
          </button>
        </div>
      </div>
    );
  }

  handleToggleFilter = (filterName: string) =>
    () => this.props.toggleFilter(filterName);

  handleToggleFilterOption = (filterName: string) =>
    (optionName: string) => this.props.toggleFilterOption({
      filterName: filterName,
      optionValue: optionName,
    } as FilterOption);

  handleSelectAll = (filterName: string) =>
    () => this.props.selectAllOptions(filterName);

  handleSelectNone = (filterName: string) =>
    () => this.props.selectNoneOptions(filterName);

  addFilterOption = (filterName: string) =>
    (optionName: string) => this.props.addFilterOption({
      filterName: filterName,
      optionValue: optionName,
    } as FilterOption);

  /**
   * Renders the all filters
   */
  renderFilters() {
    const {filters, filterOptions} = this.props;

    return (
      <div className="admin-sidebar__filters">
      {Object.keys(filters).map((filterName, i) => {
        const filter = filters[filterName];
        return (<Filter
          key={i}
          enabled={filter.enabled}
          name={filter.displayName}
          options={filter.options}
          editable={filter.editable}
          availableOptions={filterOptions[filterName]}
          onOptionChange={this.handleToggleFilterOption(filterName)}
          onEnableChange={this.handleToggleFilter(filterName)}
          selectAllOptions={this.handleSelectAll(filterName)}
          selectNoneOptions={this.handleSelectNone(filterName)}
          addFilterOption={this.addFilterOption(filterName)}
        />);
      })}
    </div>
    );
  }

  render() {
    const {selected, total} = this.props;

    return (
      <div className="admin-sidebar">
        <div className="admin-sidebar__header navbar-expand-md navbar-inverse">
          <img
            className="admin-sidebar__logo"
            src="/img/vectors/tesc-logo.svg"
          />
          <span className="admin-sidebar__header-text">
            Sponsor Resume Tool
          </span>
          <NavbarToggler
            right="true"
            className="admin-sidebar__toggler navbar-dark"
            onClick={this.toggleHidden}
          />
        </div>

        <div className={this.state.isHidden ? 'd-none d-md-block' : ''}>
          <RouteLink
            to="/admin/"
            className="admin-sidebar__back admin-sidebar__dark"
          >
            <i className="fa fa-chevron-left"/>&nbsp;
            Back to Dashboard
          </RouteLink>

          {this.renderUser()}

          <div className="admin-sidebar__selected">
            Showing: {selected} of {total}
          </div>

          <Section name="Filters">
            {this.renderFilters()}
          </Section>
        </div>
      </div>
    );
  }
}
