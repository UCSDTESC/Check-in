import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

interface BussingModalProps {

  // boolean to track if the modal is open
  isOpen: boolean;

  // is a bus available for this school?
  availableBus?: string;

  // callback for when the bus is clicked
  onChooseBus: (choice: boolean) => void;
}

/**
 * This is the modal that a user can use to show that they will be getting a bus.
 */
export default class BussingModal extends React.Component<BussingModalProps> {

  /**
   * Callback for the bus choose button
   *
   * @param {Boolean} bussing boolean to track bussing status
   */
  onChooseBus = (bussing: boolean) => () =>
    this.props.onChooseBus(bussing);

  render() {
    const {isOpen, availableBus} = this.props;

    return (
      <Modal isOpen={isOpen} className="rsvp-modal">
        <ModalHeader>Available Bus</ModalHeader>
        <ModalBody className="text-center">
          <div className="rsvp-modal__bussing row">
            <div className="col-md-4">
              <i className="rsvp-modal__bus fa fa-bus" aria-hidden="true"/>
            </div>
            <div className="col-md-8">
              We are sending a bus to your school.
              <h4 className="rsvp-modal__bus-name">{availableBus}</h4>
              Would you like to take this bus?
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="row no-gutters w-100">
            <div className="col-12 text-center mb-2">
              <Button
                className="rounded-button rounded-button--full"
                onClick={this.onChooseBus(true)}
              >
                Yes
              </Button>
            </div>
            <div className="col-12">
              <Button
                className="rounded-button rounded-button--secondary rounded-button--full"
                onClick={this.onChooseBus(false)}
              >
                No thanks, I&#39;ll find my own way
              </Button>
            </div>
          </div>
        </ModalFooter>
      </Modal>
    );
  }
}
