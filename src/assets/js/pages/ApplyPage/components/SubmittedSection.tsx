import React from 'react';
import { ApplyPageSectionProps } from './ApplyPageSection';

export default class SubmittedSection extends React.Component<ApplyPageSectionProps> {
  render() {
    const {event} = this.props;

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12 text-center">
            <h3>You have successfully applied for {event.name} </h3>
            <h5>Please check your email for confirmation</h5>
            <a
              href={event.homepage}
              className="rounded-button sd-form__home text-white"
            >
              Return to {event.name}
            </a>
          </div>
        </div>
      </div>
    );
  }
}