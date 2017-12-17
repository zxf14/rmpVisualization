import React from "react";

export default class Video extends React.Component {

    state = {
        valid: true,
        progress_length: 0,
        buffer_length: 0,
        volume_length: 0,
        buffer_volume_length: 0,
        duration: 0,
        current_time: 0,
        play: false,
        muted: false
    };

    componentDidMount = () => {
        var _this = this;

        var $volumeContent = $(".volume-content");
        // set volume
        _this.video.volume = 0.5;
        _this.setState({volume_length: $volumeContent.width() * 0.5});

        // show volume when hover
        $volumeContent.width(0);
        $(".volume").hover(function () {
            $volumeContent.stop(true).animate({width: "60px"}, 400);
        }, function () {
            $volumeContent.stop(true).animate({width: "0"}, 400);
        });

        // add caption
        $(".video-caption").click(function () {
            _this._playAndPause();
        });

        // prevent mute-menu
        $(_this.video).bind('contextmenu', function () {
            return false;
        });

        // show controls when hover, hide after 1.5s
        var $videoControls = $(".video-controls");
        $(".myVideoPlayer").hover(function () {
            $videoControls.stop(true).animate({bottom: "5px"}, 300);
        }, function () {
            if (_this.state.play) {
                setTimeout(()=> {
                    $videoControls.stop(true).animate({bottom: "-36px"}, 300);
                }, 1500);
            }
        });
        
        // add timeupdate listener
        _this.video.addEventListener('timeupdate', function () {
            if (_this.video) {
                _this._timeUpdate();
            }
        });

        // add loadmetadata listener
        _this.video.addEventListener('loadedmetadata', function () {
            _this.setState({duration: _this.video.duration});
            _this.setState({current_time: 0});
            _this.props.getDuration(Math.floor(_this.video.duration));
        });

        // add progress listener
        _this.video.addEventListener('progress', function () {
            if (_this.video.onprogress) {
                try {
                _this.setState({buffer_length: _this.video.buffered.end(0) / _this.video.duration * $(".video-progress").width()})
                } catch (err) {
                    // _this.setState({valid: false});
                    console.log(err);
                }
            }
        });
    };

    _timeFormat = (time) => {
        time = parseInt(time);
        var h = Math.floor(time / 3600);
        time %= 3600;
        var m = Math.floor(time / 60);
        var s = time % 60;
        return (h == 0 ? "" : (h + ":")) + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
    };

    _playAndPause = () => {
        if (this.state.play) {
            this.video.pause();
        } else {
            this.video.play();
        }
        this.setState({play: !this.state.play});
    };

    _toggleMute = () => {
        this.video.muted = !this.video.muted;
        if (!this.state.muted) {
            this.setState({buffer_volume_length: this.state.volume_length});
            this.setState({volume_length: 0});
        } else {
            this.setState({volume_length: this.state.buffer_volume_length});
        }
        this.setState({muted: !this.state.muted});
    };

    _timeUpdate = () => {
        this.setState({current_time: this.video.currentTime});
        this.setState({progress_length: this.video.currentTime / this.video.duration * $(".video-progress").width()});
        if (this.video.currentTime == this.video.duration) {
            this.video.pause();
            this.setState({play: false});
        }
    };

    _fullScreen = () => {
        var video = this.video;
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
        } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        }
    };

    _setProgress = (e) => {
        var $progress = $(".video-progress");
        var length = e.pageX - $progress.offset().left;
        this.setState({progress_length: length});
        this.video.currentTime = length / $progress.width() * this.video.duration;
    };

    _setVolume = (e) => {
        var $volume = $(".volume-content");
        var length = e.pageX - $volume.offset().left;
        this.setState({volume_length: length});
        this.video.volume = length / $volume.width();
        if (this.state.muted) {
            this.setState({muted: false});
            this.video.muted = false;
        }
    };

    render = () => {
        return (
            <div>
                {
                    !this.state.valid &&
                    <h4 style={{textAlign: 'center'}}>视频链接无效,请检查后重试</h4>
                }
                {
                    this.state.valid &&
                    <div className="x-videoPlayer">
                        <video preload="auto" ref={(ref) => this.video = ref} id="video">
                            <source src={this.props.src}/>
                            <p>抱歉,您的浏览器不支持此视频!</p>
                        </video>
                        <div className="video-caption">
                            <span className={"fa fa-play-circle signal " + (this.state.play ? "hidden" : "")}/>
                            <span className={"fa fa-pause-circle signal " + (this.state.play ? "" : "hidden")}/>
                        </div>
                        <div className="video-controls">
                            <div className="video-progress" onClick={this._setProgress}>
                                <div className="video-progress-buffer"
                                     style={{width: this.state.buffer_length + "px"}}></div>
                                <div className="video-progress-bar"
                                     style={{width: this.state.progress_length + "px"}}></div>
                                <div className="video-progress-node"
                                     style={{left: this.state.progress_length + "px"}}></div>
                            </div>
                            <div className="video-controller">
                                <div className="left group">
                                    <div className="play-pause">
                                        <button className={"fa " + (this.state.play ? "fa-pause" : "fa-play")}
                                                onClick={this._playAndPause}/>
                                    </div>
                                    <div className="volume">
                                        <div className="volume-icon">
                                            <button
                                                className={"fa " + (this.state.muted ? "fa-volume-off" : "fa-volume-up")}
                                                onClick={this._toggleMute}/>
                                        </div>
                                        <div className="volume-content" onClick={this._setVolume}>
                                            <div className="volume-bar"
                                                 style={{width: this.state.volume_length + "px"}}></div>
                                        </div>
                                    </div>
                                    <div className="video-timeline">
                    <span>{this._timeFormat(this.state.current_time)}
                        / {this._timeFormat(this.state.duration)}</span>
                                    </div>
                                </div>
                                <div className="right group">
                                    <div className="full-screen">
                                        <button className="fa fa-expand" onClick={this._fullScreen}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }

            </div>

        )
    }
}
