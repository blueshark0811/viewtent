import React from 'react';
import { Link } from 'react-router-dom';
import agent from '../agent';
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../constants/actionTypes';
import lockImg from '../assets/images/lock.svg';
import folderImg from '../assets/images/folder.svg';
import monitorImg from '../assets/images/monitor.svg';

const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token,
  currentUser: state.common.currentUser,
});

const mapDispatchToProps = dispatch => ({
  onClickTag: (tag, pager, payload) =>
    dispatch({ type: APPLY_TAG_FILTER, tag, pager, payload }),
  onLoad: (tab, pager, payload) =>
    dispatch({ type: HOME_PAGE_LOADED, tab, pager, payload }),
  onUnload: () =>
    dispatch({  type: HOME_PAGE_UNLOADED })
});

class Homepage extends React.Component {
  componentWillMount() {
    // const tab = this.props.token ? 'feed' : 'all';
    // const interviewsPromise = this.props.token ?
    //   agent.Interviews.feed :
    //   agent.Interviews.all;
    const tab = 'all';
    const interviewsPromise = agent.Interviews.all;
    this.props.onLoad(tab, interviewsPromise, Promise.all(['', interviewsPromise()]));
  }

  componentWillUnmount() {
    this.props.onUnload()
  }

  render() {
    return (
      <div className="dashboard-page">
        <div className="container page">
          <div className="div-block-212">
            <div className="div-block-213">
              <h2 className="heading-4">Create time-saving automated video interviews.</h2>
              <div className="div-block-222">
                <div className="div-block-208"><img src={ lockImg } width="29" alt="" className="image-50" />
                  <div>Privacy-focused</div>
                </div>
                <div className="div-block-208"><img src={ folderImg } width="29" alt="" className="image-50" />
                  <div>1GB Free</div>
                </div>
                <div className="div-block-208"><img src={ monitorImg} width="29" alt="" className="image-50" />
                  <div>Video,Voice &amp; Screenshare</div>
                </div>
              </div>
              <div className="div-block-215">
                <Link to="/register" className="button-2 csh w-inline-block">
                    <div>Get Started</div>
                </Link>
              </div>
              <div className="div-block-216">
                <div>Only you can see the interview</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
