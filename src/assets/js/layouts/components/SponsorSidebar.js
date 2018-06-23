import React from 'react';
import PropTypes from 'prop-types';
import {NavbarToggler} from 'reactstrap';
import {Link as RouteLink} from 'react-router-dom';

import Filter from './Filter';
import Section from './Section';

class SponsorSidebar extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    selected: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    filters: PropTypes.object.isRequired,
    filterOptions: PropTypes.object.isRequired,

    toggleFilter: PropTypes.func.isRequired,
    toggleFilterOption: PropTypes.func.isRequired,
    selectAllOptions: PropTypes.func.isRequired,
    selectNoneOptions: PropTypes.func.isRequired,
    onDownloadResumes: PropTypes.func.isRequired,
    isDownloading: PropTypes.bool.isRequired,
    addFilterOption: PropTypes.func.isRequired,

    isHidden: PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.state = {
      isHidden: this.props.isHidden ? this.props.isHidden : true
    };
  }

  /**
   * Toggles whether the menu is hidden on small devices
   */
  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden
    });
  }

  /**
   * Creates the user menu for the authenticated user.
   */
  renderUser() {
    let {user, selected, isDownloading, onDownloadResumes} = this.props;

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
          <button className="btn rounded-button rounded-button--small"
            onClick={onDownloadResumes} disabled={selected === 0 ||
              isDownloading}>
            {isDownloading ? 'Downloading' : 'Download ('+selected+')' }
          </button>
        </div>
      </div>
    );
  }

  handleToggleFilter = (name) =>
    () => this.props.toggleFilter(name);

  handleToggleFilterOption = (filter) =>
    (name) => this.props.toggleFilterOption(filter, name);

  handleSelectAll = (name) =>
    () => this.props.selectAllOptions(name);

  handleSelectNone = (name) =>
    () => this.props.selectNoneOptions(name);

  addFilterOption = (name) =>
    (option) => this.props.addFilterOption(name, option);

  /**
   * Renders the all filters
   */
  renderFilters() {
    let {filters, filterOptions} = this.props;

    return (<div className="admin-sidebar__filters">

      {Object.keys(filters).map((filterName, i) => {
        let filter = filters[filterName];
        return (<Filter key={i}
          enabled={filter.enabled} name={filter.displayName}
          options={filter.options} editable={filter.editable}
          availableOptions={filterOptions[filterName]}
          onOptionChange={this.handleToggleFilterOption(filterName)}
          onEnableChange={this.handleToggleFilter(filterName)}
          selectAllOptions={this.handleSelectAll(filterName)}
          selectNoneOptions={this.handleSelectNone(filterName)}
          addFilterOption={this.addFilterOption(filterName)} />);
      })}
    </div>);
  }

  render() {
    let {selected, total} = this.props;

    return (<div className="admin-sidebar">
      <div className={`admin-sidebar__header navbar-expand-md
        navbar-inverse`}>
        <img className="admin-sidebar__logo"
          src="/img/vectors/tesc-logo.svg"/>
        <span className="admin-sidebar__header-text">
          Sponsor Resume Tool
        </span>
        <NavbarToggler right
          className="admin-sidebar__toggler navbar-dark"
          onClick={this.toggleHidden.bind(this)} />
      </div>

      <div className={this.state.isHidden ? 'd-none d-md-block' : ''}>
        <RouteLink to="/admin/"
          className="admin-sidebar__back admin-sidebar__dark">
          <i className="fa fa-chevron-left"></i>&nbsp;
          Back to Dashboard
        </RouteLink>

        {this.renderUser()}

        <div className="admin-sidebar__selected">
          Showing: {selected} of {total}
        </div>

        <Section name='Filters'>
          {this.renderFilters()}
        </Section>
      </div>
    </div>);
  };
};



export default SponsorSidebar;
