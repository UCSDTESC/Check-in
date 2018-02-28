import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Collapse} from 'reactstrap';

class NavHeader extends React.Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    title: PropTypes.string
  };

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

  renderUnauthenticatedLinks() {
    return ([
      <li className="sd-nav__link-item" key={0}>
        <Link className="sd-nav__link" to="/login">
          Login
        </Link>
      </li>
    ]);
  }

  renderUnauthenticatedHamburgerLinks() {
    return ([
      <li className="hamburger__link-item" key={0}>
        <Link className="hamburger__link" to="/login">
          Login
        </Link>
      </li>
    ]);
  }

  renderAuthenticatedLinks() {
    return ([
      <li className="sd-nav__link-item" key={0}>
        <Link className="sd-nav__link" to="/user/hackxx">
          Profile
        </Link>
      </li>,
      <li className="sd-nav__link-item" key={1}>
        <Link className="sd-nav__link" to="/logout">
          Logout
        </Link>
      </li>
    ]);
  }

  renderAuthenticatedHamburgerLinks() {
    return ([
      <li className="hamburger__link-item" key={0}>
        <Link className="hamburger__link" to="/user/hackxx">
          Profile
        </Link>
      </li>,
      <li className="hamburger__link-item" key={1}>
        <Link className="hamburger__link" to="/logout">
          Logout
        </Link>
      </li>
    ]);
  }

  render() {
    const {isHidden, isBackgroundActive} = this.state;
    const {authenticated, title} = this.props;
    const activeBackground = (isBackgroundActive ?
      'sd-nav__background-active' : '');

    return (<nav className={'sd-nav'}>
      <div className={`sd-nav__background ${activeBackground}`}></div>
      <div className="container">
        <nav className={`nav flex-row align-items-md-center align-items-start
        pb-3`}>
          <div className="flex-row justify-items-center">
            <Link to="/">
              <img className="sd-nav__logo" src="/img/vectors/tesc-blue.svg" />
            </Link>
          </div>

          <div className={'sd-nav__title'}>
            {title}
          </div>

          <ul className={`sd-nav__links flex-row ml-md-auto d-none d-md-flex
          align-items-center`}>
            {!authenticated && this.renderUnauthenticatedLinks()}
            {authenticated && this.renderAuthenticatedLinks()}
          </ul>

          <div className="flex-column ml-auto d-flex d-md-none">
            <button className="navbar-toggler hamburger__toggler" type="button"
              onClick={this.onMobileClick}>
              <span className="navbar-toggler-icon hamburger__toggle-icon">
              </span>
            </button>
          </div>
        </nav>
      </div>

      <Collapse className="hamburger flex-column" isOpen={!isHidden}>
        <ul className="hamburger__links">
          {!authenticated && this.renderUnauthenticatedHamburgerLinks()}
          {authenticated && this.renderAuthenticatedHamburgerLinks()}
        </ul>
      </Collapse>
    </nav>);
  }
};

function mapStateToProps(state) {
  return {
    authenticated: state.user.auth.authenticated
  };
}

export default connect(mapStateToProps, {})(NavHeader);
