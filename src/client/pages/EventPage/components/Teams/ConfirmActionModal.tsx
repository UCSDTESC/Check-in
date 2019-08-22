import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ToggleSwitch from '~/components/ToggleSwitch';

interface ConfirmActionModalProps {
  isOpen: boolean;
  actionType: string;
  selectedUsers: number;
  onConfirmChoice: (confirm: boolean, toSendEmail: boolean) => void;
}

interface ConfirmActionModalState {
  toSendEmail: boolean;
}

export default class ConfirmActionModal extends React.Component<ConfirmActionModalProps, ConfirmActionModalState> {

  constructor(props: ConfirmActionModalProps) {
    super(props);
    this.state = {
      toSendEmail: false
    }
  }

  render() {
    const { isOpen, onConfirmChoice, actionType, selectedUsers } = this.props;
    const {toSendEmail} = this.state;
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
              <div className="d-flex w-75 my-3 mx-auto">
                <ToggleSwitch 
                  className="d-inline-block" 
                  checked={toSendEmail}
                  onChange={() => this.setState({toSendEmail: !toSendEmail})}/>
                <span className="align-self-center ml-auto">
                  Send {actionType} Email To {selectedUsers} Applicant
                  {selectedUsers != 1 ? 's' : ''}?
                </span>
              </div>
              <Button
                className="rounded-button rounded-button--full"
                onClick={() => onConfirmChoice(true, toSendEmail)}
              >
                {actionType}
              </Button>
            </div>
            <div className="col-12">
              <Button
                className="rounded-button rounded-button--secondary rounded-button--full"
                onClick={() => onConfirmChoice(false, false)}
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
