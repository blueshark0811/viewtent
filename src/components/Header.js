import React from 'react';
import { Link } from 'react-router-dom';
import defaultAvatar from '../assets/images/avatar/default.jpg';

const LoggedOutView = props => {
  if (!props.currentUser) {
    return (
      <ul className="nav navbar-nav pull-xs-right">
        <li className="nav-item">
          <Link to="/login" className="nav-link">
            Sign in
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/register" className="nav-link">
            Sign up
          </Link>
        </li>
      </ul>
    );
  }
  return null;
};

const LoggedInView = props => {
  if (props.currentUser) {
    return (
      <ul className="nav navbar-nav pull-xs-right">

        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Upgrade
          </Link>
        </li>

        <li className="nav-item" style={{ padding: "0px 0px 0px 8px"}}>
          <div className="nav-link" onClick={props.onClickLogout}>
            <img src={defaultAvatar} className="user-pic" alt={props.currentUser.username} />
            <a className="username">{ props.currentUser.username }</a> 
          </div>
        </li>

      </ul>
    );
  }

  return null;
};

class Header extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-light">
        <div className="container">

          <Link to={ this.props.currentUser? '/company' : '/'} className="navbar-brand">
            <b>{this.props.appName }</b>
          </Link>

          <LoggedOutView currentUser={this.props.currentUser} />

          <LoggedInView currentUser={this.props.currentUser} onClickLogout={this.props.onClickLogout}/>
        </div>
      </nav>
    );
  }
}

export default Header;
