import React from "react";

export default class TableRowColumn extends React.Component {

    render = () => {

        return (
            <td className={this.props.className}>
                {this.props.children}
            </td>
        )
    }

}

