import React from 'react';
import { Link } from 'react-router-dom';
import agent from '../agent';
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../constants/actionTypes';
import dummyImg from '../assets/images/dummy.jpg';

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

class Thankyou extends React.Component {
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
      <div className="thankyou-page">
        <div className="container page">
          <div className="page-content">
            <h2 className="text-xs-center">Thank you for your apply. <br /> <br />We will review your application and contact you later.</h2>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Thankyou);
