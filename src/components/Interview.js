import React from 'react';
import { Link } from 'react-router-dom';
import agent from '../agent';
import { connect } from 'react-redux';
import {
  INTERVIEW_PAGE_LOADED,
  INTERVIEW_PAGE_UNLOADED,
  DELETE_INTERVIEW
} from '../constants/actionTypes';
import dummyImg from '../assets/images/dummy.jpg';
import moreImg from '../assets/images/more.png';
import AudioPlayerOne from './AudioPlayerOne';
import QuestionInput from './QuestionInput';
import InterviewProcess from './InterviewProcess';
import MusicPlayer from 'react-responsive-music-player';
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
    dispatch({ type: DELETE_INTERVIEW, payload })
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
  }

  componentDidMount() {
    if(!this.props.currentUser) {
      this.props.history.push({
          pathname: '/login', 
          state : { 
            redirectTo : this.props.location.pathname
          }
      })
    }
  }


  componentWillMount() {
    this.props.onLoad(Promise.all([
      agent.Interviews.get(this.props.match.params.id),
      agent.Questions.forInterview(this.props.match.params.id),
      agent.Interviews.appliersForInterview(this.props.match.params.id),
      agent.Interviews.get(this.props.match.params.id)
      .then( (res ) => {
        return res.interview.author? agent.Profile.get(res.interview.author.username) : ''
      })
    ]));  
  }

  componentWillUnmount() {
    this.props.onUnload();
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


    if (!this.props.interview) {
      return (
        <div className="interview-page">
          <div className="container page">
            <div className="page-header">
              <p>Loading...</p>
            </div>
          </div>
        </div>
      );
    }

    if ( this.props.currentUser && this.props.interview.author.username == this.props.currentUser.username ) {
      return (
        <div className="interview-page">
          <div className="container page">
            <div className="page-header">
              <div className="page-title">
                <img  src={dummyImg} />
                <p> { this.props.interview.title }</p>
              </div>
              <div className="page-tab">
                <span className={ this.state.pageTab == 'people'? "pt-active" : ''} onClick={ () => this.setState({ pageTab : 'people'})}>People</span>
                <span className={ this.state.pageTab == 'questions'? "pt-active" : ''} onClick={ () => this.setState({ pageTab : 'questions'})}>Questions</span>
                <span className={ this.state.pageTab == 'settings'? "pt-active" : ''} onClick={ () => this.setState({ pageTab : 'settings'})}>Settings</span>
              </div>
            </div>
            <div className="page-content">
              { this.state.pageTab == 'people'?
                <div className="people-tab">
                  <div className="page-controls">
                    <select className="btn btn-lg" 
                      >
                        <option>All Positions</option>
                    </select>
                    <input
                      className="btn btn-lg search"
                      type="text"
                      placeholder="Search"
                      />
                  </div>
                  <table className="table table-hover" style={{ marginTop: "40px"}}>
                    <thead>
                      <tr>
                        <td className="name">Name</td>
                        <td>Count</td>
                        <td>Allow Interview</td>
                        <td></td>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.props.appliers ?
                          this.props.appliers.map(applier => 
                            <tr onClick={ () => { 
                                this.props.history.push({
                                    pathname: `/review/${this.props.interview.slug}-${applier.slug}`, 
                                    state : { 
                                      user: applier.author,
                                      video : applier.video,
                                      interview : this.props.interview
                                    }
                                  })
                                }
                              }
                            >
                              <td className="name">
                                <div style={{ display : "flex" }}>
                                  <img  src={dummyImg} className="user-avatar"/>
                                  <div>
                                    <p>
                                      <b> { applier.author.username }</b>
                                    </p>
                                    <p className="info">
                                      { applier.author.email }
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td>1</td>
                              <td>Allowed</td>
                              <td className="action"><img  src={moreImg} className="more-info"/></td>
                            </tr>
                          )
                        :''
                      }
                    </tbody>
                  </table>
                </div>
                :""
              }
              { this.state.pageTab == 'questions'?
                <div className="questions-tab">
                  <div className="page-controls">
                    <select className="btn btn-lg" 
                      >
                        <option>Add Action</option>
                    </select>
                    <button className="btn btn-lg btn-primary" onClick={ () => { this.setState({ addQuestion : !this.state.addQuestion }) }}
                      >
                        Add Question
                    </button>
                    <img src={moreImg} className="more-info"/>
                  </div>
                  { this.state.addQuestion?
                      <QuestionInput slug={this.props.interview.slug} currentUser={this.props.currentUser} />
                      :''
                  }
                  <div className="question-list">
                    { this.props.questions ? 
                        this.props.questions.map( question => 
                          <div className="question">
                            <div className="play">
                              <AudioPlayerOne audio={ question.audio }
                              />
                            </div>
                            <div className="body">
                              <div>
                                <p>
                                  <b>{ question.body }</b>
                                </p>
                                <p className="info">
                                  Question 1 : { question.id}
                                </p>
                              </div>
                              <div className="action">
                                <img  src={moreImg} className="more-info"/>
                              </div>                
                            </div>
                          </div>
                        )
                        :''
                    }
                  </div>
                </div>
                :''
              }
              { this.state.pageTab == 'settings'?
                <div className="settings-tab">
                  <div className="settings-form">
                  <form onSubmit="">
                    <fieldset>
                      <fieldset className="form-group">
                        <p>Title</p>
                        <input
                          className="form-control form-control-lg"
                          type="text"
                          placeholder="Title"
                          value={this.state.title}
                          onChange={ (e) => { this.setState({ title : e.target.value})}} 
                          required />
                      </fieldset>

                      <fieldset className="form-group">
                        <p>Maximum number of people</p>
                        <input
                          className="form-control form-control-lg"
                          type="text"
                          placeholder="Title"
                          value={this.state.maxNum}
                          onChange={ (e) => { this.setState({ maxNum : e.target.value})}} 
                          required />
                      </fieldset>

                      <fieldset className="form-group">
                        <p>Require</p>
                        <select className="form-control form-control-lg" value={ this.state.require }
                          onChange={ (e) => this.setState({ require: e.target.value})} 
                        >
                          <option>Voice</option>
                        </select>
                      </fieldset>

                      <fieldset className="form-group">
                        <p>Who can interview?</p>
                        <select className="form-control form-control-lg" value={ this.state.allowInterviewFrom }
                          onChange={ (e) => this.setState({ allowInterviewFrom: e.target.value})} 
                        >
                          <option>Anyone with link</option>
                        </select>
                      </fieldset>

                      <fieldset className="form-group">
                        <p>Password</p>
                        <input
                          className="form-control form-control-lg"
                          type="password"
                          placeholder="password"
                          value={this.state.password}
                          onChange={ (e) => { this.setState({ password : e.target.value})}} 
                          required />
                      </fieldset>

                      <button className="btn btn-lg btn-primary save-settings-btn pull-right">
                        <span>Save</span>
                      </button>
                    </fieldset>
                  </form>
              </div>
                </div>
                :''
              }
            </div>
          </div>
        </div>
      );
    }
    else {
      return (
        <InterviewProcess questionList = {this.props.questions} interviewSlug = {this.props.interview.slug}/>
      )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Interview);
