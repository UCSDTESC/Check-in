import { TESCTeam, TESCUser } from '@Shared/ModelTypes';
import { UserStatus } from '@Shared/UserStatus';
import classNames from 'classnames';
import React, { ReactNode } from 'react';
import FA from 'react-fontawesome';
import { getSuggestions as MajorSuggestions } from '~/static/Majors';
import { TeamStatus, getTeamStatus } from '~/static/Teams';
import { ColumnDefinitions } from '~/static/Types';
import { getSuggestions as UniversitySuggestions } from '~/static/Universities';

import BaseFilter from './Filters/BaseFilter';
import EnumFilter, { EnumOperation } from './Filters/EnumFilter';
import EnumFilterComponent from './Filters/EnumFilterComponent';
import NumberFilterComponent from './Filters/NumberFilterComponent';
import StatusFilterComponent from './Filters/StatusFilterComponent';
import StringFilter, { StringOperation } from './Filters/StringFilter';
import YearFilterComponent from './Filters/YearFilterComponent';
import SelectAllCheckbox, { CheckboxState } from './SelectAllCheckbox';

enum AdmittedSelectOption {
  ALL,
  ADMITTED,
  NOT_ADMITTED,
}

interface NewFilterOption {
  propertyName: keyof TESCUser;
  propertyDisplayName: string;
  newFilterComponent: ReactNode;
  deletePrevious?: boolean; // Determines whether to delete any previous filters with the given property name.
}

interface TeamsFiltersProps {
  teams: TESCTeam[];
  columns: ColumnDefinitions;
  selectAllState: CheckboxState;

  onFilteredChanged: (newFiltered: Set<string>) => void;
  onSelectAll: () => void;
}

interface TeamsFiltersState {
  activeFilters: BaseFilter[];
  admittedSelection: AdmittedSelectOption;
  showNewFilterMenu: boolean;
  selectedNewFilterOption?: NewFilterOption;
}

export default class TeamsFilters extends React.Component<TeamsFiltersProps, TeamsFiltersState> {
  admittedTeams: Set<string> = new Set();
  notAdmittedTeams: Set<string> = new Set();
  newFilterOptions: NewFilterOption[];

  constructor(props: TeamsFiltersProps) {
    super(props);

    this.state = {
      activeFilters: [
        new StringFilter('university', 'University', StringOperation.CONTAINS, 'San Diego'),
        new EnumFilter<UserStatus>('status', 'Status', EnumOperation.INCLUDES, UserStatus.Late, UserStatus.NoStatus),
      ],
      admittedSelection: AdmittedSelectOption.ALL,
      showNewFilterMenu: false,
    };

    this.constructNewFilterComponents();

    this.constructAdmitted(props.teams);
    this.constructNotAdmitted(props.teams);

    this.onFilterChanged();
  }

  componentDidUpdate(prevProps: TeamsFiltersProps) {
    const newTeams = this.props.teams;

    if (newTeams !== prevProps.teams) {
      this.constructAdmitted(newTeams);
      this.constructNotAdmitted(newTeams);

      this.onFilterChanged();
    }
  }

  /**
   * Constructs the list of all teams that have been admitted.
   */
  constructAdmitted = (teams: TESCTeam[]) => {
    const admittedStatuses: Set<TeamStatus> = new Set([UserStatus.Confirmed, UserStatus.Unconfirmed,
    UserStatus.Declined, UserStatus.Late]);

    this.admittedTeams = new Set(
      this.props.teams
        .filter(team => admittedStatuses.has(getTeamStatus(team.members)))
        .map(team => team._id)
    );
  };

  /**
   * Constructs the list of all teams that are not admitted.
   */
  constructNotAdmitted = (teams: TESCTeam[]) => {
    const notAdmittedStatuses: Set<TeamStatus> = new Set([UserStatus.NoStatus, UserStatus.Waitlisted]);

    this.notAdmittedTeams = new Set(
      this.props.teams
        .filter(team => notAdmittedStatuses.has(getTeamStatus(team.members)))
        .map(team => team._id)
    );
  };

