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

class Company extends React.Component {
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
      <div className="company-page">
        <div className="container page">
          <div className="page-header">
            <div className="page-title">
              <p>{this.props.currentUser.companyname}</p>
            </div>
            <div className="page-controls">
              <div className="">
                <select className="btn btn-lg" 
                  >
                    <option>All</option>
                </select>
                <Link to="/new-interview" className="btn btn-lg btn-primary">
                  New Interview
                </Link>
                <input
                  className="btn btn-lg search"
                  type="text"
                  placeholder="Search"
                  />
              </div>
            </div>
          </div>
          <div className="page-content">
            <table className="table table-hover">
              <thead>
                <tr>
                  <td>Name</td>
                  <td>People</td>
                  <td>Questions</td>
                  <td>Points</td>
                </tr>
              </thead>
              <tbody>
              { this.props.interviews?
                  this.props.interviews.map( interview => 
                    <tr>
                      <td className="name" onClick={ () => { this.props.history.push(`/interview/${interview.slug}`)}}>
                        <div style={{ display : "flex" }}>
                          <img  src={dummyImg} className="user-avatar"/>
                          <div>
                            <p>
                              <p>{ interview.title }</p>
                            </p>
                            <p className="info">
                              18hours ago
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                    </tr>
                  )
                :''
              }
              </tbody>
            </table>
          </div>
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Company);
