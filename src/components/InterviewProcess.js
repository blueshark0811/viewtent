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
			questionIndex : 0
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
		this.setState({
			recording: true
		});

		this.setStreamToVideo(stream);
		console.log('Recording Started.');
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
        console.log('~~~~~~~~~~~~~', fd);
        agent.Interviews.upload(fd).then(function(response){
        	// response.data.title;
    		var payload = agent.Interviews.createApplier(_self.props.interviewSlug,
                { 
                  	video : response.data.title
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
        	// response.data.title;
    		var payload = agent.Interviews.createApplier(_self.props.interviewSlug,
                { 
                  	video : response.data.title
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

		return (
	      	<div className="interview-process-page">
	      		{ rejectedReason == ''?
			        <div className="container page">
						<div className="page-header">
							<div className="page-title">
							</div>
							<div className="page-controls">
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
													<button className="btn btn-lg btn-default" onClick={start}>Start</button>
												:
												<button className="btn btn-lg btn-primary" onClick={stop}>Submit</button>
											}
											{/* <button onClick={pause}>Pause</button>
											<button onClick={resume}>Resume</button> */}
											<video autoPlay></video>
										</div>
									} />
								</div>
							</div>
						</div>
						<div className="page-content">
							{  questionList && questionList.length > 0 ?
									recording ?
									<h1 style={{ padding : "30px 0px"}}> Interview Started!  &nbsp; { this.state.questionIndex+1 } /  { questionList.length }</h1>
									:
									<h1 style={{ padding : "30px 0px"}} className="text-xs-center"> Start an Interview by clicking "Start" button </h1>
								:
								<h1 style={{ padding : "30px 0px"}} className="text-xs-center"> No questions available. </h1>
							}
							{ questionList && questionList.length > 0 && this.state.recording?
								<div className="inter-form col-md-6">
									<div className="inter-question">
										<AudioPlayerOne audio={ questionList[this.state.questionIndex].audio } autoPlay/>
										<p>{ this.state.questionIndex + 1}. { questionList[this.state.questionIndex].body } </p>
									</div>
									<p className="info"> Please keep required settings on:</p>
									<div className="inter-controls">
										<button className="btn btn-default btn-lg"> Microphone</button>
										<button className="btn btn-default btn-lg"> Webcam</button>
									</div>
									{ this.state.questionIndex <  questionList.length-1?
										<button className="btn btn-success btn-lg form-control" onClick={ () => { this.setState({ questionIndex : this.state.questionIndex + 1 })}}> Next Question </button>
										:
										''
									}
								</div>
								:''
							}
						</div>
					</div>
					:
					<div className="container page">
						<div className="page-header">
							<div className="page-title">
								<p>Please check you have a mic and camera enabled</p>
							</div>
						</div>
					</div>
	      		}
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(InterviewProcess);
