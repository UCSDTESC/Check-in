import { TESCUser } from '@Shared/ModelTypes';
import React from 'react';
import ToggleSwitch from '~/components/ToggleSwitch';

interface ResumeListProps {

  // callback for when the compact state toggle is clicked
  onCompactChange: () => void;

  // the compacted state
  isCompacted: boolean;

  // the users to render
  applicants: TESCUser[];
}

interface ColumnMap {
  [propertyName: string]: string;
}

interface ResumeListState {

  // columns shown on screen
  columns: ColumnMap;
  smallColumns: string[];
  mediumColumns: string[];
}

/**
 * This is the resume list that is rendered in the sponsor tool
 */
class ResumeList extends React.Component<ResumeListProps, ResumeListState> {
  state: Readonly<ResumeListState> = {
    columns: {
      firstName: 'First Name',
      lastName: 'Last Name',
      year: 'Year',
      status: 'Status',
      university: 'University',
      gender: 'Gender',
      major: 'Major',
    },
    smallColumns: [
      'Year',
      'Gender',
      'Status',
    ],
    mediumColumns: [
      'First Name',
      'Last Name',
    ],
  };

  /**
   * Creates a header by the given name.
   * @param {String} name The name of the column to display.
   * @returns {Component} The header component to render.
   */
  renderHeader(name: string) {
    const {smallColumns, mediumColumns} = this.state;
    const small = smallColumns.indexOf(name) !== -1;
    const medium = mediumColumns.indexOf(name) !== -1;
    return (
      <th
        key={name}
        className={`admin-list__header admin-list__header--${small ? 'small' : (medium ? 'medium' : 'large')}`}
      >
        {name}
      </th>
    );
  }

  render() {
    const {columns} = this.state;
    const {applicants, isCompacted, onCompactChange} = this.props;

    return (
      <table className={`admin-list table ${isCompacted ? 'table-sm' : ''}`}>
        <thead>
          <tr className="admin-list__row">
            <th className="admin-list__header admin-list__header--spacer"/>

            {Object.values(columns).map(name => this.renderHeader(name))}

            <th className="admin-list__header">
              <div className="admin-list__toggle">
                <ToggleSwitch
                  checked={isCompacted}
                  onChange={onCompactChange}
                />
                Compact View:&nbsp;
                <span
                  className={`admin-list__compacted text-uppercase ${isCompacted ? 'admin-list__compacted--active' :
                    'admin-list__compacted--inactive'}`}
                >
                  {isCompacted ? 'ON' : 'OFF'}
                </span>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {applicants && applicants.map(applicant =>
            (<tr className="admin-list__row" key={applicant._id}>
              <td className="admin-list__value admin-list__value--spacer"/>
              {Object.keys(columns).map(column =>
                (<td className="admin-list__value text-wrap" key={column}>
                {/*
                  // TODO: Fix accessing dynamic properties
                  // @ts-ignore */}
                  {applicant[column]}
                </td>)
              )}
              <td className="admin-list__value">
                <a
                  href={applicant.resume.url}
                  download={true}
                  className={`btn rounded-button rounded-button--small
                  ${isCompacted ? 'admin-list__btn--compacted' : ''}`}
                >
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
