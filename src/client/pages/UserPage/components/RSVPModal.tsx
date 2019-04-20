import { TESCEvent } from 'Shared/types';
import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

interface RSVPModalProps {
  toggle: () => void;
  isOpen: boolean;

  onChooseStatus: (statusChoice: boolean) => void;
  event: TESCEvent;
}

export default class RSVPModal extends React.Component<RSVPModalProps> {
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
