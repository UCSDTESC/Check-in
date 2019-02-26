import PropTypes from 'prop-types';
import React from 'react';

import {exportUsers, bulkChange, exportTeams} from '~/data/Api';

import BulkChange from '../components/BulkChange';

import {Event as EventPropType} from '~/proptypes';

export default class ActionsTab extends React.Component {
  static propTypes = {
    event: PropTypes.shape(EventPropType).isRequired
  };

  exportUsers = () => {
    let eventAlias = this.props.event.alias;
    exportUsers(eventAlias)
      .end((err, res) => {
        // Download as file
        var blob = new Blob([res.text], {type: 'text/csv;charset=utf-8;'});
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${eventAlias}-${Date.now()}.csv`);
        document.body.appendChild(link);

        link.click();
      });
  }

  exportTeams = () => {
    let eventAlias = this.props.event.alias;
    exportTeams(eventAlias)
      .end((err, res) => {
        // Download as file
        var blob = new Blob([res.text], {type: 'text/csv;charset=utf-8;'});
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        // need to put admin username into the teams filename - "teams-${eventAlias}-${admin}"
        link.setAttribute('download', `teams-${eventAlias}-${Date.now()}.csv`);
        document.body.appendChild(link);

        link.click();
      });
  }

  onBulkChange = (values) => {
    let {users, status} = values;

    bulkChange(users, status)
      .then(() => {
        this.createAlert('Successfully updated users!', 'success',
          'Bulk Change');
      })
      .catch((err) => {
        this.createAlert(err.message, 'danger', 'Bulk Change');
        console.error(err);
      });
  };

  render() {
    return (
      <div className="event-tab">
        <div className="row">
          <div className="col-lg-3 col-md-6">
            <h2>User Actions</h2>
            <a className={`btn event-page__btn rounded-button
              rounded-button--small`} onClick={this.exportUsers}
              href="#">Export All Users</a>
            <br /> <br />
            <a className={`btn event-page__btn rounded-button
              rounded-button--small`} onClick={this.exportTeams}
              href="#">Export Teams</a>
          </div>
          <div className="col-lg-4 col-md-6">
            <BulkChange onSubmit={this.onBulkChange} />
          </div>
          <div className="col-lg-4 col-md-6">
          </div>
        </div>
      </div>
    );
  }
}
