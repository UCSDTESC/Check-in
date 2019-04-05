import React from 'react';
import {connect} from 'react-redux';
import {withRouter, RouteComponentProps} from 'react-router';
import {bindActionCreators} from 'redux';
import {showLoading, hideLoading} from 'react-redux-loading-bar';
import {UncontrolledAlert} from 'reactstrap';

import {addEventSuccessAlert} from '../EventPage/actions';

import createValidator from './validate';

import {registerNewEvent} from '~/data/Api';

import NewEventForm from './components/NewEventForm';
import { TESCEvent } from '~/static/types';
import { ApplicationDispatch } from '~/actions';

const mapDispatchToProps = (dispatch: ApplicationDispatch) => ({
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
  addEventSuccessAlert: bindActionCreators(addEventSuccessAlert, dispatch),
});

interface NewEventPageProps {
}

type Props = RouteComponentProps & ReturnType<typeof mapDispatchToProps> & NewEventPageProps;

interface NewEventPageState {
  err: Error;
}

class NewEventPage extends React.Component<Props, NewEventPageState> {
  state: Readonly<NewEventPageState> = {
    err: null,
  };

  createNewEvent = (event: TESCEvent) => {
    registerNewEvent(event)
      .then((res: TESCEvent) => {
        this.setState({err: null});
        this.props.addEventSuccessAlert(res.alias, `Successfully Created ${res.name}`, 'Create Event');
        this.props.history.push('/admin/events/' + res.alias);
      })
      .catch((err) => {
        this.setState({err: err.message});
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
            <NewEventForm
              validate={validator}
              onSubmit={this.createNewEvent}
              initialValues={{organisedBy: 'TESC'}}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(null, mapDispatchToProps)(NewEventPage));
