import { TESCEvent } from '@Shared/ModelTypes';
import React from 'react';
import FA from 'react-fontawesome';
import { Link } from 'react-router-dom';
import { UncontrolledTooltip } from 'reactstrap/lib/Uncontrolled';

type ViewApplicationProps = {
  event: TESCEvent;
};

class ViewApplication extends React.Component<ViewApplicationProps, {}> {

  render() {
    const {event} = this.props;
    const isEventClosed = new Date(event.closeTime) < new Date;
    return (
      <>
        {isEventClosed && <Link
          to={`/admin/events/${event.alias}/preview`}
          className={`btn event-page__btn rounded-button
          rounded-button--small`}
        >
          Preview Application
          <span className="rounded-button__right">
            <span
              id="previewHelp"
            >
              <FA
                name="question-circle"
                className="text-white"
                style={{fontSize: '1em'}}
              />
            </span>
            <UncontrolledTooltip target="previewHelp" placement="bottom">
              This event is currently not accepting applications.
              You can preview the form before making it public.
            </UncontrolledTooltip>
          </span>
        </Link>}

        {!isEventClosed && <Link
          to={`/register/${event.alias}`}
          className={`btn event-page__btn rounded-button
          rounded-button--small rounded-button--arrow`}
        >
          Go To Form
        </Link>}
      </>
    );
  }
}

export default ViewApplication;
