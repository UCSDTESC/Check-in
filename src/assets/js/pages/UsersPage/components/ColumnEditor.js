import PropTypes from 'prop-types';
import React from 'react';

import {Column as ColumnPropTypes} from '~/proptypes';

export default class UserList extends React.Component {
  static propTypes = {
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
   */
  newColumn = (e) => {
    e.preventDefault();
    this.props.onAddColumn(this.state.newFilter);
    this.setState({
      newFilter: ''
    });
  };

  render() {
    let {columns, onDeleteColumn} = this.props;

    return (
      <form className="sd-form column-editor__container"
        onSubmit={this.newColumn}>
        <h4>Columns</h4>
        <div className="row">
          <div className="col-12">
            <input type="text" placeholder="Column Field"
              className="column-editor__input sd-form__input-text"
              value={this.state.newFilter} onChange={this.changeFilter} />
          </div>
          <div className="col-12">
            {columns.map((column) => (<button key={column.accessor}
              className="btn column-editor">
              {column.Header}&nbsp;
              <a onClick={() => onDeleteColumn(column.accessor)}
                className="badge badge-dark column-editor__badge">
                <i className="fa fa-close"></i></a>
              <span className="sr-only">delete column</span>
            </button>))}
          </div>
        </div>
      </form>
    );
  }
}
