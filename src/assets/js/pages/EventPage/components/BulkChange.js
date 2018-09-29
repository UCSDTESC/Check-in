import PropTypes from 'prop-types';
import React from 'react';
import {Field, reduxForm} from 'redux-form';

class BulkChange extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
  };

  render() {
    const {handleSubmit, pristine, submitting} = this.props;

    return (
      <form className="bulk-change" onSubmit={handleSubmit}>
        <h2>Bulk Change</h2>
        <div className="form-group">
          <label htmlFor="users">User IDs (one per line)</label>
          <Field component="textarea" className="form-control" name="users"
            placeholder={'5a963f3614d80d32f82ed877'} required="required"/>
        </div>

        <div className="form-group">
          <label htmlFor="status">New Status</label>
          <Field component="select" name="status" className="form-control"
            required="required">
            <option></option>
            <option>Rejected</option>
            <option>Unconfirmed</option>
            <option>Confirmed</option>
            <option>Declined</option>
            <option>Late</option>
            <option>Waitlisted</option>
          </Field>
        </div>

        <div className="form-check mb-3">
          <Field name="sanitize" component="input" type="checkbox" className="form-check-input"/>
          <label htmlFor="sanitize" className="form-check-label">Sanitize Updated Users</label>
        </div>

        <button type="submit" disabled={pristine || submitting}
          className="btn rounded-button rounded-button--small">
          Submit
        </button>
      </form>
    );
  }
}

export default reduxForm({
  form: 'adminBulkChange'
})(BulkChange);

