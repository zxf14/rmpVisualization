import React from 'react';

export default class TextArea extends React.Component {

    _handleInput = (event) => {
        this.props.onChange && this.props.onChange(event.target.value);
        this.setState({value: event.target.value});
    };

    render () {
        return (
            <span className={"textarea  textarea--ichiro " + (this.props.value!="" && "textarea--filled") }>
                <textarea className="textarea__field textarea__field--ichiro"
                          id={this.props.id}
                          onChange={this._handleInput}
                          value={this.props.value}
                />
                <label className="textarea__label textarea__label--ichiro" htmlFor={this.props.id}>
                    <span className="textarea__label-content textarea__label-content--ichiro">{this.props.placeholder}</span>
                </label>
            </span>
        )
    }
}