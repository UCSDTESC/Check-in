import PropTypes from 'prop-types';
import React from 'react';
import {Button} from 'reactstrap';

import {Admin as AdminPropTypes} from '~/proptypes';

export default class AdminList extends React.Component {
  static propTypes = {
    admins: PropTypes.arrayOf(PropTypes.shape(
      AdminPropTypes
    ).isRequired).isRequired,
    onDeleteAdmin: PropTypes.func.isRequired,
    editing: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      columns: {
        'username': 'Username',
        'role': 'Role'
      }
    };
  }

  /**
   * Creates a header by the given name.
   * @param {String} name The name of the column to display.
   * @returns {Component} The header component to render.
   */
  renderHeader(name) {
    return (<th key={name} className='admin-list__header'>
      {name}
    </th>);
  }

  renderAdmin = (admin, columns) =>
    <tr key={admin._id}>
      {columns.map(col => <td key={col.key}>{admin[col.key]}</td>)}
    </tr>;

  render() {
    let {columns} = this.state;
    let {admins, onDeleteAdmin, editing} = this.props;

    return (
      <table className="admin-list table">
        <thead>
          <tr className="admin-list__row">
            <th className="admin-list__header admin-list__header--small">
            </th>

            {Object.values(columns).map(name => this.renderHeader(name))}
          </tr>
        </thead>

        <tbody>
          {admins && admins.map(admin =>
            <tr key={admin.username} className="admin-list__row">
              <td className="admin-list__value admin-list__value--small">
                {editing && <Button color="danger" outline
                  onClick={() => onDeleteAdmin(admin._id) }>
                  <i className="fa fa-ban"></i>
                </Button>}
              </td>
              {Object.keys(columns).map(column =>
                <td key={column} className="admin-list__value">
                  {admin[column]}
                </td>
              )}
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}
