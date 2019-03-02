import React from 'react';
import { Link } from 'react-router-dom';
import defaultAvatar from '../assets/images/avatar/default.jpg';

const LoggedOutView = props => {
  if (!props.currentUser) {
    return (
      <nav role="navigation" className="nav-menu w-nav-menu">
          <Link to="/register" className="nav-link blue w-nav-link">
            Don&#x27;t have an account?
          </Link>
      </nav>
      // <div className="menu-button w-nav-button">
      //   <div className="w-icon-nav-menu"></div>
      // </div>
    );
  }
  return null;
};

const LoggedInView = props => {
  if (props.currentUser) {
    return (
      <nav role="navigation" className="nav-menu w-clearfix w-nav-menu">
        <a href="index.html" className="nav-link hdfo hh w-nav-link">Home</a>
        <a href="#" className="nav-link hdfo hh w-nav-link">Organizations</a>
        <div data-delay="0" className="dropdown-copy w-dropdown">
          <div className="dropdown-toggle-copy w-dropdown-toggle" onClick={props.onClickLogout}>
            <div className="div-block-31 noc">
              <div>{ props.currentUser.username.slice(0, 1).toUpperCase() }</div>
            </div>
          </div>
          <nav className="dropdown-list-copy w-dropdown-list">
            <a href="#" className="text-block-10 _0-copy w-dropdown-link">Settings</a>
            <a href="#" className="text-block-10 _0-copy showund w-dropdown-link">Upgrade</a>
            <a href="#" className="text-block-10 _0-copy w-dropdown-link" onClick={props.onClickLogout} >Log Out</a>
          </nav>
        </div>
      </nav>
      // <div className="menu-button w-nav-button">
      //   <div className="w-icon-nav-menu"></div>
      // </div>
    );
  }

  return null;
};

class Header extends React.Component {

  render() {
    return (
      <div data-collapse="medium" data-animation="default" data-duration="400" className="navbar-2 w-nav">
        <Link to={ this.props.currentUser? '/dashboard' : '/'} className="brand-2 w-nav-brand">
          <h2 className="heading-3">{ this.props.appName }</h2>
        </Link>
        <LoggedOutView currentUser={this.props.currentUser} />
        <LoggedInView currentUser={this.props.currentUser} onClickLogout={this.props.onClickLogout}/>
      </div>
    );
  }
}

export default Header;
