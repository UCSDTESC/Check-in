import React from "react";
import PropTypes from "prop-types";

import NavHeader from "~/components/NavHeader";

export default class Hero extends React.Component {
  static propTypes = {
    background: PropTypes.string,
    white: PropTypes.bool,
  };

  render() {
    let {background, white} = this.props;
    let heroStyle = {};
    let heroClass = "hero";

    if (background) {
      heroStyle.backgroundImage = `url(${background})`;
      heroClass += " hero--expanded";
    }

    if (white) {
      heroClass += " hero--white";
    }

    return (<div className={heroClass} style={heroStyle}>
      <NavHeader />
    </div>);
  }
}
