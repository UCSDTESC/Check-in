import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

interface ConfirmActionModalProps {
  isOpen: boolean;
  actionType: string;
  selectedUsers: number;
  onConfirmChoice: (confirm: boolean) => void;
}

export default class ConfirmActionModal extends React.Component<ConfirmActionModalProps> {
  render() {
    const { isOpen, onConfirmChoice, actionType, selectedUsers } = this.props;

    const confirmText = `${actionType} ${selectedUsers} User${selectedUsers === 1 ? '' : 's'}`;

    return (
      <Modal isOpen={isOpen}>
        <ModalHeader>{confirmText}</ModalHeader>
        <ModalBody className="text-center">
          Are you sure you'd like to {confirmText.toLocaleLowerCase()}?
        </ModalBody>
        <ModalFooter>
          <div className="row no-gutters w-100">
            <div className="col-12 text-center mb-2">
              <Button
                className="rounded-button rounded-button--full"
                onClick={() => onConfirmChoice(true)}
              >
                {actionType}
              </Button>
            </div>
            <div className="col-12">
              <Button
                className="rounded-button rounded-button--secondary rounded-button--full"
                onClick={() => onConfirmChoice(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}
