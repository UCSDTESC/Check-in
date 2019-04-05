import React from 'react';

import { Column } from '~/static/types';

interface UserListProps {
  available: Column[];
  columns: Column[];
  onAddColumn: (newColumn: Column) => void;
  onDeleteColumn: (toDelete: Column) => void;
}

interface UserListState {
  newFilter: string;
}

interface IndexedColumn extends Column {
  index: number;
}

export default class UserList extends React.Component<UserListProps, UserListState> {
  state: Readonly<UserListState> = {
    newFilter: '',
  };

  changeFilter = (e: React.FormEvent<HTMLInputElement>) => this.setState({newFilter: e.currentTarget.value});

  /**
   * Add a new column to the list.
   * @param {Object} event The select onChange event.
   */
  newColumn = (event: React.FormEvent<HTMLInputElement>) => {
    this.props.onAddColumn(this.props.available[event.currentTarget.value]);
  };

  render() {
    const {available, columns, onDeleteColumn} = this.props;
    const activeColumnAccessors = Object.values(columns)
      .reduce((agg, col) => {
        agg.push(col.accessor);
        return agg;
      }, []);

    return (
      <form className="sd-form column-editor__container">
        <h4>Columns</h4>
        <div className="row">
          <div className="col-12">
            <select
              className="column-editor__input sd-form__input-select"
              onChange={this.newColumn}
            >
              {available
                .map((available, i) => {
                  return {
                    ...available,
                    index: i,
                  } as IndexedColumn;
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
            {columns.map((column) => (<div
              key={column.accessor}
              className="btn column-editor"
            >
              {column.Header}&nbsp;
              <a
                onClick={() => onDeleteColumn(column)}
                className="badge badge-dark column-editor__badge"
              >
                <i className="fa fa-close"/>
              </a>
              <span className="sr-only">delete column</span>
            </div>))}
          </div>
        </div>
      </form>
    );
  }
}
