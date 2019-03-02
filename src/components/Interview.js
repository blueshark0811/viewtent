import React from 'react';
import ListErrors from './ListErrors';
import { Link } from 'react-router-dom';
import agent from '../agent';
import { connect } from 'react-redux';
import {
  INTERVIEW_PAGE_LOADED,
  INTERVIEW_PAGE_UNLOADED,
  DELETE_INTERVIEW,
  INTERVIEW_SUBMITTED,
  UPDATE_FIELD_EDITOR
} from '../constants/actionTypes';
import dummyImg from '../assets/images/monitor.svg';
import moreImg from '../assets/images/icons8-more-90_1icons8-more-90.png';
import linkImg from '../assets/images/icons8-link-96_1icons8-link-96.png';
import checkCircleImg from '../assets/images/check-circle.svg';
import AudioPlayerOne from './AudioPlayerOne';
import QuestionInput from './QuestionInput';
import InterviewProcess from './InterviewProcess';
import MusicPlayer from 'react-responsive-music-player';
import Clipboard from 'react-clipboard.js';
// import Webcam from "react-webcam";

const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.interview,
  currentUser: state.common.currentUser,
});

const mapDispatchToProps = dispatch => ({
  onLoad: payload =>
    dispatch({ type: INTERVIEW_PAGE_LOADED, payload }),
  onUnload: () =>
    dispatch({ type: INTERVIEW_PAGE_UNLOADED }),
  onClickDelete: payload =>
    dispatch({ type: DELETE_INTERVIEW, payload }),
  onUpdateField: (key, value) =>
    dispatch({ type: UPDATE_FIELD_EDITOR, key, value })
});

class Interview extends React.Component {

  constructor() {
    super();

    this.state = {
      pageTab : 'people'
    }

    this.videoStream = (stream) => {
      console.log('~~~~~~~~~~~~~~~~~~~', stream);
    }

    this.changeTitle = ev => {
      this.props.onUpdateField('title', ev.target.value);      
    }

    this.changeRequire = val => {
      this.props.onUpdateField('require', val);      
    }

    this.changeAllow = val => {
      this.props.onUpdateField('allow', val);      
    }

    this.changeTab = val => {
      this.setState({ 
        pageTab : val,
        msg : ''
      })
    }

    this.submitForm = ev => {
      ev.preventDefault();
      const interview = {
        author : this.props.author,
        title: this.props.title,
        require: this.props.require,
        allow: this.props.allow
      };
      const slug = { slug: this.props.slug };
      agent.Interviews.update(Object.assign(interview, slug)).then((res) => {
        this.setState({ msg : 'Updated successfully' });
      });
    };
  }

