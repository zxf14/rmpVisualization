import React from 'react';

export default class SearchInput extends React.Component {


    _handleInput = (event) => {
        this.props.onChange && this.props.onChange(event.target.value);
        this.setState({value: event.target.value});
    };

    render() {
        return (
            <span className="search-input">
                <label htmlFor={this.props.id}>
                    <span className="search_input_tips">{this.props.placeholder}</span>
                </label>
                <input className="input_search"
                       type={"text"} id={this.props.id}
                       onChange={this._handleInput}
                       value={this.props.value}
                />
            </span>
        )
    }

}