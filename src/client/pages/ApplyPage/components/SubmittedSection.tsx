import React from 'react';
import { reduxForm, WrappedFieldProps, Field } from 'redux-form';

import ApplyPageSection, { ApplyPageSectionProps } from './ApplyPageSection';

interface SubmittedSectionProps extends ApplyPageSectionProps {
}

/**
 * This is the application success page
 */
class SubmittedSection extends ApplyPageSection<{}, SubmittedSectionProps> {
  renderTeamCode = (info: WrappedFieldProps) => (
    <div className="row justify-content-center mb-3">
      <h5>
        Your team code is
      </h5>
      <h4 className="mx-2">
        <u>{info.input.value}</u>
      </h4>
      <h5>
        .
      </h5>
    </div>
  );

  render() {
    const { event } = this.props;

    return (
      <div className="container">
        <div className="row mb-3">
          <div className="col-sm-12 text-center">
            <h3>You have successfully applied for {event.name} </h3>
            <h5>Please check your email for confirmation</h5>
          </div>
        </div>
        {event.options.allowTeammates && <Field name="teamCode" component={this.renderTeamCode} />}
        <div className="row">
          <div className="col">
            <a
              href={event.homepage}
              className="rounded-button sd-form__home text-white text-center"
            >
              Return to {event.name}
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default reduxForm<{}, SubmittedSectionProps>({
  form: 'apply',
  destroyOnUnmount: false,
})(SubmittedSection);
