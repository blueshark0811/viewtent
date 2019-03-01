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
import dummyImg from '../assets/images/monitor.svg';
import checkCircleImg from '../assets/images/check-circle.svg';
import backImg from '../assets/images/icons8-chevron-left-90_1icons8-chevron-left-90.png';



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
          <div data-collapse="medium" data-animation="default" data-duration="400" className="navbar-2 nosha w-nav">
            <img src={ backImg } width="29" alt="" className="image-51" onClick={ () => { this.props.history.goBack() }}/>
          </div>
          <div className="div-block-43-copy">
            <div className="text-block-13">New Interview</div>
            <div className="div-block-44">
              <div className="w-form">
                <form id="email-form" name="email-form" data-name="Email Form">
                  <div className="text-block-39">Name of Interview (Optional)</div>
                  <ListErrors errors={this.props.errors} />
                  <input
                    className="textfield ful w-input"
                    type="text"
                    placeholder="Name"
                    value={this.props.title}
                    onChange={this.changeTitle} 
                    required />
                  <div className="text-block-39">Require</div>
                  <div className="div-block-206">
                    <div className="div-block-208">
                      <div className="div-block-207"><img src={ checkCircleImg } alt="" /></div>
                      <div>Voice</div>
                    </div>
                    <div className="div-block-208">
                      <div className="div-block-207"></div>
                      <div>Webcam</div>
                    </div>
                  </div>
                  <div className="text-block-39">Allow interviews from</div>
                  <div className="div-block-206">
                    <div className="div-block-208">
                      <div className="div-block-207"></div>
                      <div>Invited Only</div>
                    </div>
                    <div className="div-block-208">
                      <div className="div-block-207"><img src={ checkCircleImg } alt="" /></div>
                      <div>Anyone with the link</div>
                    </div>
                  </div>
                  <div className="button-2 white wdropdown formdropdown hide">
                    <div>Anyone with link</div>
                    <div className="icon im-copy w-icon-dropdown-toggle"></div>
                  </div>
                </form>
              </div>
              <button 
                onClick={this.submitForm}
                disabled={this.props.inProgress}
                className="button-2 form-button w-inline-block"
              >
                Create
                <img src="https://uploads-ssl.webflow.com/5c5f614abad523f096147dd0/5c5f699016bb6e1e8e498514_icons8-forward-90.png" width="24" alt="" className="button-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
