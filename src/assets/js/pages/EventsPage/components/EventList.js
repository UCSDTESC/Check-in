import PropTypes from 'prop-types';
import React from 'react';
import {Button} from 'reactstrap';
import {Link} from 'react-router-dom';
import FontAwesome from 'react-fontawesome';

import {Event as EventPropTypes} from '~/proptypes';

export default class EventList extends React.Component {
  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.shape(
      EventPropTypes
    ).isRequired).isRequired,
    onDeleteEvent: PropTypes.func.isRequired,
    editing: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      columns: {
        'name': 'Name'
      }
    };
  }

  /**
   * Creates a header by the given name.
   * @param {String} name The name of the column to display.
   * @returns {Component} The header component to render.
   */
  renderHeader(name) {
    return (<th key={name} className='event-list__header'>
      {name}
    </th>);
  }

  render() {
    let {columns} = this.state;
    let {events, onDeleteEvent, editing} = this.props;

    return (
      <table className="event-list table">
        <thead>
          <tr className="event-list__row">
            <th className="event-list__header event-list__header--small">
            </th>
            <th className="event-list__header event-list__header--small">
            </th>

            {Object.values(columns).map(name => this.renderHeader(name))}
          </tr>
        </thead>

        <tbody>
          {events && events.map(event =>
            <tr key={event.name} className="event-list__row">
              <td className="event-list__value event-list__value--small">
                {editing && <Button color="danger" outline
                  onClick={() => onDeleteEvent(event._id) }>
                  <i className="fa fa-ban"></i>
                </Button>}
              </td>
              <td className="event-list__value event-list__value--small">
                <Link to={"/admin/events/" + event._id} class="btn btn-success">
                  <FontAwesome name="angle-double-left" /> Visit
                </Link>
              </td>
              {Object.keys(columns).map(column =>
                <td key={column} className="event-list__value">
                  {event[column]}
                </td>
              )}
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}
