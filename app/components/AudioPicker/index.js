import React, {Component, PropTypes }  from 'react';
import {Modal, Tabs, Tab, Button} from "react-bootstrap";
import FileUploadProgress from '../FileUploadProgress';

export default class AudioPicker extends Component{

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            domain: window.localStorage.audioDomain,
            uploadFiles: this.props.initUrlObj || [],
            url: '' || this.props.initUrl,
            hasSelectFile: false,
            hasInputUrl: false,
            isUploading: false
        };
    }

    componentWillReceiveProps(nextProps){
        if (typeof (nextProps.initUrl) != "undefined"){
            if (nextProps.initUrl.indexOf("bkt.clouddn.com")>-1) {
                let temp = [];
                temp.push({
                    name: nextProps.initUrl.split('com/')[1],
                    percent: 100,
                    speed: 30
                });
                this.setState({
                    uploadFiles: temp
                });
            }else {
                this.setState({
                    uploadFiles: []
                });
            }
            this.setState({
                url: nextProps.initUrl
            });
        }
    }




    open = () => {
        this.setState({showModal: true});
        setTimeout(() => {
            this.initQiniu();
        }, 200);
    };

    closeModal = () => {
        this.setState({showModal: false});
    };

    complete = () => {

    };

    closeFileProgress = (value) => {
        this.setState({
            uploadFiles: this.state.uploadFiles.filter(item => item.name != value)
        });
        this.props.removeFeedBack(this.state.domain + '/' + value);
    };

    saveUrl = (event) => {
        this.state.url = event.target.value;

    };

    uploadUrl = () => {
        this.closeModal();
        this.state.hasInputUrl = true;
        this.clearAudio();
        this.props.addFeedBack(this.state.url);
    };
    
    clearAudio = () => {
        var _this = this;
        if (this.state.uploadFiles.length != 0){
            this.state.uploadFiles.map(function (value) {
                _this.props.removeFeedBack(_this.state.domain + '/' + value);
            });
            this.state.uploadFiles.splice(0,this.state.uploadFiles.length);
        }
    };


    transformSize = (value) => {
        const kb = value / 1024;
        const mb = value / (1024 * 1024);
        const gb = value / (1024 * 1024 * 1024);
        if (gb > 1) {
            return gb.toFixed(2) + "GB";
        } else if (mb > 1) {
            return mb.toFixed(2) + "MB";
        } else {
            return kb.toFixed(2) + "KB";
        }
    };

    initQiniu = () => {
        var _this = this;
        Qiniu.uploader({
            runtimes: 'html5, flash, html4',
            browse_button: 'pickAudio',
            uptoken_url: "/xinzhu/api/getAudioUpToken",
            get_new_token: false,
            domain: _this.state.domain,
            max_file_size: "100m",
            flash_swf_url: "/assets/lib/plupload/Moxie.swf",
            max_retries: 3,
            chunk_size: '4mb',
            auto_start: true,
            filters: {
                mime_types : [
                    {title : "MP3 files", extensions: "mp3"}
                ]
            },
            init: {
                'FilesAdded': function (up, files) {
                    _this.clearAudio();
                    plupload.each(files, function (file, index) {
                        _this.setState({
                            uploadFiles: [..._this.state.uploadFiles, {
                                name: file.name,
                                percent: 0,
                                speed: ""
                            }],
                            showModal:false,
                            hasSelectFile: true,
                            url:"",
                            hasInputUrl:false
                        })
                    });
                },
                'BeforeUpload': function (up, file) {
                },
                'UploadProgress': function (up, file) {
                    let index = _this.state.uploadFiles.findIndex(item => item.name == file.name);
                    _this.setState({
                        uploadFiles: [
                            ..._this.state.uploadFiles.slice(0, index),
                            Object.assign({}, _this.state.uploadFiles[index], {
                                percent: file.percent,
                                speed: file.speed
                            }),
                            ..._this.state.uploadFiles.slice(index + 1)
                        ],
                        isUploading: true
                    });
                },
                'FileUploaded': function (up, file, info) {
                    var domain = up.getOption('domain');
                    var res = eval('(' + info + ')');
                    var sourceLink = domain + "/" + res.key;
                    _this.props.addFeedBack(sourceLink);
                    _this.setState({
                        isUploading: false
                    });

                },
                'Error': function (up, file, info) {
                },
                'UploadComplete': function () {

                }
            }
        });
    };


    render(){
        return(
            <div>
                <Button bsStyle="success" onClick={this.open} disabled={this.state.isUploading}><i className="fa fa-upload"/>上传</Button>
                <Modal show={this.state.showModal} onHide={this.closeModal} dialogClassName="audio-picker">

                    <Modal.Header>
                        <Modal.Title>上传音频</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Tabs defaultActiveKey={1} activeKey={this.state.tabKey} onSelect={this.handleSelectTab}>
                            <Tab eventKey={1} title="本地音频">{this._renderUploadPanel()}</Tab>
                            <Tab eventKey={2} title="从URL插入">{this._renderUrlPanel()}</Tab>
                        </Tabs>
                    </Modal.Body>

                    <Modal.Footer>

                    </Modal.Footer>

                </Modal>

                {
                    typeof(this.state.uploadFiles) != "undefined" &&
                    this.state.uploadFiles.length != 0 &&
                    this.state.uploadFiles.map(file => {
                        return (
                            <FileUploadProgress
                                key={file.name}
                                name={file.name}
                                percent={file.percent}
                                speed={this.transformSize(file.speed)}
                                close={this.closeFileProgress}
                            />
                        )
                    })
                }

                {

                    ((this.state.url != "" && this.state.hasInputUrl) ||
                        (typeof(this.state.uploadFiles) == "undefined" || this.state.uploadFiles.length == 0)
                        && this.state.url!="") &&
                       <div style={{marginTop:"15px"}}>
                           <span style={{color:"#6a7989",fontWeight:"bold",fontSize:"0.9em"}}>音频地址：</span>
                           <a style={{fontSize:"15px"}}>{this.state.url}</a>
                       </div>
                }

            </div>

        )

    }

    _renderUploadPanel = () => {
        return (
            <div className="upload-panel">
                <div id="container">
                    <a id="pickAudio" className="btn btn-default">选择文件</a>
                </div>
            </div>
        )
    };

    _renderUrlPanel = () => {
        return (
            <div className="url-panel">
                <input
                    placeholder="http://"
                    className="form-control"
                    onChange={this.saveUrl}/>
                <button id="audio-confirm-btn" className="btn btn-success" style={{float:"right"}} onClick={this.uploadUrl}>
                    确定
                </button>
            </div>
        )
    }

}

