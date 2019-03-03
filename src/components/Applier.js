import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
import {
  UPDATE_INTERVIEW,
  APPLIER_PAGE_LOADED
} from '../constants/actionTypes';
import backImg from '../assets/images/icons8-chevron-left-90_1icons8-chevron-left-90.png';
import userImg from '../assets/images/user.svg';
import removeImg from '../assets/images/x.svg';



const mapStateToProps = state => ({
  ...state.interview,
  currentUser: state.common.currentUser,
});

const mapDispatchToProps = dispatch => ({
  onLoad: payload =>
    dispatch({ type: APPLIER_PAGE_LOADED, payload })
});

class Applier extends React.Component {
  constructor() {
    super();
    this.state = {
      title : '',
      require : 'voice',
      allow : 'Applierd'
    }
  }

  componentWillMount() {
    if( this.props.match.params.slug && this.props.match.params.id){
      this.props.onLoad(Promise.all([
        agent.Interviews.get(this.props.match.params.slug),
        agent.Interviews.applierOneForInterview(this.props.match.params.slug, this.props.match.params.id)
      ]));  
    }
  }

  render() {
    return (
      <div className="new-interview-page">
        <div data-collapse="medium" data-animation="default" data-duration="400" className="navbar-2 nosha w-nav">
          <img src={ backImg } width="29" alt="" className="image-51" onClick={ () => { this.props.history.goBack() }}/>
        </div>
        <div className="div-block-225">
          <div className="div-block-226">
            <div className="aligntext-copy blf">
              <div className="div-block-229">
                <img src="images/check-circle.svg" width="26" alt="" className="image-53" />
                <div className="_66">Videos</div>
              </div>
            </div>
            <div className="aligntext-copy">
              <img src="images/circle.svg" width="26" alt="" className="image-53" />
              <div className="div-block-229">
                <div className="_66">History</div>
              </div>
            </div>
          </div>
          <div className="div-block-26-copy">
            <div className="div-block-183">
              <div className="w-row">
                <div className="w-col w-col-7">
                  <div>Videos</div>
                </div>
                <div className="w-col w-col-5">
                  <div>Duration</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="columns w-row">
                <div className="w-col w-col-7">
                  <div className="aligntext">
                    <div className="div-block-185">
                      <div className="text-block-41">02/12/2019 @ 10:31am</div>
                      <div className="grey-text">Voice and Video</div>
                    </div>
                  </div>
                </div>
                <div className="w-col w-col-3">
                  <div>50:56</div>
                </div>
                <div className="w-clearfix w-col w-col-2">
                  <div data-delay="0" className="dropdown w-dropdown">
                    <div className="dropdown-toggle w-dropdown-toggle">
                      <img src="images/icons8-more-90_1icons8-more-90.png" width="62" alt="" className="menuimage" />
                    </div>
                    <nav className="dropdown-list w-dropdown-list"><
                      a href="#" className="text-block-10 _0-copy w-dropdown-link">View</a>
                      <a href="#" className="text-block-10 _0-copy showund w-dropdown-link">Read Transcript</a>
                      <a href="#" className="text-block-10 _0-copy w-dropdown-link">Delete</a>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Applier);
