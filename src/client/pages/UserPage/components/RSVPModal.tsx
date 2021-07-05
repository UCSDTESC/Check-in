import { TESCEvent } from '@Shared/ModelTypes';
import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

interface RSVPModalProps {

  // Toggle function for the model
  toggle: () => void;

  // Variable to track open or close state of the modal
  isOpen: boolean;

  // Callback function for when the status is chosen
  onChooseStatus: (statusChoice: boolean) => void;

  // The event for which the current application is on
  event: TESCEvent;
}

export default class RSVPModal extends React.Component<RSVPModalProps> {

  /**
   * Callback for when an RSVP status is chosen
   *
   * @param {Boolean} status RSVP true or false
   */
  onChooseStatus = (status: boolean) => () => this.props.onChooseStatus(status);

  render() {
    const {toggle, isOpen, event} = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle} className="rsvp-modal">
        <ModalHeader toggle={toggle}>Congratulations!</ModalHeader>
        <ModalBody className="text-center">
          <p>You have been invited to join us at {event.name}!<br/>
          Please confirm your spot below.</p>
        </ModalBody>
        <ModalFooter>
          <Button
            className="rounded-button"
            onClick={this.onChooseStatus(true)}
          >
            Accept
          </Button>{' '}
          <Button
            className="rounded-button rounded-button--secondary"
            onClick={this.onChooseStatus(false)}
          >
            Decline
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
