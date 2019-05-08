import React, { ReactNode } from 'react';

interface SectionProps {
  name?: string;
  children: ReactNode;
}

export default class Section extends React.Component<SectionProps> {
  render() {
    const {name, children} = this.props;

    return (
      <div className="admin-sidebar__section">
        {name && <div className="admin-sidebar__section-title text-uppercase">
          {name}
        </div>}
        {children}
      </div>
    );
  }
}
