import React from 'react';
import { Link } from 'react-router-dom';
import { TESCEvent } from '@Shared/ModelTypes';

type ViewApplicationProps = {
  event: TESCEvent
}

class ViewApplication extends React.Component<ViewApplicationProps, {}> {

  render() {
    const {event} = this.props;
    const isEventClosed = new Date(event.closeTime) < new Date
    return (
      <>
        {isEventClosed && <Link
          to={`/admin/events/${event.alias}/preview`}
          className={`btn event-page__btn rounded-button
          rounded-button--small rounded-button--arrow`}
        >
          Preview Dummy Application
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