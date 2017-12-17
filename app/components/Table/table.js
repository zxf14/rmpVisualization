import React from "react";

export default class Table extends React.Component {

    constructor(props) {
        super(props);
    }

    _createTableHeader = (base) => {
        return React.cloneElement(base, {});
    };

    _createTableBody = (base) => {
        return React.cloneElement(base, {});
    };

    render() {
        var _this = this;

        var tHeader = undefined;
        var tBody = undefined;

        React.Children.forEach(this.props.children, function (child) {
            var displayName = child.type.name;
            if (displayName == 'TableHeader') {
                tHeader = _this._createTableHeader(child);
            } else {
                tBody = _this._createTableBody(child);
            }
        });

        return (
            <div id={this.props.id} className="table-container">
                <div className="table-container-header">
                    <h4>{this.props.title}</h4>
                </div>
                <table className="table">
                    {tHeader}
                    {tBody}
                </table>
                <div className="table-container-footer">
                    {
                        this.props.dataCounts &&
                        <p>共有<span>{this.props.dataCounts}</span>条数据</p>
                    }
                    {
                        this.props.allCounts &&
                        <p>总学习次数：<span>{this.props.allCounts}</span></p>
                    }
                    {
                        this.props.userCount &&
                        <p>登录用户学习次数：<span>{this.props.userCount}</span></p>
                    }
                    {
                        this.props.allCounts && this.props.userCount &&
                        <p>未登录用户学习次数：<span>{this.props.allCounts - this.props.userCount}</span></p>
                    }
                    {
                        this.props.formatTime &&
                        <p>总学习时长：<span>{this.props.formatTime}</span></p>
                    }
                </div>
            </div>
        );
    }
}
