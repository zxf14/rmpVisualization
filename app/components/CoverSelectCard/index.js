import React from "react";
import Card from "../Card";
import ImagePicker from '../ImagePicker';

export default class ImageSelectCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        };
    }

    open = () => {
        this.setState({showModal: true});
    };

    closeModal = () => {
        this.setState({showModal: false});
    };

    imgPickerFeedBack = (value) => {
        this.props.onChange && this.props.onChange(value);
    };

    handleBrokenImage = (e) => {};

    render = () => (
        <Card title={this.props.title}>
            <div className="cover" onClick={this.open}>
                <img src={this.props.src} onError={this.handleBrokenImage}/>
                <div className="upload">
                    <button><i className="fa fa-upload"/></button>
                </div>
            </div>
            <ImagePicker
                showModal={this.state.showModal}
                closeModal={this.closeModal}
                feedBack={this.imgPickerFeedBack}
            />
        </Card>
    );

}
