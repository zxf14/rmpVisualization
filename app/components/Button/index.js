import React, { Component, PropTypes } from 'react';

export default class Button extends Component {

    render() {
        return (
            <button className="button" onClick={this.props.onClick} style={this.props.style} disabled={this.props.disabled}>
                {this.props.children}
            </button>
        )
    }

}