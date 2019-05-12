import { TESCTeam } from '@Shared/ModelTypes';
import React from 'react';
import Loading from '~/components/Loading';

import TeamCard from '../components/TeamCard';

import EventPageTab from './EventPageTab';

interface TeamsTabProps {
  teams: TESCTeam[];
}

export default class TeamsTab extends EventPageTab<TeamsTabProps> {

  render() {
    const { teams } = this.props;

    if (!teams) {
      return <Loading />;
    }

    return (
      <>
        <div className="row teams-filters teams-filters--border">
          <div className="btn-group" role="group" aria-label="Basic example">
            <button type="button" className="btn teams-filters__button teams-filters__button--active">
              All Teams (200)
            </button>
            <button type="button" className="btn teams-filters__button">Admitted (12)</button>
            <button type="button" className="btn teams-filters__button">Not Admitted (188)</button>
          </div>
        </div>

        <div className="row teams-filters teams-filters--secondary teams-filters--border">
          <div className="btn-group mr-2">
            <button type="button" className="btn teams-filters__button">Select All</button>
            <button
              type="button"
              className="btn teams-filters__button dropdown-toggle dropdown-toggle-split"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span className="sr-only">Toggle Dropdown</span>
            </button>
            <div className="dropdown-menu">
              <a className="dropdown-item" href="#">Select Admitted</a>
              <a className="dropdown-item" href="#">Select Not Admitted</a>
            </div>
          </div>

          <button className="btn teams-filters__button teams-filters__button--new mr-2" type="button">
            New Filter
          </button>

          <div className="btn teams-filters__filter mr-2">
            Members are from UCSD
          </div>

          <div className="btn teams-filters__filter mr-2">
            Members are Male
          </div>
        </div>

        <div className="team__container">
          {teams.map(team =>
            <TeamCard key={team._id} team={team} />
          )}
        </div>
      </>
    );
  }
}
