import React, { Component } from 'react';
import MediaCapturer from 'react-multimedia-capture';
import agent from '../agent';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import {
  INTERVIEW_PAGE_LOADED,
  INTERVIEW_PAGE_UNLOADED,
  ADD_APPLIER
} from '../constants/actionTypes';
import AudioPlayerOne from './AudioPlayerOne';
import InterviewProcessStart from './InterviewProcessStart';
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
			fullname: '',
			email : '',
			msg : '',
			mode : 'audio',
			start : ''
		};

		this.submitForm = ev => {
			ev.preventDefault();
			if(this.state.email != '') {
				this.setState({
					start : true
				})
			}
			else {
				this.setState({msg : "Please input your email and name" });
			}
		};
		this.changeMode = this.changeMode.bind(this);
	}

	// onStart() {
	// 	this.setState({
	// 		start : true
	// 	})
	// }

	changeMode(mode) {
		this.setState({ mode : mode });
	}

	render() {
		if (this.state.start){
			return (
        		<InterviewProcessStart 
        			questionList={this.props.questions} 
        			interview={this.props} 
        			email={ this.state.email }
        			fullname={this.state.fullname}
        			mode={this.state.mode}
    			/>
    		)
		}
		else
			return (
		      	<div className="interview-process-page">
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
					<div className="div-block-43-copy">
						<div className="div-block-44">
							<div className="text-block-46">Please turn on before starting:</div>
							<div className="div-block-193">
						      	<label className={classNames('button-2 loginbutton smaller w-inline-block', this.state.mode === 'audio' && 'b-active')} onClick={ () => this.changeMode('audio')}>
							      <img src={ microPhoneImg } width="29" alt="" className="login-button-images" />
							      <div>Microphone</div>
						      	</label>
						      	<label className={classNames('button-2 loginbutton smaller w-inline-block', this.state.mode === 'video' && 'b-active')} onClick={ () => this.changeMode('video')}>
							      	<img src={ videoCallImg} width="29" alt="" className="login-button-images" />
							      	<div>Webcam</div>
						      	</label>
					      		<label className={classNames('button-2 loginbutton smaller w-inline-block', this.state.mode === 'screen' && 'b-active')} onClick={ () => this.changeMode('screen')}>
							      	<img src={ mousePointerImg } width="29" alt="" className="login-button-images" />
							      <div>Screenshare</div>
						      	</label>
					        </div>
					      	<div className="w-form">
					            { this.state.msg != '' ? 
					            	<div className="text-block-36 lrg vgd-copy">{ this.state.msg }</div>
					            	:''
					        	}
						        <form id="email-form" name="email-form" data-name="Email Form">
						        	<input type="email" 
						        		className="textfield ful w-input" 
						        		maxLength="256" 
						        		name="Email" 
						        		placeholder="Email" 
						        		id="Email-2"
						        		value={ this.state.email }
						        		onChange={ (e) => this.setState({ email : e.target.value}) }
						        		required
					        		/>
						        	<input type="text" 
						        		className="textfield ful w-input" 
						        		maxLength="256" 
						        		name="Email-3" 
						        		placeholder="Name" 
						        		id="Email-3" 
						        		value={ this.state.fullname }
						        		onChange={ (e) => this.setState({ fullname : e.target.value}) }
						        		required 
					        		/>
					          		<div className="text-block-36 lrg vgd-copy">This is an automated video interview. You can delete your submitted interview at any time.</div>
					          		<button className="button-2 form-button w-inline-block" 
					          			onClick={this.submitForm}
					          			onKeyDown={this.submitForm}
					          			 >
										Start
										<img src="https://uploads-ssl.webflow.com/5c5f614abad523f096147dd0/5c5f699016bb6e1e8e498514_icons8-forward-90.png" width="24" alt="" className="button-icon" />
									</button>
						        </form>
					      	</div>
					    </div>
				    </div>
				</div>
			);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(InterviewProcess);
