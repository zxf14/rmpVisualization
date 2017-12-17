import React from "react";

export default class TableHeaderColumn extends React.Component {

    toggle = (e) => {
        var $target = $(e.target).find(".fa");
        if ($target.is(".fa-sort-asc")) {
            $target.removeClass("fa-sort-asc").addClass("fa-sort-desc")
                .parent().siblings("th").find(".fa").removeClass("fa-sort-asc").removeClass("fa-sort-desc").addClass("fa-sort");
        } else {
            $target.removeClass("fa-sort-desc").addClass("fa-sort-asc")
                .parent().siblings("th").find(".fa").removeClass("fa-sort-asc").removeClass("fa-sort-desc").addClass("fa-sort");
        }
    };

    render = () => {
        return (
            <th
                className={this.props.className}
                data-sort={this.props.sort}
                width={this.props.width}
                onClick={this.toggle}>
                {this.props.children}
            </th>
        )
    }
}

