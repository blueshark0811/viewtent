import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
import {
  UPDATE_INTERVIEW,
  INVITE_PAGE_LOADED
} from '../constants/actionTypes';
import backImg from '../assets/images/icons8-chevron-left-90_1icons8-chevron-left-90.png';
import userImg from '../assets/images/user.svg';
import removeImg from '../assets/images/x.svg';



const mapStateToProps = state => ({
  ...state.invite
});

const mapDispatchToProps = dispatch => ({
  onLoad: payload =>
    dispatch({ type: INVITE_PAGE_LOADED, payload })
});

class Invite extends React.Component {
  constructor() {
    super();
    
    this.state = {
      title : '',
      require : 'voice',
      allow : 'invited'
    }

    this.watchForEnter = ev => {
      if (ev.keyCode === 13) {
        ev.preventDefault();
        this.props.onAddTag();
      }
    };

    this.removeTagHandler = tag => () => {
      this.props.onRemoveTag(tag);
    };

    this.submitForm = ev => {
      ev.preventDefault();
      if (this.state.email != ''){
        const promise = agent.Interviews.inviteAdd(this.props.match.params.slug, this.state.email);
        this.setState({ email : ''});
        this.props.onLoad(promise);
      }
      else {
        this.setState({ msg : ''});
      }
    };

    this.remove = email => {
      const promise = agent.Interviews.inviteRemove(this.props.match.params.slug, email);
      this.props.onLoad(promise);
    }
  }

  componentWillMount() {
    if( this.props.match.params.slug){
      var payload = agent.Interviews.get(this.props.match.params.slug);
      this.props.onLoad(payload);  
    }
  }

  render() {
    return (
      <div className="new-interview-page">
        <div className="container page">
          <div data-collapse="medium" data-animation="default" data-duration="400" className="navbar-2 nosha w-nav">
            <img src={ backImg } width="29" alt="" className="image-51" onClick={ () => { this.props.history.goBack() }}/>
          </div>
          <div className="div-block-43-copy">
            <div className="text-block-13">Invite people for interview</div>
            <div className="div-block-44">
              <div className="w-form">
                <form id="email-form" name="email-form" data-name="Email Form">
                  <div className="text-block-39">Email</div>
                  <ListErrors errors={this.props.errors} />
                  <input
                    className="textfield ful w-input"
                    type="email"
                    placeholder="Name"
                    value={this.state.email}
                    onChange={ (e) => {this.setState({ email : e.target.value})} } 
                    required />
                  <button 
                    onClick={this.submitForm}
                    onKeyDown={this.submitForm}
                    disabled={this.props.inProgress}
                    className="button-2 form-button w-inline-block"
                  >
                    <div>Invite</div>
                    <img src="https://uploads-ssl.webflow.com/5c5f614abad523f096147dd0/5c5f699016bb6e1e8e498514_icons8-forward-90.png" width="24" alt="" className="button-icon" />
                  </button>
                </form>
              </div>
            </div>
            { this.props.invitations && this.props.invitations.length > 0 ?
              <div className="div-block-233">
                <div className="div-block-183">
                  <div className="w-row">
                    <div className="w-col w-col-12">
                      <div>Invitations</div>
                    </div>
                  </div>
                </div>
                { 
                  this.props.invitations.map( (invitation, index) => 
                    <div className="row" key="invite{index}">
                      <div className="columns w-row">
                        <div className="w-col w-col-10">
                          <div className="aligntext">
                            <div className="div-block-31-copy"><img src={ userImg } alt="" /></div>
                            <div>
                              <div className="text-block-41">{ invitation }</div>
                              {/* <div className="grey-text">{invitation}</div>} */}
                            </div>
                          </div>
                        </div>
                        <div className="w-col w-col-2" style={{ cursor : "pointer"}} onClick={ () => this.remove(invitation) }><img src={ removeImg } width="28" alt=""/></div>
                      </div>
                    </div>
                  )
                }
              </div>
              :''
            }
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Invite);
