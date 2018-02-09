import React from 'react';
import {Link} from 'react-router-dom';

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
    const {isHidden, isBackgroundActive, isLogoUp} = this.state;
    const navOpen = (isHidden ? '' : 'nav-open');
    const activeBackground = (isBackgroundActive ?
      'sd-nav__background-active' : '');
    const logoUp = ((isHidden && isLogoUp) ? 'sd-nav__logo-up' : '');

    return (<nav className={`sd-nav ${navOpen}`}>
      <div className={`sd-nav__background ${activeBackground}`}></div>
      <div className="container sd-container sd-nav__margin">
        <div className="sd-nav__left sd-nav__side">
          <a href="/" className={`sd-nav__logo`}>
            <img className="sd-nav__logo" src="/img/tesc-logo.png" />
          </a>
        </div>
          <div className="sd-nav__right ">
          <ul className="sd-inline-list sd-nav__links">
            {/* <Link to="/apply"><li>Apply</li></Link> */}
            <div className="sticky">
              <Link to="/register"><li>Apply</li></Link>
              <Link to="/admin"><li>Admin Login</li></Link>
              <Link to="/"><li>Link 2</li></Link>
              <Link to="/"><li>Link 3</li></Link>
              <Link to="/"><li>Link 4</li></Link>
              <Link to="/"><li>Contact</li></Link>
            </div>
          </ul>
        </div>
        <a className="mobile-link  sd-nav__mobile-link"
          onClick={this.onMobileClick}>
            <span className="mobile-hamburger"></span>
        </a>
        <div className="navigation nav-right sd-nav__mobile">
          <ul>
            <li><Link className="sd-nav__mobile-link" to="/register">Register</Link></li>
            {/* <li><Link className="sd-nav__mobile-link"
              to="/apply">Apply</Link></li> */}
            <li><Link className="sd-nav__mobile-link"
              to="/">Link 1</Link></li>
            <li><Link className="sd-nav__mobile-link"
              to="/ ">Link 2</Link></li>
            <li><Link className="sd-nav__mobile-link"
              to="/">Link 3</Link></li>
            <li><Link className="sd-nav__mobile-link"
              to="/">Link 4</Link></li>
            <li><Link className="sd-nav__mobile-link"
              to="/">Contact</Link></li>
          </ul>
        </div>
      </div>
    </nav>);
  }
};