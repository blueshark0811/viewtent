import { Link } from 'react-router-dom';
import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
import {
  UPDATE_FIELD_AUTH,
  LOGIN,
  LOGIN_PAGE_UNLOADED,
  AUTH_REQUIRED
} from '../constants/actionTypes';
import linkedinImage from '../assets/images/square-linkedin-512.png';
import googleImage from '../assets/images/new-google-favicon-512.png';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

const mapStateToProps = state => ({ 
  ...state.auth,
  currentUser: state.common.currentUser
});

const mapDispatchToProps = dispatch => ({
  onChangeEmail: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'email', value }),
  onChangePassword: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'password', value }),
  onChangeCompanyName: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'companyname', value }),
  onChangeInvite: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'invite', value }),
  onChangeSetup: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'setup', value }),
  onSetRedirectTo: value =>
    dispatch({ type: AUTH_REQUIRED, key : "goTo", value }),
  onSubmit: (payload) =>
    dispatch({ type: LOGIN, payload: payload }),
  onUnload: () =>
    dispatch({ type: LOGIN_PAGE_UNLOADED }),
});

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      detail : false,
    }
    this.changeEmail = ev => this.props.onChangeEmail(ev.target.value);
    this.changePassword = ev => this.props.onChangePassword(ev.target.value);
    this.changeCompanyName = ev => this.props.onChangeCompanyName(ev.target.value);
    this.changeInvite = ev => this.props.onChangeInvite(ev.target.value);
    this.changeSetup = ev => this.props.onChangeSetup(ev.target.value);
    this.submitForm = (email, password) => ev => {
      // ev.preventDefault();
      // this.props.onSubmit(email, password);
      ev.preventDefault();
      const payload = agent.Auth.login(email, password);
      payload.then(res => {
          this.props.onSubmit(payload);
          if (!res.user.companyname || res.user.companyname == '') {
            this.setState({
              detail : true,
              userInfo : res.user
            });
          }
      }).catch(err => {
          this.props.onSubmit(payload);
      });
    };

    this.submitCompanyForm = ev => {
      ev.preventDefault();
      const user = Object.assign({}, this.state.userInfo, 
        { 
          companyname: this.props.companyname,
          setup: this.props.setup,
          invite : this.props.invite
        });
      this.props.onSubmit(agent.Auth.save(user));
    }

    this.responseGoogle = response => {
      const payload = agent.Auth.socialRegister(response.profileObj,'google');
      this.props.onSubmit(payload);
    }

    this.responseFacebook = response => {
      const payload = agent.Auth.socialRegister(response,'facebook');
      this.props.onSubmit(payload);
    }
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  componentDidMount() {
    if(this.props.currentUser) {
      this.props.history.push('/dashboard');
    }
    this.props.onChangeEmail(this.props.email);
    this.props.onChangePassword(this.props.password);
    if (this.props.location.state) {
      this.props.onSetRedirectTo(this.props.location.state.redirectTo);
    }
  }

  render() {
    const email = this.props.email;
    const password = this.props.password;
    return (
      <div className="auth-page">
        <div className="container page">
        { !this.state.detail?
          <div className="div-block-43-copy">
            <div className="text-block-13">Login to your account</div>
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
                    Log in
                    <img src="https://uploads-ssl.webflow.com/5c5f614abad523f096147dd0/5c5f699016bb6e1e8e498514_icons8-forward-90.png" width="24" alt="" className="button-icon" />
                  </button>
                </form>
              </div>
            </div>
          </div>
          :
          <div className="div-block-43-copy">
            <div className="text-block-13">Your Info</div>
            <ListErrors errors={this.props.errors} />
            <div className="div-block-44">
              <div className="w-form">
                <form id="email-form" name="email-form" onSubmit={this.submitCompanyForm} >
                  <input type="text" 
                    className="textfield ful w-input" 
                    maxLength="256" 
                    name="company-name" 
                    placeholder="Company Name" 
                    id="company-name" 
                    value={this.props.companyname}
                    onChange={this.changeCompanyName} 
                    required
                    />
                  <button
                    className="button-2 form-button w-inline-block"
                    type="submit"
                    disabled={this.props.inProgress}>
                    Log in
                    <img src="https://uploads-ssl.webflow.com/5c5f614abad523f096147dd0/5c5f699016bb6e1e8e498514_icons8-forward-90.png" width="24" alt="" className="button-icon" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        }
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
