import React from "react";

import TableHeaderColumn from "./tableHeaderColumn";
import TableRowColumn from "./tableRowColumn";

export default class TableRow extends React.Component {

    _createCheckBox = () => {
        var _this = this;

        var _isHeader = React.Children.toArray(_this.props.children)[0].type.name == "TableHeaderColumn";

        if (_isHeader) {
            return React.createElement(TableHeaderColumn, null,
                        React.createElement(CheckBox, null));
        }else {
            return React.createElement(TableRowColumn, null,
                        React.createElement(CheckBox, {id: _this.props.index, checked: _this.state.selected}));
        }
    };

    render = () => {
        var _this = this;
        return (
            <tr>
                {_this.props.children}
            </tr>
        );
    }
}
