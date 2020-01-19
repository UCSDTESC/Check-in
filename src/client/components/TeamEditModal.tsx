import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

interface TeamEditModalProps {
  open: boolean;
  toggle: () => void;
}

interface TeamEditModalState {
  modal: boolean;
}

export default class TeamEditModal extends React.Component<TeamEditModalProps, TeamEditModalState> {
  constructor(props: TeamEditModalProps) {
    super(props);

    this.state = {
      modal: (props.open ? props.open : false),
    };
  }

  render() {
    const { open, toggle } = this.props;

    return (
      <div>
        <Modal
          isOpen={open}
          toggle={toggle}
          size="lg"
        >
          <ModalHeader toggle={toggle}>
            Edit Team
          </ModalHeader>
          <ModalBody />
          <ModalFooter>
            <button
              type="submit"
              className="rounded-button rounded-button--short rounded-button--small"
            >
              Edit
            </button>

          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
