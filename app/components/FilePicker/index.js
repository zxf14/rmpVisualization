/**
 * Created by lc on 2016/10/26.
 */

import React, {Component, PropTypes }  from 'react';
import {connect} from 'react-redux';
import {Modal, Tabs, Tab, Button} from "react-bootstrap";
import FileUploadProgress from '../FileUploadProgress';



export default class FilePicker extends Component{

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            domain: window.localStorage.pdfDomain,
            uploadFiles: this.props.initData || [],
            hasSelectFile: false,
            pdfHttpsDomain: window.localStorage.pdfDomain
        };
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
        this.props.removeFeedBack(this.state.pdfHttpsDomain + '/' + value);
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
            browse_button: 'pickPDF',
            uptoken_url: "/xinzhu/api/getPDFUpToken",
            get_new_token: false,
            domain: _this.state.domain,
            max_file_size: "100m",
            flash_swf_url: "/assets/lib/plupload/Moxie.swf",
            max_retries: 3,
            chunk_size: '4mb',
            auto_start: true,
            filters: {
                mime_types : [
                    {title : "PDF files", extensions: "pdf"},
                    {title : "Image files", extensions : "jpg,png"} // 限定jpg,gif,png后缀上传
                ]
            },
            init: {
                'FilesAdded': function (up, files) {
                    plupload.each(files, function (file, index) {

                        _this.setState({
                            uploadFiles: [..._this.state.uploadFiles, {
                                name: file.name,
                                percent: 0,
                                speed: ""
                            }],
                            showModal:false,
                            hasSelectFile: true
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
                        ]
                    });
                },
                'FileUploaded': function (up, file, info) {
                    // var domain = up.getOption('domain');
                    var res = eval('(' + info + ')');
                    var sourceLink = _this.state.pdfHttpsDomain + "/" + res.key;
                    _this.props.addFeedBack(sourceLink);

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
                <Button bsStyle="success" onClick={this.open}><i className="fa fa-upload"/>上传</Button>
                <Modal show={this.state.showModal} onHide={this.closeModal}>

                    <Modal.Header>
                    <Modal.Title>上传PDF</Modal.Title>
                </Modal.Header>

                    <Modal.Body>
                        <div className="upload-panel">
                            <div id="container">
                                <a id="pickPDF" className="btn btn-default">选择文件</a>
                            </div>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>

                    </Modal.Footer>

                </Modal>

                {
                    this.state.uploadFiles.length != 0 &&
                    this.state.uploadFiles.map(file => {
                        return (
                            <FileUploadProgress key={file.name}
                                                name={file.name}
                                                percent={file.percent}
                                                speed={this.transformSize(file.speed)}
                                                close={this.closeFileProgress}/>
                        )
                    })
                }
            </div>

        )

    }

}
