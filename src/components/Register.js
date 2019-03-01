import { Link } from 'react-router-dom';
import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
import {
  UPDATE_FIELD_AUTH,
  REGISTER,
  REGISTER_PAGE_UNLOADED
} from '../constants/actionTypes';
import linkedinImage from '../assets/images/square-linkedin-512.png';
import googleImage from '../assets/images/new-google-favicon-512.png';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
  onChangeEmail: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'email', value }),
  onChangePassword: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'password', value }),
  onChangeUsername: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'username', value }),
  onSubmit: (email, password) => {
    const payload = agent.Auth.register(email, password);
    dispatch({ type: REGISTER, payload })
  },
  onUnload: () =>
    dispatch({ type: REGISTER_PAGE_UNLOADED })
});

class Register extends React.Component {
  constructor() {
    super();
    this.changeEmail = ev => this.props.onChangeEmail(ev.target.value);
    this.changePassword = ev => this.props.onChangePassword(ev.target.value);
    this.changeUsername = ev => this.props.onChangeUsername(ev.target.value);
    this.submitForm = (email, password) => ev => {
      ev.preventDefault();
      this.props.onSubmit(email, password);
    }
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    const email = this.props.email;
    const password = this.props.password;
    const username = this.props.username;

    return (
      <div className="auth-page">
        <div className="container page">
          <div className="div-block-43-copy">
            <div className="text-block-13">Register</div>
            <ListErrors errors={this.props.errors} />
            <div className="div-block-44">
              <div className="div-block-129-c7opy">
                <a href="#" className="button-2 loginbutton w-inline-block">
                  <img src={ googleImage } width="29" sizes="29px" alt="" className="login-button-images" />
                  <div>Login with Google</div>
                </a>
                <a href="#" className="button-2 loginbutton w-inline-block">
                  <img src={ linkedinImage } width="29" alt="" className="login-button-images" />
                  <div>Login with Linkedin</div>
                </a>
              </div>
              <div className="w-form">
                <form id="email-form" name="email-form" onSubmit={this.submitForm(email, password)}>
                  <input type="email" 
                    className="textfield ful w-input" 
                    maxLength="256" 
                    name="Email" 
                    placeholder="Email" 
                    id="Email-2" 
                    value={this.props.email}
                    onChange={this.changeEmail} 
                    required
                    />
                  <input type="password" 
                    className="textfield ful w-input" 
                    maxLength="256" 
                    name="Email-3"
                    placeholder="Password" 
                    id="Email-3"
                    value={this.props.password}
                    onChange={this.changePassword} 
                    required
                  />
                  <button
                    className="button-2 form-button w-inline-block"
                    type="submit"
                    disabled={this.props.inProgress}>
                    Register
                    <img src="https://uploads-ssl.webflow.com/5c5f614abad523f096147dd0/5c5f699016bb6e1e8e498514_icons8-forward-90.png" width="24" alt="" className="button-icon" />
                  </button>
                  <Link to="/login" className="text-block-36 lrg vgd-copy w-inline-block" style={{ width: "100%", textAlign: "center"}}>
                    <strong className="bold-text-5">Have an account already</strong>
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
