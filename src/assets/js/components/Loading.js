import React from "react";
import PropTypes from "prop-types";

export default class Hero extends React.Component {
  static propTypes = {
    title: PropTypes.string,
  };

  render() {
    let {title} = this.props;

    return (<div className="container">
      <div className="row">
        <div className="col-12 text-center">
          <h1>Loading{title && " " + title}...</h1>
          <img className="sd-form__loading" src="/img/site/loading.svg" />
        </div>
      </div>
    </div>);
  }
}
