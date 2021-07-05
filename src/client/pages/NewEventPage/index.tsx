import { TESCEvent } from '@Shared/ModelTypes';
import React from 'react';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { withRouter, RouteComponentProps } from 'react-router';
import { UncontrolledAlert } from 'reactstrap';
import { bindActionCreators } from 'redux';
import { ApplicationDispatch } from '~/actions';
import EventForm, { EventFormData } from '~/components/EventForm';
import { registerNewEvent } from '~/data/AdminApi';

import { addEventSuccessAlert } from '../EventPage/actions';

import createValidator from './validate';

const mapDispatchToProps = (dispatch: ApplicationDispatch) => bindActionCreators({
  showLoading,
  hideLoading,
  addEventSuccessAlert,
}, dispatch);

interface NewEventPageProps {
}

type Props = RouteComponentProps & ReturnType<typeof mapDispatchToProps> & NewEventPageProps;

interface NewEventPageState {
  err: Error;
}

/**
 * This page holds the form to create a new event in the system
 */
class NewEventPage extends React.Component<Props, NewEventPageState> {
  state: Readonly<NewEventPageState> = {
    err: null,
  };

  /**
   * Create a new event in the system
   *
   * @param {NewEventFormData} event the event to be created
   */
  createNewEvent = (event: EventFormData) => {

    // send event to API
    registerNewEvent(event)
      .then((res: TESCEvent) => {
        this.setState({ err: null });
        this.props.addEventSuccessAlert(res.alias, `Successfully Created ${res.name}`, 'Create Event');
        this.props.history.push('/admin/events/' + res.alias);
      })
      .catch((err) => {
        this.setState({ err: err.message });
      });
  }

  render() {
    const validator = createValidator();
    return (
      <div className="page page--admin">
        <div className="event-page__above">
          {this.state.err && <UncontrolledAlert color="danger">
            {this.state.err}
          </UncontrolledAlert>}
        </div>
        <div className="sd-form__header-text text-center mt-3 mb-5">
          <h1>Create A New Event</h1>
        </div>

        <div className="sd-form__wrapper">
          <div className="sd-form">
            <EventForm
              validate={validator}
              onSubmit={this.createNewEvent}
              initialValues={{ organisedBy: 'TESC' }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(null, mapDispatchToProps)(NewEventPage));
