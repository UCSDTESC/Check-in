import React, { CSSProperties } from 'react';
import NavHeader from '~/components/NavHeader';

interface HeroProps {
  background?: string;
  white?: boolean;
}

export default class Hero extends React.Component<HeroProps> {
  render() {
    const {background, white} = this.props;
    const heroStyle: CSSProperties = {};
    let heroClass = 'hero';

    if (background) {
      heroStyle.backgroundImage = `url(${background})`;
      heroClass += ' hero--expanded';
    }

    if (white) {
      heroClass += ' hero--white';
    }

    return (
      <div className={heroClass} style={heroStyle}>
        <NavHeader />
      </div>
    );
  }
}
