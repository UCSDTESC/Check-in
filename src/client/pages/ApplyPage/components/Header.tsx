import { Logo } from '@Shared/ModelTypes';
import React from 'react';

interface HeaderProps {

  //Name of the event
  name: string;

  //Logo of the event 
  logo: Logo;

  //Description of the event
  description: string;
}

export default class Header extends React.Component<HeaderProps> {
  render() {
    const {name, logo, description} = this.props;

    if (!name || !logo) {
      return (<div/>);
    }

    return (
      <div className="container sd-form__header">
        <div className="row">
          <div className="col-12 col-md-2 text-center">
            <img className="sd-form__header-logo" src={logo.url} />
          </div>
          <div className="col-12 col-md-10 text-center text-md-left align-self-center">
            <div className="sd-form__header-text">Register for {name}</div>
            {description && <div className="sd-form__desc">{description}</div>}
          </div>
        </div>
      </div>
    );
  }
}
