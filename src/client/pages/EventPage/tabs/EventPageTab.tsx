import { TESCEvent } from '@Shared/ModelTypes';
import React from 'react';

import { Props } from '../index';

interface EventPageTabProps {
  event: TESCEvent;
}

/**
 * This is an abstraction that provides every EventPage tab with access to the event directly.
 * This means that we don't have to explicitly tell every tab which event we are currently on.
 */
export default class EventPageTab<P, S = {}> extends React.Component<P & EventPageTabProps & Props, S> {
}
