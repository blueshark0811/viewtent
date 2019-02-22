import React from 'react';
import agent from '../agent';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ADD_QUESTION } from '../constants/actionTypes';
import sendImg from '../assets/images/send.png';
import recordImg from '../assets/images/record.png';
import favoriteBackImg from '../assets/images/favorite-back.png';
import bufferToWav from 'audiobuffer-to-wav';
import xhr from 'xhr';
import Textarea from 'react-textarea-autosize';


const mapDispatchToProps = dispatch => ({
  onSubmit: payload =>
    dispatch({ type: ADD_QUESTION, payload })
});

class QuestionInput extends React.Component {
  constructor() {
    super();
    this.state = {
      questionTab : 'voice',
      body: '',
    };

    this.setBody = ev => {
      this.setState({ body: ev.target.value });
    };

    this.enterKeydown = ev => {
      if (ev.key === 'Enter' && ev.shiftKey) {         
          return;
      }
      else if (ev.key === 'Enter') {
        this.createQuestion(ev);
      }
    }

    this.createQuestion = ev => {
      ev.preventDefault();
      var _self = this;
      var blobUrl = '';
      if(this.state.recordedFile){
        blobUrl = this.state.recordedFile.blobURL;
      }
      if(this.state.selectedFile){
        blobUrl = URL.createObjectURL(this.state.selectedFile);
      }
      if(blobUrl != ''){
        var audioContext = new (window.AudioContext || window.webkitAudioContext)()
        var data = new Promise(function(resolve, rejecet)
          {
            xhr({
              uri: blobUrl,
              responseType: 'arraybuffer'
            }, function (err, body, resp) {
              if (err) throw err
              audioContext.decodeAudioData(resp, function (buffer) {
                var wav = bufferToWav(buffer)
                var blob = new window.Blob([ new DataView(wav) ], {
                  type: 'audio/wav'
                })
                var fd = new FormData();
                fd.append('fname', 'test.wav');
                fd.append('data', blob);
                resolve(fd)
              }, function () {
                throw new Error('Could not decode audio data.')
              })
            })
          });
        data.then(function(res){
          agent.Interviews.upload(res)
          .then(function (response) {
              const payload = agent.Questions.create(_self.props.slug,
                { 
                  body: response.data.script ,
                  audio : response.data.title
                }
              );
              _self.props.onSubmit(payload);
              _self.setState({ body: '' });
          })
          .catch(function (error) {
            console.log(error);
          });
        });
        this.setState({
          selectedFile : null,
          recordedFile : null
        })
      }
      else if (this.state.body.trim() != '') {
        const payload = agent.Questions.create(this.props.slug,
          { body: this.state.body.trim() }
        );
        this.setState({ body: '' });
        this.props.onSubmit(payload);
      }
      else {
        this.setState({ body: '' });
      }
    };

    this.handleClickQuestionTab = tab => {
      if (tab == 'voice' ){
        this.setState({
          questionTab : tab,
          body : '',
        })
      }
      else {
       this.setState({
          questionTab : tab,
          selectedFile : null,
          recordedFile : null,
        }) 
        clearInterval(this.state.intervalId);
      }
    }

    this.setSelectFile = file => {
      this.setState({
        recordedFile : file,
        selectedFile : null,
        selectedFileURL : null
      })
    }

    this.handleSelectedFile = ev => {
      this.setState({
        recordedFile : null,
        selectedFile: ev.target.files[0],
        selectedFileURL : URL.createObjectURL(ev.target.files[0])
      });
    }
  }

  render() {
    return (
      <div className="question-input">
        <form className="question-form  form-group" onSubmit={this.createQuestion} style={{ margin : "0px"}}>
          <div className="question-text">
            <Textarea className="form-control question-input"
              placeholder="Add a question..."
              value={this.state.body}
              onChange={this.setBody}
              onKeyUp={this.enterKeydown}
              minRows={5}
              maxRows={10}
              rows="1">
            </Textarea>
          </div>
          <button className="btn btn-primary btn-lg" onClick={this.createQuestion}>Send</button>
        </form>
      </div>
    );
  }
}

export default connect(() => ({}), mapDispatchToProps)(QuestionInput);