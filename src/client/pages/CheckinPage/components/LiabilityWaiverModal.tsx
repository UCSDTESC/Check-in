import { TESCEvent } from '@Shared/ModelTypes';
import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

interface LiabilityWaiverModalProps {

  // The event for which we want to show the liability waiver.
  event: TESCEvent;

  // Callback to be called after agreement to the waiver
  onWaiverAgree: () => void;

  // Callback to toggle this modal
  toggleModal: () => void;

  // The state of this modal.
  isOpen: boolean;
}

/**
 * The Liability waiver that a user must agree to to be let into the event.
 */
export default class LiabilityWaiverModal extends React.Component<LiabilityWaiverModalProps> {
  render() {
    const {event, isOpen, toggleModal, onWaiverAgree} = this.props;

    return (
      <Modal
        isOpen={isOpen}
        toggle={toggleModal}
        className="modal-lg"
      >
        <ModalHeader toggle={toggleModal}>Liability Waiver</ModalHeader>
        <ModalBody>
          <object
            width="100%"
            height="500px"
            data={event.checkinWaiver}
          />
        </ModalBody>t
        <ModalFooter>
          <Button color="primary" onClick={onWaiverAgree}>I agree</Button>
          {' '}
          <Button color="secondary" onClick={toggleModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}
