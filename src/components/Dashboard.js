import React from 'react';
import { Link } from 'react-router-dom';
import agent from '../agent';
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../constants/actionTypes';
import dummyImg from '../assets/images/monitor.svg';
import moreImg from '../assets/images/icons8-more-90_1icons8-more-90.png';

const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.interviewList,
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

class Dashboard extends React.Component {
  componentWillMount() {
    // const tab = this.props.token ? 'feed' : 'all';
    // const interviewsPromise = this.props.token ?
    //   agent.Interviews.feed :
    //   agent.Interviews.all;
    const tab = 'all';
    const interviewsPromise = agent.Interviews.byAuthor(this.props.currentUser.username);
    this.props.onLoad(tab, interviewsPromise, Promise.all(['', interviewsPromise]));
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    if (!this.props.currentUser){
      return null;
    }
    return (
      <div className="dashboard-page">
        <div className="container page">
          <div className="top-menu">
            <div className="second-menu">
              <div className="div-block-51">
                <div className="menuheader">All Interviews<br /></div>
                <div className="align">
                  <div className="button-2 white wdropdown hid">
                    <img src="images/icons8-filter-96.png" width="17" alt="" /></div>
                    <Link to="/new-interview" className="button-2 _24 blkd w-button">
                      New Interview
                    </Link>
                  <div className="search">
                    <div>Search</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="div-block-26">
            <div className="div-block-183">
              <div className="w-row">
                <div className="w-col w-col-6">
                  <div>Name</div>
                </div>
                <div className="w-col w-col-3">
                  <div>People</div>
                </div>
                <div className="w-col w-col-3">
                  <div>Questions</div>
                </div>
              </div>
            </div>
            { this.props.interviews?
                this.props.interviews.map( interview => 
                  <div className="row">
                    <div className="columns w-row">
                      <div className="w-col w-col-6" onClick={ () => { this.props.history.push(`/interview/${interview.slug}`)}}>
                        <div className="aligntext"><img src={ dummyImg } alt="" className="image-35" />
                          <div>
                            <div className="text-block-41">{ interview.title }</div>
                            <div className="grey-text">{ interview.offset } ago</div>
                          </div>
                        </div>
                      </div>
                      <div className="w-col w-col-3">
                        <div> { interview.appliers.length }</div>
                      </div>
                      <div className="w-col w-col-1">
                        <div> { interview.questions.length } </div>
                      </div>
                      <div className="w-clearfix w-col w-col-2">
                        <div data-delay="0" className="dropdown w-dropdown">
                          <div className="dropdown-toggle w-dropdown-toggle">
                            <img src={ moreImg } width="62" alt="" className="menuimage" />
                          </div>
                          <nav className="dropdown-list w-dropdown-list">
                            <a href="#" className="text-block-10 _0-copy w-dropdown-link">View</a>
                            <a href="#" className="text-block-10 _0-copy showund w-dropdown-link">Copy link</a>
                            <a href="#" className="text-block-10 _0-copy w-dropdown-link">Delete</a></nav>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              :''
            }
          </div>
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
