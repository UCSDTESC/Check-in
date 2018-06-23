import React from 'react';
import PropTypes from 'prop-types';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

import {Event as EventPropType} from '~/proptypes';

export default class RSVPModal extends React.Component {
  static propTypes = {
    toggle: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,

    onChooseStatus: PropTypes.func.isRequired,
    event: PropTypes.shape(EventPropType)
  };

  onChooseStatus = (status) => () => this.props.onChooseStatus(status);

  render() {
    let {toggle, isOpen, event} = this.props;

    return (
      <Modal isOpen={isOpen} toggle={toggle} className="rsvp-modal">
        <ModalHeader toggle={toggle}>Congratulations!</ModalHeader>
        <ModalBody className="text-center">
          <p>You have been invited to join us at {event.name}!<br/>
          Please confirm your spot below.</p>
        </ModalBody>
        <ModalFooter>
          <Button className="rounded-button"
            onClick={this.onChooseStatus(true)}>Accept
          </Button>{' '}
          <Button className="rounded-button rounded-button--secondary"
            onClick={this.onChooseStatus(false)}>Decline</Button>
        </ModalFooter>
      </Modal>
    );
  }
}