  /**
   * Constructs the components to generate new filters and their callbacks.
   */
  constructNewFilterComponents = () => {
    this.newFilterOptions = [{
      propertyName: 'university',
      propertyDisplayName: 'University',
      newFilterComponent: (
        <EnumFilterComponent
          label="University"
          getSuggestions={UniversitySuggestions}
          onChange={console.log}
        />
      ),
    }, {
      propertyName: 'gpa',
      propertyDisplayName: 'GPA',
      newFilterComponent: (
        <NumberFilterComponent
          label="GPA"
          min={0}
          max={4.00}
          step={0.1}
          format={value => Number(value).toFixed(2)}
          onChange={console.log}
        />
      ),
    }, {
      propertyName: 'majorGPA',
      propertyDisplayName: 'Major GPA',
      newFilterComponent: (
        <NumberFilterComponent
          label="Major GPA"
          min={0}
          max={4.00}
          step={0.1}
          format={value => Number(value).toFixed(2)}
          onChange={console.log}
        />
      ),
    }, {
      propertyName: 'status',
      propertyDisplayName: 'Status',
      newFilterComponent: (
        <StatusFilterComponent label="Status" onChange={console.log} />
      ),
    }, {
      propertyName: 'year',
      propertyDisplayName: 'Year',
      newFilterComponent: (
        <YearFilterComponent
          onChange={console.log}
          label="Year"
        />
      ),
    }, {
      propertyName: 'major',
      propertyDisplayName: 'Major',
      newFilterComponent: (
        <EnumFilterComponent
          label="Major"
          getSuggestions={MajorSuggestions}
          onChange={console.log}
        />
      ),
    }];
  };

  /**
   * Triggers a full filter and calls the prop to update.
   */
  onFilterChanged = () => {
    const { teams } = this.props;
    const { admittedSelection } = this.state;

    let customFilteredTeams: TESCTeam[];
    // Apply faster admission selection filter first.
    switch (admittedSelection) {
      case (AdmittedSelectOption.ADMITTED):
        customFilteredTeams = teams.filter(team => this.admittedTeams.has(team._id));
        break;
      case (AdmittedSelectOption.NOT_ADMITTED):
        customFilteredTeams = teams.filter(team => this.notAdmittedTeams.has(team._id));
        break;
      default:
        customFilteredTeams = teams;
        break;
    }

    customFilteredTeams = this.applyAllFilters(customFilteredTeams);

    this.props.onFilteredChanged(new Set(customFilteredTeams.map(team => team._id)));
  };

  /**
   * Determines whether two sets of teams are equivalent.
   */
  areTeamSetsEqual = (a: Set<string>, b: Set<string>) => a.size === b.size && [...a].every(value => b.has(value));

  /**
   * Changes the filtered set to a new set.
   */
  changeAdmissionFilter = (newOption: AdmittedSelectOption) => {
    this.setState({
      admittedSelection: newOption,
    }, () => this.onFilterChanged());
  }

  /**
   * Opens or closes the new filter menu.
   */
  toggleNewFilterMenu = () => {
    this.setState({
      showNewFilterMenu: !this.state.showNewFilterMenu,
    });
  };

  /**
   * Applies each of the team filters in order and returns the new list of teams.
   */
  applyAllFilters = (teams: TESCTeam[]): TESCTeam[] => {
    const { activeFilters: filters } = this.state;
    let newTeams = teams;

    // Iterate through all filters and apply them in order.
    filters.forEach(filter => {
      newTeams = filter.applyFilter(newTeams);
    });

    return newTeams;
  };

  /**
   * Removes a filter by its index within the filters list.
   * @param index The index of the filter within the filters list.
   */
  removeFilter(index: number) {
    const { activeFilters } = this.state;
    this.setState({
      activeFilters: [...activeFilters.slice(0, index), ...activeFilters.slice(index + 1)],
    }, () => this.onFilterChanged());
  }

  /**
   * Get suggestions for team status for the auto suggest box.
   */
  getStatusSuggestions = (value: string) => {
    const caseRegexp = new RegExp(value.trim(), 'i');
    return Object.values(UserStatus).filter((value: string) => value.search(caseRegexp) > -1);
  }

  /**
   * Selects a new filter option from the menu.
   */
  selectNewFilterOption = (option: NewFilterOption) => {
    this.setState({
      selectedNewFilterOption: option,
    });
  }

