import React from 'react';
import { exportUsers, bulkChange } from '~/data/Api';
import { AlertType } from '~/pages/AlertPage';

import BulkChange, { BulkChangeFormData } from '../components/BulkChange';
import { EventAlert } from '../reducers/types';

import EventPageTab from './EventPageTab';

interface ActionsTabProps {
}

export default class ActionsTab extends EventPageTab<ActionsTabProps> {
  exportUsers = () => {
    const eventAlias = this.props.event.alias;
    exportUsers(eventAlias)
      .end((err, res) => {
        // Download as file
        const blob = new Blob([res.text], {type: 'text/csv;charset=utf-8;'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${eventAlias}-${Date.now()}.csv`);
        document.body.appendChild(link);

        link.click();
      });
  }

  onBulkChange = (values: BulkChangeFormData) => {
    const {event} = this.props;
    const {users, status} = values;

    bulkChange(users, status)
      .then(() => {
        this.props.addEventSuccessAlert(event.alias, 'Successfully updated users!', 'Bulk Change');
      })
      .catch((err) => {
        this.props.addEventDangerAlert(event.alias, err.message, 'Bulk Change');
        console.error(err);
      });
  };

  render() {
    return (
      <div className="event-tab">
        <div className="row">
          <div className="col-lg-3 col-md-6">
            <h2>User Actions</h2>
            <a
              className="btn event-page__btn rounded-button rounded-button--small"
              onClick={this.exportUsers}
              href="#"
            >
              Export All Users
            </a>
          </div>
          <div className="col-lg-4 col-md-6">
            <BulkChange onSubmit={this.onBulkChange} />
          </div>
          <div className="col-lg-4 col-md-6"/>
        </div>
      </div>
    );
  }
}
