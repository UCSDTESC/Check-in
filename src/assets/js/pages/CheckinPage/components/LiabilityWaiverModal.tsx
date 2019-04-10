import React from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button} from 'reactstrap';
import { TESCEvent } from '~/static/types';

interface LiabilityWaiverModalProps {
  event: TESCEvent;
  onWaiverAgree: () => void;
  toggleModal: () => void;
  isOpen: boolean;
}

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
