import React from 'react';

export default class RadioGroup extends React.Component {

    _createRadioBox = (base) => {
        return React.cloneElement(base , {name: this.props.name});
    };

    render() {
        return (
            <div>
                {React.Children.map(this.props.children, child => this._createRadioBox(child))}
            </div>
        )
    }

}
