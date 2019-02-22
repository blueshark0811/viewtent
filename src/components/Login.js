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
import facebookImage from '../assets/images/facebook.png';
import googleImage from '../assets/images/google.png';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

const mapStateToProps = state => ({ 
  ...state.auth,
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
          <div className="row wrapper">
            { !this.state.detail?
              <div className="col-md-4 col-xs-12 auth-form">
                <h1 className="text-xs-center">Login to your account</h1>
                <br />
                <ListErrors errors={this.props.errors} />
                <p className="text-xs-center">
                  Don't have an account? 
                  <Link to="/register">
                    &nbsp; <b>Sign up</b>
                  </Link>
                </p>
                <div className="social-buttons">
                  <GoogleLogin
                    clientId="516099579821-l5lito4f4rqqrqjraqbihv3pqptdv626.apps.googleusercontent.com"
                    render={renderProps => (
                      <button onClick={renderProps.onClick} className="form-control form-control-lg social-button">
                        <img className="" src={ googleImage }/>
                        <span>Google</span>
                      </button>
                    )}
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                  />
                  <FacebookLogin
                    appId="2237602363227772"
                    callback={this.responseFacebook}
                    render={renderProps => (
                      <button onClick={renderProps.onClick} className="form-control form-control-lg social-button">
                        <img className="" src={ facebookImage } />
                        <span>Facebook</span>
                      </button>
                    )}
                  />
                </div>
                <form onSubmit={this.submitForm(email, password)}>
                  <fieldset>

                    <fieldset className="form-group">
                      <input
                        className="form-control form-control-lg"
                        type="email"
                        placeholder="Email"
                        value={this.props.email}
                        onChange={this.changeEmail} 
                        required />
                    </fieldset>

                    <fieldset className="form-group">
                      <input
                        className="form-control form-control-lg"
                        type="password"
                        placeholder="Password"
                        value={this.props.password}
                        onChange={this.changePassword} 
                        required />
                    </fieldset>

                    <fieldset className="form-group">
                      <p>You can delete your submitted interview at any time.</p>
                    </fieldset>

                    <button
                      className="btn btn-lg btn-primary form-control"
                      type="submit"
                      disabled={this.props.inProgress}>
                      Log in
                    </button>

                  </fieldset>
                </form>
              </div>
              :
              <div className="col-md-4 offset-md-4 col-xs-12 company-form">
                <h1 className="text-xs-left"><b>Your Company</b></h1>
                <ListErrors errors={this.props.errors} />
                <form onSubmit={this.submitCompanyForm}>
                  <fieldset>
                    <p>Name</p>
                    <fieldset className="form-group">
                      <input
                        className="form-control form-control-lg"
                        type="text"
                        placeholder="Name"
                        value={this.props.companyname}
                        onChange={this.changeCompanyName} 
                        required />
                    </fieldset>

                    <fieldset className="form-group">
                      <p>Set Up</p>
                      <select className="form-control form-control-lg" value={ this.props.setup }
                        onChange={this.changeSetup} 
                      >
                        <option>Customer Suport</option>
                        <option>Experience</option>
                        <option>Development</option>
                      </select>
                    </fieldset>

                    <fieldset className="form-group">
                      <p>Invite Team</p>
                      <input
                        className="form-control form-control-lg"
                        type="email"
                        placeholder="Email"
                        value={this.props.invite}
                        onChange={this.changeInvite} 
                        required />
                    </fieldset>

                    <button
                      className="btn btn-lg btn-primary form-control company-btn text-xs-center"
                      disabled={this.props.inProgress}>
                      <span>Next</span>
                    </button>

                  </fieldset>
                </form>
              </div>
            }

          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