  renderNewFilterMenu = () => {
    const { selectedNewFilterOption } = this.state;

    const menuClassNames = classNames('row sd-form sd-form--full',
      'teams-filters teams-filters--top teams-filters--border', {
        'd-none': !this.state.showNewFilterMenu,
      });

    return (
      <div className={menuClassNames}>
        <div className="d-none d-md-block col-md-auto">
          <div className="btn-group-vertical">
            {this.newFilterOptions.map(option => (
              <button
                key={option.propertyName}
                type="button"
                className={classNames('btn teams-filters__new-option', {
                  // Make the button active if selected
                  'teams-filters__new-option--active':
                    selectedNewFilterOption && selectedNewFilterOption.propertyName === option.propertyName,
                })}
                onClick={() => this.selectNewFilterOption(option)}
              >
                {option.propertyDisplayName}
              </button>
            ))}
          </div>
        </div>
        <div className="d-block d-md-none col-12 mb-2">
          <div className="btn-group">
            {this.newFilterOptions.map(option => (
              <button
                key={option.propertyName}
                type="button"
                className={classNames('btn teams-filters__new-option', {
                  // Make the button active if selected
                  'teams-filters__new-option--active':
                    selectedNewFilterOption && selectedNewFilterOption.propertyName === option.propertyName,
                })}
                onClick={() => this.selectNewFilterOption(option)}
              >
                {option.propertyDisplayName}
              </button>
            ))}
          </div>
        </div>
        {!!selectedNewFilterOption &&
          <div className="col-12 col-md-auto flex-grow-1">
            <div className="row">
              <div className="col-12 teams-filters__new-component">
                {selectedNewFilterOption.newFilterComponent}
              </div>
              <div className="col-12 mt-2">
                <button
                  type="button"
                  className="btn rounded-button rounded-button--short rounded-button--small"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    );
  };

  renderAdmittedButtons = (teams: TESCTeam[]) => {
    const { admittedSelection } = this.state;

    const baseClasses = ['btn', 'button-group__button', 'teams-filters__button'];
    const allTeamsClasses = classNames(baseClasses, {
      'button-group__button--active': admittedSelection === AdmittedSelectOption.ALL,
    });
    const admittedTeamsClasses = classNames(baseClasses, {
      'button-group__button--active': admittedSelection === AdmittedSelectOption.ADMITTED,
    });
    const notAdmittedTeamsClasses = classNames(baseClasses, {
      'button-group__button--active': admittedSelection === AdmittedSelectOption.NOT_ADMITTED,
    });

    return (
      <div className="btn-group button-group" role="group">
        <button
          type="button"
          className={allTeamsClasses}
          onClick={() => this.changeAdmissionFilter(AdmittedSelectOption.ALL)}
        >
          All Teams <span className="badge badge-light">{teams.length}</span>
        </button>
        <button
          type="button"
          className={admittedTeamsClasses}
          onClick={() => this.changeAdmissionFilter(AdmittedSelectOption.ADMITTED)}
        >
          Admitted <span className="badge badge-light">{this.admittedTeams.size}</span>
        </button>
        <button
          type="button"
          className={notAdmittedTeamsClasses}
          onClick={() => this.changeAdmissionFilter(AdmittedSelectOption.NOT_ADMITTED)}
        >
          Not Admitted <span className="badge badge-light">{this.notAdmittedTeams.size}</span>
        </button>
      </div>
    );
  }

  render() {
    const { teams, children, onSelectAll, selectAllState } = this.props;
    const { activeFilters } = this.state;

    const newFilterButtonClass = classNames(
      'btn teams-filters__button mr-2', {
        'teams-filters__button--new-closed': !this.state.showNewFilterMenu,
        'teams-filters__button--new-open': this.state.showNewFilterMenu,
      }
    );

    return (
      <>
        <div className="row teams-filters teams-filters--border justify-content-between">
          <div>
            {this.renderAdmittedButtons(teams)}
          </div>
          <div>
            {children}
          </div>
        </div>

        <div className="row teams-filters teams-filters--secondary teams-filters--border">
          <SelectAllCheckbox
            className="teams-filters__checkbox sd-form__input-checkbox mr-2"
            onClick={onSelectAll}
            state={selectAllState}
          />

          <button className={newFilterButtonClass} type="button" onClick={this.toggleNewFilterMenu}>
            Filter
          </button>

          {
            activeFilters.map((filter, i) => {
              return (
                <div key={filter.getDisplayText()} className="btn teams-filters__filter mr-2">
                  <FA name="times" className="teams-filters__filter-delete" onClick={() => this.removeFilter(i)} />
                  {filter.getDisplayText()}
                </div>
              );
            })
          }
        </div>

        {this.renderNewFilterMenu()}
      </>
    );
  }
}
