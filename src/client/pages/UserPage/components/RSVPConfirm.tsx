import { TESCEvent } from '@Shared/ModelTypes';
import React from 'react';

import BussingModal from './BussingModal';
import RSVPModal from './RSVPModal';

interface RSVPConfirmProps {
  availableBus?: string;
  onUpdate: (status: boolean, bussing: boolean) => void;
  onClose: () => void;
  event: TESCEvent;
}

interface RSVPConfirmState {
  page: number;
  status: boolean;
}

/**
 * This is the component that renders the RSVP workflow by showing RSVPModal and BussingModal
 */
export default class RSVPConfirm extends React.Component<RSVPConfirmProps, RSVPConfirmState> {
  state: Readonly<RSVPConfirmState> = {
    page: 0,
    status: undefined,
  };

  // set React state to move to next step of the workflow
  nextPage = () => this.setState({page: this.state.page + 1});

  onChooseStatus = (status: boolean) => {
    const {availableBus, onUpdate, onClose} = this.props;

    // If they decline
    if (!status) {
      onUpdate(status, null);
      return onClose();
    }

    if (availableBus) {
      this.setState({status: status});
      return this.nextPage();
    }

    onUpdate(status, null);
    onClose();
  }

  /**
   * Callback function for when the bus is chosen
   *
   * @param {Boolean} bussing the bussing status
   */
  onChooseBus = (bussing: boolean) => {
    const {onUpdate, onClose} = this.props;

    onUpdate(this.state.status, bussing);
    onClose();
  }

  render() {
    const {page} = this.state;
    const {availableBus, onClose, event} = this.props;

    switch (page) {
    case (0):
      return (
        <RSVPModal
          isOpen={true}
          toggle={onClose}
          onChooseStatus={this.onChooseStatus}
          event={event}
        />
      );
    case (1):
      return (
        <BussingModal
          isOpen={true}
          availableBus={availableBus}
          onChooseBus={this.onChooseBus}
        />
      );
    default:
      return  <span/>;
    }
  }
}
