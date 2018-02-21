import React from 'react';
import {Link} from 'react-router-dom';
import {Collapse} from 'reactstrap';

export default class NavHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isHidden: true,
      isBackgroundActive: false,
      isLogoUp: true,
      scrollCutoff: 100
    };
  }

  onMobileClick = () =>
    this.setState({
      isHidden: !this.state.isHidden
    });

  handleScroll = () => {
    let {scrollCutoff} = this.state;

    this.setState({
      isBackgroundActive: $(window).scrollTop() > 0,
      isLogoUp: $(window).scrollTop() <= scrollCutoff
    });
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    this.handleScroll();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    const {isHidden, isBackgroundActive} = this.state;
    const activeBackground = (isBackgroundActive ?
      'sd-nav__background-active' : '');

    return (<nav className={'sd-nav'}>
      <div className={`sd-nav__background ${activeBackground}`}></div>
      <div className="container">
        <nav className={`nav flex-row align-items-md-center align-items-start
        pb-3`}>
          <div className="flex-row">
            <Link to="/">
              <img className="sd-nav__logo" src="/img/vectors/tesc-blue.svg" />
            </Link>
          </div>

          <ul className={`sd-nav__links flex-row ml-md-auto d-none d-md-flex
          align-items-center`}>
            {/* <li className="sd-nav__link-item">
              <Link className="sd-nav__link" to="/register/hackxx">
                HackXX Registration
              </Link>
            </li>
            <li className="sd-nav__link-item">
              <Link className="sd-nav__link" to="/admin">Admin Panel</Link>
            </li>
            <li className="sd-nav__link-item">
              <Link className="sd-nav__link" to="#">Other</Link>
            </li> */}
          </ul>

          {/* <div className="flex-column ml-auto d-flex d-md-none">
            <button className="navbar-toggler hamburger__toggler" type="button"
              onClick={this.onMobileClick}>
              <span className="navbar-toggler-icon hamburger__toggle-icon">
              </span>
            </button>
          </div> */}
        </nav>
      </div>

      <Collapse className="hamburger flex-column" isOpen={!isHidden}>
        <ul className="hamburger__links">
          {/* <li className="hamburger__link-item">
            <Link className="hamburger__link" to="/register/hackxx">
              HackXX Regstration
            </Link>
          </li>
          <li className="hamburger__link-item">
            <Link className="hamburger__link" to="/admin">Admin Panel</Link>
          </li>
          <li className="hamburger__link-item hamburger__link-item">
            <Link className="hamburger__link hamburger__link" to="#">
              Other
            </Link>
          </li> */}
        </ul>
      </Collapse>
    </nav>);
  }
};
