import React from 'react';

import {is} from 'immutable';

import TinyMCE from 'react-tinymce';
import ImagePicker from '../ImagePicker';

export default class Editor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: Date.now().toString(),
            showModal: false,
            imgSelected: false,
            url: ""
        }
    }

    open = () => {
        this.setState({showModal: true, url: "", imgSelected: false});
    };

    closeModal = () => {
        this.setState({showModal: false});
    };

    imgPickerFeedBack = (value) => {
        this.setState({showModal: false, url: value, imgSelected: true});
    };

    handleEditorChange = (e) => {
        this.props.onChange(e.target.getContent());
    };

    render() {
        var _this = this;
        return (
            <div className="x-editor">
                <TinyMCE
                    id={this.props.id || this.state.id}
                    content={this.props.content}
                    config={{
                    theme: "modern",
                    skin: 'light',
                    plugins: [
                        'advlist autolink lists link image charmap hr anchor',
                        'searchreplace visualblocks visualchars code fullscreen autoresize',
                        'insertdatetime save table contextmenu directionality imagetools',
                        'emoticons paste textcolor colorpicker textpattern'
                     ],
                     toolbar: 'styleselect | bold italic | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | link myButton fullscreen ',
                     autoresize_bottom_margin: 50,
                     autoresize_overflow_padding: 10,
                     autoresize_on_init: false,
                     autoresize_min_height: this.props.height || 400,
                     /*mySetup: function(editor) {
                        editor.addButton('myButton', {
                            icon: "image",
                            tooltip: "Insert/edit image",
                            onclick: function() {
                                _this.open();
                                var timer = setInterval(function(){
                                    if(!_this.state.showModal) {
                                        if(_this.state.imgSelected) {
                                            editor.insertContent(`<p><img src=${_this.state.url} alt="image" width="400"/></p>`);
                                        }
                                        clearInterval(timer);
                                    }
                                }, 500);
                            }
                        });
                     }*/
                    }}
                    onChange={this.handleEditorChange}
                />
                <ImagePicker
                    showModal={this.state.showModal}
                    closeModal={this.closeModal}
                    feedBack={this.imgPickerFeedBack}
                />
            </div>
        )
    }
}
