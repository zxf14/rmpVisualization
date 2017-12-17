import React from "react";

export default class TableHeader extends React.Component {

    _createTableRow = (base) => {
        return React.cloneElement(base, {});
    };

    render = () => {

        var _this = this;
        var tRow = React.Children.map(this.props.children, function(child) {
            return _this._createTableRow(child);
        })[0];

        return (
            <thead>
            {tRow}
            </thead>
        )
    }

}

