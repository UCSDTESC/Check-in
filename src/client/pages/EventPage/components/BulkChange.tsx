import { UserStatus } from '@Shared/UserStatus';
import React from 'react';
import { Field, reduxForm, InjectedFormProps } from 'redux-form';

export interface BulkChangeFormData {

  // new line separated
  users: string;

  // new status to be set
  status: string;
}

interface BulkChangeProps {

}

// Use a union of BulkChangeProps and Redux Form's Props
type Props = InjectedFormProps<BulkChangeFormData, BulkChangeProps> & BulkChangeProps;

/**
 * This component implements a feature to update multiple users' statuses by their user IDs
 */
class BulkChange extends React.Component<Props> {
  render() {
    const {handleSubmit, pristine, submitting} = this.props;

    return (
      <form className="bulk-change" onSubmit={handleSubmit}>
        <h2>Bulk Change</h2>
        <div className="form-group">
          <label>User IDs (one per line)</label>
          <Field
            component="textarea"
            className="form-control"
            name="users"
            placeholder={'5a963f3614d80d32f82ed877'}
            required="required"
          />
        </div>

        <div className="form-group">
          <label>New Status</label>
          <Field
            component="select"
            name="status"
            className="form-control"
            required="required"
          >
            <option />
            {Object.entries(UserStatus).map(([key, status]) => (
              <option key={key}>{status}</option>
            ))}
          </Field>
        </div>

        <button
          type="submit"
          disabled={pristine || submitting}
          className="btn rounded-button rounded-button--small"
        >
          Submit
        </button>
      </form>
    );
  }
}

export default reduxForm<BulkChangeFormData, BulkChangeProps>({
  form: 'adminBulkChange',
})(BulkChange);
