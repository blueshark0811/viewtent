import React, { Component } from 'react';
import MediaCapturer from 'react-multimedia-capture';
import agent from '../agent';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  INTERVIEW_PAGE_LOADED,
  INTERVIEW_PAGE_UNLOADED,
  ADD_APPLIER
} from '../constants/actionTypes';
import AudioPlayerOne from './AudioPlayerOne';
import monitorImg from '../assets/images/monitor.svg';
import microPhoneImg from '../assets/images/icons8-microphone-100.png';
import videoCallImg from '../assets/images/icons8-video-call-100.png';
import mousePointerImg from '../assets/images/icons8-mouse-pointer-100.png';
import mousePointerImig2 from "../assets/images/icons8-mouse-pointer-90_1icons8-mouse-pointer-90.png";
import noVideoImg from '../assets/images/icons8-no-video-90_1icons8-no-video-90.png';
import pauseImg from '../assets/images/icons8-pause-filled-100.png';
import resumeImg from '../assets/images/icons8-play-96.png';


const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.interview,
  currentUser: state.common.currentUser,
});

const mapDispatchToProps = dispatch => ({
  onLoad: payload =>
    dispatch({ type: INTERVIEW_PAGE_LOADED, payload }),
  onSubmit: payload => 
  	dispatch({ type : ADD_APPLIER, payload })
});


