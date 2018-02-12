import PropTypes from 'prop-types';
import React from 'react';

import ToggleSwitch from '~/components/ToggleSwitch';

import {Applicants as ApplicantsPropType} from '~/proptypes';

class ResumeList extends React.Component {
  static propTypes = {
    onCompactChange: PropTypes.func.isRequired,
    isCompacted: PropTypes.bool.isRequired,
    applicants: PropTypes.arrayOf(PropTypes.shape(
      ApplicantsPropType
    ).isRequired)
  };

  constructor(props) {
    super(props);
    this.state = {
      columns: {
        'firstName': 'First Name',
        'lastName': 'Last Name',
        'year': 'Year',
        'university': 'University',
        'gender': 'Gender',
        'major': 'Major'
      },
      smallColumns: [
        'Year',
        'Gender'
      ],
      mediumColumns: [
        'First Name',
        'Last Name'
      ]
    };
  }

  /**
   * Creates a header by the given name.
   * @param {String} name The name of the column to display.
   * @returns {Component} The header component to render.
   */
  renderHeader(name) {
    let {smallColumns, mediumColumns} = this.state;
    let small = smallColumns.indexOf(name) !== -1;
    let medium = mediumColumns.indexOf(name) !== -1;
    return (<th key={name} className={`admin-list__header
      admin-list__header--${small ? 'small' : (medium ? 'medium' : 'large')}`}>
      {name}
    </th>);
  }

  render() {
    let {columns} = this.state;
    let {applicants, isCompacted, onCompactChange} = this.props;

    return (
      <table className={`admin-list table ${isCompacted ? 'table-sm' : ''}`}>
        <thead>
          <tr className="admin-list__row">
            <th className="admin-list__header admin-list__header--spacer">
            </th>

            {Object.values(columns).map(name => this.renderHeader(name))}

            <th className="admin-list__header">
              <div className="admin-list__toggle">
                <ToggleSwitch checked={isCompacted}
                  onChange={onCompactChange} />
                Compact View:&nbsp;
                <span className={`admin-list__compacted text-uppercase
                ${isCompacted ? 'admin-list__compacted--active' :
        'admin-list__compacted--inactive'}`}>
                  {isCompacted ? 'ON' : 'OFF'}
                </span>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {applicants && applicants.map(applicant =>
            (<tr className="admin-list__row" key={applicant._id}>
              <td className="admin-list__value admin-list__value--spacer">
              </td>
              {Object.keys(columns).map(column =>
                (<td className="admin-list__value" key={column}>
                  {applicant[column]}
                </td>)
              )}
              <td className="admin-list__value">
                <a
                  href={applicant.resume.url} download
                  className={`btn rounded-button rounded-button--small
                  ${isCompacted ? 'admin-list__btn--compacted' : ''}`}>
                  Download Resume
                </a>
              </td>
            </tr>)
          )}
        </tbody>
      </table>
    );
  }
}

export default ResumeList;

