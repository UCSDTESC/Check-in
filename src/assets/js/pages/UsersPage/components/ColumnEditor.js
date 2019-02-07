import PropTypes from 'prop-types';
import React from 'react';

import {Column as ColumnPropTypes} from '~/proptypes';

export default class UserList extends React.Component {
  static propTypes = {
    available: PropTypes.arrayOf(PropTypes.shape(
      ColumnPropTypes
    ).isRequired).isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape(
      ColumnPropTypes
    ).isRequired).isRequired,
    onAddColumn: PropTypes.func.isRequired,
    onDeleteColumn: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      newFilter: ''
    };
  }

  changeFilter = (e) => this.setState({newFilter: e.target.value});

  /**
   * Add a new column to the list.
   * @param {Object} event The select onChange event.
   */
  newColumn = (event) => {
    this.props.onAddColumn(this.props.available[event.target.value]);
  };

  render() {
    let {available, columns, onDeleteColumn} = this.props;
    let activeColumnAccessors = Object.values(columns)
      .reduce((agg, col) => {
        agg.push(col.accessor);
        return agg;
      }, []);

    return (
      <form className="sd-form column-editor__container">
        <h4>Columns</h4>
        <div className="row">
          <div className="col-12">
            <select className="column-editor__input sd-form__input-select"
              onChange={this.newColumn}>
              {available
                .map((available, i) => {
                  available.index = i;
                  return available;
                })
                .filter((available) =>
                  !(activeColumnAccessors.includes(available.accessor)))
                .map((available) =>
                (<option key={available.index} value={available.index}>
                  {available.Header}
                </option>))}
            </select>
          </div>
          <div className="col-12">
            {columns.map((column) => (<div key={column.accessor}
              className="btn column-editor">
              {column.Header}&nbsp;
              <a onClick={() => onDeleteColumn(column.accessor)}
                className="badge badge-dark column-editor__badge">
                <i className="fa fa-close"></i></a>
              <span className="sr-only">delete column</span>
            </div>))}
          </div>
        </div>
      </form>
    );
  }
}
