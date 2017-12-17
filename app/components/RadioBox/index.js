import React from 'react';

export default class RadioBox extends React.Component {

    render() {
        return (
            <div className="radio">
                <label htmlFor={this.props.id}>
                    <input type="radio" id={this.props.id} name={this.props.name} onChange={this.props.onChange} checked={this.props.checked}/>
                    {this.props.label}
                    <div className="radio-check"></div>
                </label>
            </div>
        )
    }

}