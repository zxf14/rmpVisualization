import React from 'react';

export default class Toggle extends React.Component {

    onChange = (event) => {
        this.props.onChange && this.props.onChange(!this.props.checked, event.target);
    };

    render() {
        return (

            <div className="switch">
                <label htmlFor={this.props.id}>
                    <input id={this.props.id} type="checkbox" onChange={this.onChange} checked={this.props.checked}/>
                    {this.props.label}
                    <div className="toggle-check"></div>
                </label>
            </div>

        )

    }

}