import React from "react";

export default class TableBody extends React.Component {

    _createTableRow = (base) => {
        return React.cloneElement(base , {});
    };

    render = () => {

        var _this = this;

        var tRows = React.Children.map(this.props.children, function(child) {
           return _this._createTableRow(child);
        });

        return (
            <tbody className="list">
            {tRows}
            </tbody>
        )
    }

}

