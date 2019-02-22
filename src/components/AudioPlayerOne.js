import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AudioPlayerOne extends Component {

  static propTypes = {
    autoplay: PropTypes.bool,
    progressColor: PropTypes.string,
    btnColor: PropTypes.string,
    style: PropTypes.object,
  }

  static defaultProps = {
    autoplay: false,
    progressColor: '#66cccc',
    btnColor: '#4a4a4a',
    style: {},
  }

  constructor(props) {
    super(props)
    this.state = {
      activeMusicIndex: 0,
      leftTime: 0,
      play: this.props.autoplay || false,
      playMode: 'loop',
      progress: 0,
      volume: 1,
      duration : 0.0,
      currentTime : 0.0
    }
    this.modeList = ['loop', 'random', 'repeat']
  }

  componentDidMount() {
    const audioContainer = this.audioContainer
    audioContainer.addEventListener('timeupdate', this.updateProgress.bind(this))
    audioContainer.addEventListener('ended', this.end.bind(this))
  }

  componentWillUnmount() {
    const audioContainer = this.audioContainer
    audioContainer.removeEventListener('timeupdate', this.updateProgress.bind(this))
    audioContainer.removeEventListener('ended', this.end.bind(this))
  }

  updateProgress() {
    const duration = this.audioContainer.duration
    const currentTime = this.audioContainer.currentTime
    this.setState({
      duration : duration,
      currentTime : currentTime
    })
    const progress = currentTime / duration
    this.setState({
      progress: progress,
      leftTime: duration - currentTime
    })
  }

  end() {
    // this.handleNext()
    this.setState({ play : false});
  }

  handleAdjustProgress(e) {
    const progressContainer = this.progressContainer
    const progress = (e.clientX - progressContainer.getBoundingClientRect().left) / progressContainer.clientWidth
    const currentTime = this.audioContainer.duration * progress
    this.audioContainer.currentTime = currentTime
    this.setState({
      play: true,
      progress: progress
    }, () => {
      this.audioContainer.play()
    })
  }

  handleAdjustVolume(e) {
    const volumeContainer = this.volumeContainer
    let volume = (e.clientX - volumeContainer.getBoundingClientRect().left) / volumeContainer.clientWidth
    volume = volume < 0 ? 0 : volume
    this.audioContainer.volume = volume
    this.setState({
      volume: volume
    })
  }

  handleToggle() {
    this.state.play ? this.audioContainer.pause() : this.audioContainer.play()
    this.setState({ play: !this.state.play })
  }

  handlePrev() {
    const { playMode, activeMusicIndex } = this.state
    if (playMode === 'repeat') {
      this._playMusic(activeMusicIndex)
    } else if (playMode === 'loop') {
      const total = this.props.playlist.length
      const index = activeMusicIndex > 0 ? activeMusicIndex - 1 : total - 1
      this._playMusic(index)
    } else if (playMode === 'random') {
      let randomIndex = Math.floor(Math.random() * this.props.playlist.length)
      while (randomIndex === activeMusicIndex) {
        randomIndex = Math.floor(Math.random() * this.props.playlist.length)
      }
      this._playMusic(randomIndex)
    } else {
      this.setState({ play: false })
    }
  }

  handleNext() {
    const { playMode, activeMusicIndex } = this.state
    if (playMode === 'repeat') {
      this._playMusic(activeMusicIndex)
    } else if (playMode === 'loop') {
      const total = this.props.playlist.length
      const index = activeMusicIndex < total - 1 ? activeMusicIndex + 1 : 0
      this._playMusic(index)
    } else if (playMode === 'random') {
      let randomIndex = Math.floor(Math.random() * this.props.playlist.length)
      while (randomIndex === activeMusicIndex) {
        randomIndex = Math.floor(Math.random() * this.props.playlist.length)
      }
      this._playMusic(randomIndex)
    } else {
      this.setState({ play: false })
    }
  }

  handleChangePlayMode() {
    let index = this.modeList.indexOf(this.state.playMode)
    index = (index + 1) % this.modeList.length
    this.setState({ playMode: this.modeList[index] })
  }

  _playMusic(index) {
    this.setState({
      activeMusicIndex: index,
      leftTime: 0,
      play: true,
      progress: 0
    }, () => {
      this.audioContainer.currentTime = 0
      this.audioContainer.play()
    })
  }

  _formatTime(time) {
    if (isNaN(time) || time === 0) {
      return '00:00'
    }
    const mins = Math.floor(time / 60)
    const secs = (time % 60).toFixed()
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  _processArtistName(artistList) {
    return artistList.join(' / ')
  }

  componentDidMount() {
    if (this.props.autoPlay ) {
      this.setState({play : true})
    }
  }

  render() {
    const { progressColor, btnColor } = this.props
    const { activeMusicIndex, playMode } = this.state
    const playModeClass = playMode === 'loop' ? 'refresh' : playMode === 'random' ? 'random' : 'repeat'
    const btnStyle = { color: btnColor }
    const progressStyle = { width: `${this.state.progress * 100}%`, backgroundColor: progressColor }

    return (
      <div className="simple-player">
        <audio
          autoPlay={this.state.play}
          preload="auto"
          ref={ref => { this.audioContainer = ref }}
          src={this.props.audio}
        />
        <i className={`icon fa fa-${this.state.play ? 'pause' : 'play'}`} onClick={this.handleToggle.bind(this)}></i>
      </div>
    )
  }
}

export default AudioPlayerOne