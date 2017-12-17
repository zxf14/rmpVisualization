import React from 'react';

export default class FileUploadProgress extends React.Component {

    close = (e) => {
        this.props.close(e.target.getAttribute('data-target'));
    };

    render() {
        return (
            <div className="file-progress-wrapper">
                <div className="progress-bar" style={{width: this.props.percent + "%"}}></div>
                <div className="progress-info">
                    <i className="icon fa fa-image"/>
                    <div className="text">
                        <p className="name">{this.props.name}</p>
                        {
                            this.props.percent != 100 &&
                            <p className="speed">{this.props.speed}/s</p>
                        }
                        {
                            this.props.percent == 100 &&
                            <p className="speed">上传完成</p>
                        }
                    </div>
                </div>
                {
                    this.props.percent == 100 &&
                    <button data-target={this.props.name}
                            className="close fa fa-close"
                            onClick={this.close}
                    />
                }
            </div>
        )
    }

}