  componentWillMount() {
    this.props.onLoad(Promise.all([
      agent.Interviews.get(this.props.match.params.slug),
      agent.Questions.forInterview(this.props.match.params.slug),
      agent.Interviews.appliersForInterview(this.props.match.params.slug),
      agent.Interviews.get(this.props.match.params.slug)
      .then( (res ) => {
        return res.interview.author? agent.Profile.get(res.interview.author.username) : ''
      })
    ]));  
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props != nextProps) {
      this.setState({ msg: ''});
    }
  }

  render() {

    const playlist = [
        {
          url: 'https://www.voicestory.com/audio/Using-System-Fonts-for-Web-Apps1549709812102.mp3',
          title: 'Despacito',
          artist: [
            'Luis Fonsi',
            'Daddy Yankee'
          ]
        }
      ]

    const videoConstraints = {
      width: 1280,
      height: 720,
      facingMode: "user"
    };


    if (!this.props.slug) {
      return (
        <div className="interview-page">
        </div>
      );
    }

    if ( this.props.currentUser && this.props.author.username == this.props.currentUser.username ) {
      return (
        <div className="interview-page">
          <div className="container page">
            <div className="top-menu">
              <div className="second-menu">
                <div className="div-block-51">
                  <div className="div-block-6">
                    <img src={ dummyImg } width="42" alt="" className="image-35-copy" />
                    <div className="text-block-14">{ this.props.title }<br /></div>
                    <a href="#" className="linkblock w-inline-block">
                      <img src={ linkImg } width="62" alt="" className="linkimage" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="third-menu">
                <div className="div-block-117">
                  <span className={ this.state.pageTab == 'people'? "thirdlinks w--current" : 'thirdlinks'} onClick={ () => this.changeTab('people') } >People</span>
                  <span className={ this.state.pageTab == 'questions'? "thirdlinks w--current" : 'thirdlinks'} onClick={ () => this.changeTab('questions') }>Questions</span>
                  <span className={ this.state.pageTab == 'settings'? "thirdlinks w--current" : 'thirdlinks'} onClick={ () => this.changeTab('settings')}>Settings</span>
                </div>
              </div>
            </div>
            { this.state.pageTab == 'people'?
              <div className="div-block-26">
                <div className="div-block-184">
                  <div className="align">
                    <div className="button-2 white wdropdown hid">
                      <div>All Interviews</div>
                      <div className="icon im-copy w-icon-dropdown-toggle"></div>
                    </div>
                    <Clipboard data-clipboard-text={ window.location.href } className="button-2 _24 white w-button">
                      Copy link
                    </Clipboard>
                    <Link to={`/invite/${this.props.slug}`} className="button-2 _24 blkd w-button">
                      Invite People
                    </Link>
                    <div className="search">
                      <div>Search</div>
                    </div>
                  </div>
                </div>
                <div className="div-block-183">
                  <div className="w-row">
                    <div className="w-col w-col-6">
                      <div>Name</div>
                    </div>
                    <div className="w-col w-col-3">
                      <div>Time</div>
                    </div>
                    <div className="w-col w-col-3">
                      <div>Video</div>
                    </div>
                  </div>
                </div>
                { this.props.appliers ?
                    this.props.appliers.map(applier => 
                      <div className="row" key={ applier.slug }>
                        <div className="columns w-row">
                          <div className="w-col w-col-6" 
                            onClick={ () => { 
                                    this.props.history.push({
                                        pathname: `/review/${this.props.slug}-${applier.slug}`, 
                                        state : { 
                                          user: applier.author,
                                          video : applier.video
                                        }
                                      })
                                    }
                                  }>
                            <div className="aligntext">
                              <div className="div-block-31-copy"><img src={ dummyImg } alt="" /></div>
                              <div>
                                <div className="text-block-41">{ applier.author.fullname }</div>
                                <div className="grey-text">{ applier.author.email }</div>
                              </div>
                            </div>
                          </div>
                          <div className="w-col w-col-3">
                            <div>{ applier.offset } ago</div>
                          </div>
                          <div className="w-col w-col-1">
                            <div>1</div>
                          </div>
                          <div className="w-clearfix w-col w-col-2">
                            <div data-delay="0" className="dropdown w-dropdown">
                              <div className="dropdown-toggle w-dropdown-toggle">
                                <img src={ moreImg } width="62" alt="" className="menuimage" />
                              </div>
                              <nav className="dropdown-list w-dropdown-list">
                                <a href="#" className="text-block-10 _0-copy w-dropdown-link">View</a>
                                <a href="#" className="text-block-10 _0-copy showund w-dropdown-link">Message</a>
                                <a href="#" className="text-block-10 _0-copy w-dropdown-link">Delete</a>
                              </nav>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  :''
                }
              </div>
              :''
            }
            { this.state.pageTab == 'questions'?
              <div className="div-block-26">
                <div className="div-block-184">
                  <div className="align w-clearfix">
                    <button className="button-2 _24 white w-button" onClick={ () => { this.setState({ addQuestion : !this.state.addQuestion }) }} >Add Question</button>
                    <button className="button-2 j w-button">Complete</button>
                  </div>
                </div>
                { this.state.addQuestion?
                    <QuestionInput slug={this.props.slug} currentUser={this.props.currentUser} />
                    :''
                }
                <div className="div-block-183">
                  <div className="w-row">
                    <div className="w-col w-col-11">
                      <div>Questions</div>
                    </div>
                    <div className="w-col w-col-1">
                      <div className="text-block-53">People</div>
                    </div>
                  </div>
                </div>
                { this.props.questions ? 
                    this.props.questions.map( (question, index) => 
                      <div className="row">
                        <div className="columns w-row">
                          <div className="w-col w-col-11">
                            <div className="aligntext">
                              <div className="div-block-185" style={{ display : "flex"}}>
                                <AudioPlayerOne audio={ question.audio }/>
                                <div>
                                  <div className="fry">
                                    { question.body }
                                  </div>
                                  <div className="grey-text">{ index + 1 }</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="w-clearfix w-col w-col-1">
                            <div data-delay="0" className="dropdown w-dropdown">
                              <div className="dropdown-toggle w-dropdown-toggle"><img src={ moreImg } width="62" alt="" className="menuimage" /></div>
                              <nav className="dropdown-list w-dropdown-list">
                                <a href="#" className="text-block-10 _0-copy w-dropdown-link">Hear</a>
                                <a href="#" className="text-block-10 _0-copy showund w-dropdown-link">Move</a>
                                <a href="#" className="text-block-10 _0-copy w-dropdown-link">Delete</a>
                              </nav>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  :''
                }
              </div>
              :''
            }
            { this.state.pageTab == 'settings'?
              <div className="div-block-225">
                <div className="div-block-226">
                  <div className="aligntext-copy blf">
                    <div className="div-block-229"><img src={ checkCircleImg } width="26" alt="" className="image-53" />
                      <div className="_66">Settings</div>
                    </div>
                  </div>
                  <div className="aligntext-copy"><img src={ checkCircleImg } width="26" alt="" className="image-53" />
                    <div className="div-block-229">
                      <div className="_66">Delete</div>
                    </div>
                  </div>
                </div>
                <div className="div-block-26-copy">
                  <div className="div-block-196">
                    <div>
                      <div className="text-block-48 bvol vrn">Settings</div>
                    </div>
                    <div className="w-form">
                      <form id="email-form" name="email-form" data-name="Email Form">
                        <div className="text-block-39">Name of Interview (Optional)</div>
                        <ListErrors errors={this.props.errors} />
                        <input
                          className="textfield ful w-input"
                          type="text"
                          placeholder="Name"
                          value={this.props.title}
                          onChange={ this.changeTitle } 
                          required />
                        <div className="text-block-39">Require</div>
                        <div className="div-block-206">
                          <div className="div-block-208" onClick={ () => this.changeRequire('voice') }>
                            <div className="div-block-207">
                              { this.props.require == 'voice'? <img src={ checkCircleImg } alt="" />:'' }
                            </div>
                            <div>Voice</div>
                          </div>
                          <div className="div-block-208" onClick={ () => this.changeRequire('webcam') }>
                            <div className="div-block-207">
                              { this.props.require == 'webcam'? <img src={ checkCircleImg } alt="" />:'' }
                            </div>
                            <div>Webcam</div>
                          </div>
                        </div>
                        <div className="text-block-39">Allow interviews from</div>
                        <div className="div-block-206">
                          <div className="div-block-208" onClick={ () => this.changeAllow('invited') }>
                            <div className="div-block-207">
                              { this.props.allow == 'invited'? <img src={ checkCircleImg } alt="" />:'' }
                            </div>
                            <div>Invited Only</div>
                          </div>
                          <div className="div-block-208" onClick={ () => this.changeAllow('anyone') }>
                            <div className="div-block-207">
                              { this.props.allow == 'anyone'? <img src={ checkCircleImg } alt="" />:'' }
                            </div>
                            <div>Anyone with the link</div>
                          </div>
                        </div>
                        <div className="button-2 white wdropdown formdropdown hide">
                          <div>Anyone with link</div>
                          <div className="icon im-copy w-icon-dropdown-toggle"></div>
                        </div>
                        <div className="div-block-163">
                          <button 
                            onClick={this.submitForm}
                            disabled={this.props.inProgress}
                            className="button-2 bb w-button">
                            Save Settings
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="text-block-39">{ this.state.msg }</div>
                  </div>
                </div>
              </div>
              :''
            }
          </div>
        </div>
      );
    }
    else {
      return (
        <InterviewProcess questionList = {this.props.questions} interview = {this.props}/>
      )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Interview);
