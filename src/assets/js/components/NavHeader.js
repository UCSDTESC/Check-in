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
      <div className="container sd-container">
        <div className="sd-nav__right hidden-sm-down">
          <ul className="sd-inline-list sd-nav__links">
            {/* <Link to="/apply"><li>Apply</li></Link> */}
            <a> <img src="/img/tesc-logo.png" /> </a>
            <a href="/register"><li>Register</li></a>
            <Link to="/"><li>Link 1</li></Link>
            <Link to="/"><li>Link 2</li></Link>
            <a href="/"><li>Link 3</li></a>
            <a href="/"><li>Link 4</li></a>
            <a href="/"><li>Contact</li></a>
          </ul>
        </div>
        <a className="mobile-link hidden-sm-up sd-nav__mobile-link"
          onClick={this.onMobileClick}>
          <span className="mobile-hamburger"></span>
        </a>
        <div className="navigation nav-right sd-nav__mobile">
          <ul>
            <li><a className="sd-nav__mobile-link" href="/register">Register</a></li>
            {/* <li><Link className="sd-nav__mobile-link"
              to="/apply">Apply</Link></li> */}
            <li><Link className="sd-nav__mobile-link"
              to="/">Link 1</Link></li>
            <li><Link className="sd-nav__mobile-link"
              to="/ ">Link 2</Link></li>
            <li><a className="sd-nav__mobile-link"
              href="/">Link 3</a></li>
            <li><a className="sd-nav__mobile-link"
              href="/">Link 4</a></li>
            <li><a className="sd-nav__mobile-link"
              href="/">Contact</a></li>
          </ul>
        </div>
      </div>
    </nav>);
  }
};