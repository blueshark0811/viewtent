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
import { Player, ControlBar, BigPlayButton  } from 'video-react';
import "video-react/dist/video-react.css";

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


class InterviewView extends React.Component {
	constructor() {
		super();
		this.state = {
			questionIndex : 0
		};
	}


	componentDidMount() {

	}

	render() {
		const granted = this.state.granted;
		const rejectedReason = this.state.rejectedReason;
		const recording = this.state.recording;
		const paused = this.state.paused;
		const questionList = this.props.questions;

		return (
	      	<div className="interview-view-page">
		        <div className="container page">
					<div className="page-header">
						<div className="page-title">
							<p style={{ marginRight: "100px"}}> Interview Title: { this.props.location.state.interview.title } </p>
							<p> Applier : { this.props.location.state.user.username } </p>
						</div>
					</div>
					<div className="page-content">
						<Player 
							ref="player"
							>
						  <source src={ this.props.location.state.video}
							fluid="false"
							width="500"
							height ="200"
							/>
						  <BigPlayButton position="center" />
				          <ControlBar autoHide={false} />
						</Player>
					</div>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(InterviewView);
