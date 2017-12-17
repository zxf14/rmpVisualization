import React from 'react';
import {connect} from 'react-redux';

class Toaster extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.visible) {
            $(".toaster-container").slideDown(300);
        } else {
            $(".toaster-container").slideUp(300);
        }
    }

    _mapTypeToClass = (type) => {
        switch(type) {
            case 1:
                return {
                    className: "success",
                    icon: "fa-check-circle-o"
                };
            case 2:
                return {
                    className: "error",
                    icon: "fa-close"
                };
            case 3:
                return {
                    className: "warning",
                    icon: "fa-exclamation"
                };
            default:
                return {
                    className: "",
                    icon: ""
                }
        }
    }

    render() {
        const type = this._mapTypeToClass(this.props.type);
        return (
            <div className="toaster-container">
                <p className={type.className}>
                    <i className={"fa " + type.icon} />
                    {this.props.content}
                </p>
            </div>
        )
    }

}

function mapStatetoProps(state) {
    const {
        visible,
        type,
        content
    } = state.toaster;
    return {
        visible,
        type,
        content
    };
}

export default connect(mapStatetoProps)(Toaster);
