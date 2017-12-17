import React from 'react';

export default class Input extends React.Component {


    _handleInput = (event) => {
        this.props.onChange && this.props.onChange(event.target.value, event.target);
        this.setState({value: event.target.value});
    };

    render() {
        return (
            <span className={"input input--ichiro " + (this.props.value!="" && "input--filled") }>
                <input className="input__field input__field--ichiro"
                       type={this.props.type?this.props.type:"text"} id={this.props.id}
                       onChange={this._handleInput}
                       value={this.props.value}
                />
                <label className="input__label input__label--ichiro" htmlFor={this.props.id}>
                    <span className="input__label-content input__label-content--ichiro">{this.props.placeholder}</span>
                </label>
            </span>
        )
    }

}