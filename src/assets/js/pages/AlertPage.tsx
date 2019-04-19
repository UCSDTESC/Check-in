import React from 'react';
import { UncontrolledAlert } from 'reactstrap';

export enum AlertType {
  Primary = 'primary',
  Secondary = 'secondary',
  Success = 'success',
  Danger = 'danger',
  Waring = 'warning',
  Info = 'info',
  Light = 'light',
  Dark = 'dark',
}

export interface PageAlert {
  message: string;
  type: AlertType;
  title: string;
}

export interface AlertPageState {
  alerts: PageAlert[];
}

/**
 * Allows for extension with bootstrap alerts in the state.
 */
export default class AlertPage<P, S extends AlertPageState> extends React.Component<P, S> {
  /**
   * Creates a new alert to render to the top of the screen.
   * @param {String} message The message to display in the alert.
   * @param {AlertType} type The type of alert to show.
   * @param {String} title The title of the alert.
   */
  createAlert(message: string, type: AlertType = AlertType.Danger, title: string = '') {
    this.setState({
      alerts: [...this.state.alerts, {
        message,
        type,
        title,
      } as PageAlert],
    });
  }

  /**
   * Creates a new error alert if there was a login error.
   * @param {PageAlert} alert The alert to display.
   * @param {String} key The given key for the element map.
   * @param {String} className Override the alert with a different className.
   * @returns {Component}
   */
  renderAlert(alert: PageAlert, key: number = 0, className: string = 'user-page__error') {
    const {message, type, title} = alert;
    if (message) {
      return (
        <div className={className} key={key}>
          <UncontrolledAlert color={type}>
            <div className="container">
              <strong>{title}</strong> {message}
            </div>
          </UncontrolledAlert>
        </div>
      );
    }
  }
}