class InterviewProcess extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			granted: false,
			rejectedReason: '',
			recording: false,
			paused: false,
			questionIndex : 0,
			fullname: '',
			email : '',
			msg : ''
		};

		this.handleRequest = this.handleRequest.bind(this);
		this.handleGranted = this.handleGranted.bind(this);
		this.handleDenied = this.handleDenied.bind(this);
		this.handleStart = this.handleStart.bind(this);
		this.handleStop = this.handleStop.bind(this);
		this.handlePause = this.handlePause.bind(this);
		this.handleResume = this.handleResume.bind(this);
		this.handleStreamClose = this.handleStreamClose.bind(this);
		this.setStreamToVideo = this.setStreamToVideo.bind(this);
		this.releaseStreamFromVideo = this.releaseStreamFromVideo.bind(this);
		this.downloadVideo = this.downloadVideo.bind(this);
		this.submitInterview = this.submitInterview.bind(this);
	}
	handleRequest() {
		console.log('Request Recording...');
	}
	handleGranted() {
		this.setState({ granted: true });
		console.log('Permission Granted!');
	}
	handleDenied(err) {
		this.setState({ rejectedReason: err.name });
		console.log('Permission Denied!', err);
	}

	handleStart(stream) {
		// if (this.state.fullname != '' && this.state.email != '')
		// {
			this.setState({
				recording: true,
				msg : ''
			});
			this.setStreamToVideo(stream);
			console.log('Recording Started.');
		// }
		// else {
		// 	this.setState({ msg : "Please enter your email and name "});
		// }
	}
	handleStop(blob) {
		this.setState({
			recording: false
		});

		this.releaseStreamFromVideo();

		console.log('Recording Stopped.');
		this.downloadVideo(blob);
	}
	handlePause() {
		this.releaseStreamFromVideo();

		this.setState({
			paused: true
		});
	}
	handleResume(stream) {
		this.setStreamToVideo(stream);

		this.setState({
			paused: false
		});
	}
	handleError(err) {
		console.log(err);
	}
	handleStreamClose() {
		this.setState({
			granted: false
		});
	}
	setStreamToVideo(stream) {
		let video = this.refs.app.querySelector('video');
		// debugger;
		// if(window.URL) {
		// 	video.src = window.URL.createObjectURL(stream);
		// }
		// else {
			video.src = stream;
		// }
	}
	releaseStreamFromVideo() {
		this.refs.app.querySelector('video').src = '';
	}
	downloadVideo(blob) {
		var _self = this;
		let url = URL.createObjectURL(blob);
		let a = document.createElement('a');
		a.style.display = 'block';
		a.href = url;
		var fd = new FormData();
        fd.append('fname', 'recording.webm');
        fd.append('data', blob);
        this.setState({ processing : true });
        agent.Interviews.upload(fd).then(function(response){
        	// response.data.title;
    		var payload = agent.Interviews.createApplier(_self.props.interview.slug,
                { 
                  	video : response.data.title,
                  	fullname : _self.state.fullname,
                  	email : _self.state.email
                }
          );
          _self.props.onSubmit(payload);
        });
	}

	submitInterview() {
		var _self = this;
		var fd = new FormData();
        fd.append('fname', 'recording.webm');
        fd.append('data', '');
        agent.Interviews.upload(fd).then(function(response){
    		var payload = agent.Interviews.createApplier(_self.props.interview.slug,
                { 
                  	video : response.data.title,
                  	fullname : _self.state.fullname,
                  	email : _self.state.email
                }
          );
          _self.props.onSubmit(payload);
        });
	}

	render() {
		const granted = this.state.granted;
		const rejectedReason = this.state.rejectedReason;
		const recording = this.state.recording;
		const paused = this.state.paused;
		const questionList = this.props.questions;
		const allow = (this.props.interview.allow == 'invited' && 
						this.props.interview.invitations.indexOf(this.state.email) > -1) 
						|| this.props.interview.allow == 'anyone'
		return (
	      	<div className="interview-process-page">
		        <div className="container page">
		        	<div data-collapse="medium" data-animation="default" data-duration="400" className="navbar-2 nosha w-nav">
						<div className="div-block-51 sbs">
							<img src={ monitorImg } width="25" alt="" className="image-35-copy-2" />
						  	<div className="div-block-6">
							    <div>
							      <div className="text-block-14">Interview: { this.props.interview.title } <br /></div>
							      <div className="text-block-36 lrg vgd-copy-copy">This interview requires Webcam, Voice and Screenshare.</div>
							    </div>
					    	</div>
						</div><a href="#" className="brand-2-copy w-nav-brand"></a>
						<div className="menu-button w-nav-button">
						  <div className="w-icon-nav-menu"></div>
						</div>
					</div>
					{ 
						this.state.processing?
						''
						:
						rejectedReason == ''?
						<div className="div-block-43-copy">
							<div className="div-block-44">
								{ this.state.recording?
									allow?
								    	questionList && questionList.length > 0?
										    <div>
										      <div className="text-block-43">Please answer all questions &nbsp; { this.state.questionIndex+1 } /  { questionList.length } </div>
										      <div style={{ display : "flex"}}>
											      <AudioPlayerOne audio={ questionList[this.state.questionIndex].audio } autoPlay/>
											      <div className="text-block-44">{ this.state.questionIndex + 1}. { questionList[this.state.questionIndex].body }</div>
										      </div>
										      <div className="div-block-129-copy-copy">
										        <div className="circle-buttons active">
										        	<img src="https://uploads-ssl.webflow.com/5c5f614abad523f096147dd0/5c5f614abad5230d9b147e77_icons8-microphone-96.png" alt="" className="image-33"/>
									        	</div>
										        <div className="circle-buttons">
										        	<img src={ noVideoImg } alt="" className="image-33" />
									        	</div>
										        <div className="circle-buttons active">
										        	<img src={ mousePointerImig2 } alt="" className="image-33" />
									        	</div>
										      </div>
										      <div className="div-block-191">
										        { this.state.questionIndex <  questionList.length-1?
													<button className="button-2 form-button white w-inline-block" onClick={ () => { this.setState({ questionIndex : this.state.questionIndex + 1 })}}> 
														Next Question 
														<img src="https://uploads-ssl.webflow.com/5c5f614abad523f096147dd0/5c5f699016bb6e1e8e498514_icons8-forward-90.png" width="24" alt="" className="button-icon" />
													</button>
													:
													''
												}
												</div>
										    </div>
									    	:
									    	<div className="text-block-14" style={{ textAlign : "center"}}>
									    		No questions
									    	</div>
							    	    :
									    <div className="text-block-14" style={{ textAlign : "center"}}>
									    	Available only for invited people
									    </div>
								    :
								    <div>
										<div className="text-block-46">Please turn on before starting:</div>
										<div className="div-block-193">
									      	<a href="#" className="button-2 loginbutton smaller w-inline-block">
										      <img src={ microPhoneImg } width="29" alt="" className="login-button-images" />
										      <div>Microphone</div>
									      	</a>
									      	<a href="#" className="button-2 loginbutton smaller w-inline-block">
										      	<img src={ videoCallImg} width="29" alt="" className="login-button-images" />
										      	<div>Webcam</div></a>
								      		<a href="#" className="button-2 loginbutton smaller w-inline-block">
										      	<img src={ mousePointerImg } width="29" alt="" className="login-button-images" />
										      <div>Screenshare</div>
									      	</a>
								        </div>
								      	<div className="w-form">
								            { this.state.msg != '' ? 
								            	<div className="text-block-36 lrg vgd-copy">{ this.state.msg }</div>
								            	:''
								        	}
									        <form id="email-form" name="email-form" data-name="Email Form">
									        	<input type="email" 
									        		className="textfield ful w-input" 
									        		maxlength="256" 
									        		name="Email" 
									        		placeholder="Email" 
									        		id="Email-2"
									        		value={ this.state.email }
									        		onChange={ (e) => this.setState({ email : e.target.value}) }
									        		required
								        		/>
									        	<input type="text" 
									        		className="textfield ful w-input" 
									        		maxlength="256" 
									        		name="Email-3" 
									        		placeholder="Name" 
									        		id="Email-3" 
									        		value={ this.state.fullname }
									        		onChange={ (e) => this.setState({ fullname : e.target.value}) }
									        		required 
								        		/>
								          		<div className="text-block-36 lrg vgd-copy">This is an automated video interview. You can delete your submitted interview at any time.</div>
									        </form>
								      	</div>
								    </div>
								}
								<div ref="app">
									<MediaCapturer
										constraints={{ audio: true, video: true }}
										timeSlice={10}
										onRequestPermission={this.handleRequest}
										onGranted={this.handleGranted}
										onDenied={this.handleDenied}
										onStart={this.handleStart}
										onStop={this.handleStop}
										onPause={this.handlePause}
										onResume={this.handleResume}
										onError={this.handleError} 
										onStreamClosed={this.handleStreamClose}
										render={({ request, start, stop, pause, resume }) => 
										<div>
											{
												!this.state.recording?
													<button className="button-2 form-button w-inline-block" onClick={start}>
														Start
														<img src="https://uploads-ssl.webflow.com/5c5f614abad523f096147dd0/5c5f699016bb6e1e8e498514_icons8-forward-90.png" width="24" alt="" className="button-icon" />
													</button>
												:
												allow?
													<div className="div-block-83-copy" style={{ color : "#fff"}}>
												        <div className="minimenu">
												          <div className="div-block-186">
												            <div className="minibutton">
												            	<img src={ this.state.paused? resumeImg : pauseImg } width="25" alt="" className="image-40" />
												            	{this.state.paused?
												              		<div className="text-block-49" onClick={resume}>Resume</div>
												              		:
												              		<div className="text-block-49" onClick={pause}>Pause</div>
												            	}
												            </div>
												          </div>
												          <div onClick={stop}>End Interview</div>
												        </div>
												    </div>
											    	:''
											}
											<video autoPlay></video>
										</div>
									} />
							    </div>
						    </div>
					    </div>
					    :
					    <div className="page-content">
				            <h2 className="text-block-14">Please check you have a mic and camera enabled</h2>
			          	</div>
					}
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(InterviewProcess);
