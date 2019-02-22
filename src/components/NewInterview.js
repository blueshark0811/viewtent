import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
import {
  ADD_TAG,
  EDITOR_PAGE_LOADED,
  REMOVE_TAG,
  INTERVIEW_SUBMITTED,
  EDITOR_PAGE_UNLOADED,
  UPDATE_FIELD_EDITOR
} from '../constants/actionTypes';
import dummyImg from '../assets/images/dummy.jpg';


const mapStateToProps = state => ({
  ...state.editor
});

const mapDispatchToProps = dispatch => ({
  onAddTag: () =>
    dispatch({ type: ADD_TAG }),
  onLoad: payload =>
    dispatch({ type: EDITOR_PAGE_LOADED, payload }),
  onRemoveTag: tag =>
    dispatch({ type: REMOVE_TAG, tag }),
  onSubmit: payload =>
    dispatch({ type: INTERVIEW_SUBMITTED, payload }),
  onUnload: payload =>
    dispatch({ type: EDITOR_PAGE_UNLOADED }),
  onUpdateField: (key, value) =>
    dispatch({ type: UPDATE_FIELD_EDITOR, key, value })
});

class Editor extends React.Component {
  constructor() {
    super();

    const updateFieldEvent =
      key => ev => this.props.onUpdateField(key, ev.target.value);
    this.changeTitle = updateFieldEvent('title');
    this.changeRequire = updateFieldEvent('require');
    this.changeAllow = updateFieldEvent('allow');

    this.watchForEnter = ev => {
      if (ev.keyCode === 13) {
        ev.preventDefault();
        this.props.onAddTag();
      }
    };

    this.removeTagHandler = tag => () => {
      this.props.onRemoveTag(tag);
    };

    this.submitForm = ev => {
      ev.preventDefault();
      const interview = {
        title: this.props.title,
        require: this.props.require,
        allow: this.props.allow
      };

      const slug = { slug: this.props.interviewSlug };
      const promise = this.props.interviewSlug ?
        agent.Interviews.update(Object.assign(interview, slug)) :
        agent.Interviews.create(interview);

      this.props.onSubmit(promise);
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.slug !== nextProps.match.params.slug) {
      if (nextProps.match.params.slug) {
        this.props.onUnload();
        return this.props.onLoad(agent.Interviews.get(this.props.match.params.slug));
      }
      this.props.onLoad(null);
    }
  }

  componentWillMount() {
    if (this.props.match.params.slug) {
      return this.props.onLoad(agent.Interviews.get(this.props.match.params.slug));
    }
    this.props.onLoad(null);
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <div className="new-interview-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-4 offset-md-4 col-xs-12 new-interview-form">
              <h1 className="text-xs-left"><b>New Interview</b></h1>
              <ListErrors errors={this.props.errors} />
              <form onSubmit="">
                <div className="choose-logo">
                  <img  src={dummyImg} />
                  <button
                    className="btn btn-md btn-default choose-logo-btn">
                    <span>Change Logo</span>
                  </button>
                </div>
                <fieldset>
                  <p>Title</p>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Title"
                      value={this.props.title}
                      onChange={this.changeTitle} 
                      required />
                  </fieldset>

                  <fieldset className="form-group">
                    <p>Require</p>
                    <select className="form-control form-control-lg"
                      onChange={this.changeRequire} 
                    >
                      <option value="voice">Voice</option>
                    </select>
                  </fieldset>

                  <fieldset className="form-group">
                    <p>Allow Interview From</p>
                    <select className="form-control form-control-lg"
                      onChange={this.changeAllow} 
                    >
                      <option value="anyone with link">Anyone with link</option>
                    </select>
                  </fieldset>

                  <button 
                    onClick={this.submitForm}
                    disabled={this.props.inProgress}
                    className="form-control btn btn-lg btn-primary new-interview-btn text-xs-center">
                    <span>Create</span>
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
