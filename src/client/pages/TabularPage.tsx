import React from 'react';
import FA from 'react-fontawesome';
import { Nav, NavItem, NavLink } from 'reactstrap';

import AlertPage, { AlertPageState } from './AlertPage';

export interface TabularPageProps {
}

export type Props = TabularPageProps;

export interface TabPage {
  icon: string;
  name: string;
  anchor: string;
  render: () => JSX.Element;
}

export interface TabularPageState extends AlertPageState {
  activeTab: TabPage;
}

export default class TabularPage<P extends Props, S extends TabularPageState> extends
  AlertPage<P & Props, S> {
  tabPages: Readonly<TabPage[]>;

  componentDidUpdate() {
    this.changeTab();
  }

  /**
   * Changes the tab based on the URL hash.
   */
  changeTab = () => {
    let hash = window.location.hash;

    if (hash.length === 0) {
      return;
    }

    const { activeTab } = this.state;
    hash = hash.substring(1);

    if (hash !== activeTab.anchor) {
      const matchingTab = this.tabPages.find((page) => page.anchor === hash);
      if (matchingTab === undefined) {
        return;
      }
      this.setState({ activeTab: matchingTab });
    }
  };

  componentDidMount() {
    this.changeTab();
  }

  renderActiveTab() {
    const { activeTab } = this.state;
    return activeTab.render();
  }
}

interface TabularPageNavProps {
  tabPages: Readonly<TabPage[]>;
  activeTab: TabPage;
}

export class TabularPageNav extends React.Component<TabularPageNavProps> {
  render() {
    const { tabPages, activeTab, children } = this.props;

    return (
      <div className="row tab-page__container">
        <div className="col-12 col-lg">
          <Nav tabs={true} className="tab-page__tabs">
            {tabPages.map((page) => (
              <NavItem key={page.anchor} className="tab-page__nav">
                <NavLink
                  href={`#${page.anchor}`}
                  className="tab-page__link"
                  active={page === activeTab}
                >
                  <FA
                    name={page.icon}
                    className="tab-page__icon"
                  /> {page.name}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </div>
        <div className="order-first order-lg-last col-auto">
          {children}
        </div>
      </div>
    );
  }
}
