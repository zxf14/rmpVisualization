import React, { Component } from 'react';

import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default class FoldMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newMenuValue: "",
            selectedMenuId: 0,
            selectedMenuValue: ""
        }
    }

    toggleFold = () => {
        const $subMenu = $(this.refs.subMenu);
        if ($subMenu.is(":visible")) {
            $subMenu.hide(400);
        } else {
            $subMenu.show(400);
        }
    };

    addMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({newMenuValue: ""});
        const $newMenu = $(this.refs.newMenu);
        const $subMenu = $(this.refs.subMenu);
        if ($subMenu.is(":visible")) {
            if (!$newMenu.is(":visible")) {
                $newMenu.show(200);
            }
        } else {
            $newMenu.show();
            $subMenu.show(400);
        }
    };

    confirmAddMenu = (e) => {
        e.preventDefault();
        this.props.onAddMenu(this.state.newMenuValue);
        $(this.refs.newMenu).hide(200);
    };

    cancelAddMenu = (e) => {
        e.preventDefault();
        this.setState({newMenuValue: ""});
        $(this.refs.newMenu).hide(200);
    };

    handleNewMenuInput = (e) => {
        this.setState({newMenuValue: e.target.value});
    };

    updateMenu = (e) => {
        e.preventDefault();
        this.setState({selectedMenuValue: $(e.target).parent().siblings('.name').text()});
        this.setState({selectedMenuId: $(e.target).parent().parent().attr("id")});
        $(e.target).parent().hide()
            .next().show()
            .siblings("input").show()
            .siblings(".name").hide();
    };

    confirmUpdateMenu = (e) => {
        e.preventDefault();
        this.props.onUpdateMenu(this.state.selectedMenuId, this.state.selectedMenuValue);
        $(e.target).parent().hide()
            .prev().show()
            .siblings("input").hide()
            .siblings(".name").show()
    };

    cancelUpdateMenu = (e) => {
        e.preventDefault();
        $(e.target).parent().hide()
            .prev().show()
            .siblings("input").hide()
            .siblings(".name").show();
    };

    handleUpdateMenuInput = (e) => {
        this.setState({selectedMenuValue: e.target.value});
    };

    deleteMenu = (e) => {
        e.preventDefault();
        this.props.onDeleteMenu($(e.target).parent().parent().attr("id"));
    };

    render() {
        return (
            <ul className="fold-menu">
                <li className="treeview" onClick={this.toggleFold}>
                    <span className="name">{this.props.name}</span>
                    <div className="action">
                        <OverlayTrigger placement="top" overlay={<Tooltip id={Math.random()}>添加分类</Tooltip>}>
                            <a href="#" className="fa fa-plus" onClick={this.addMenu}/>
                        </OverlayTrigger>
                    </div>
                </li>
                <ul className="treeview-menu" ref="subMenu">
                    <li ref="newMenu">
                        <input type="text" value={this.state.newMenuValue} onChange={this.handleNewMenuInput}/>
                        <div className="action">
                            <OverlayTrigger placement="top" overlay={<Tooltip id={Math.random()}>添加</Tooltip>}>
                                <a href="#" className="fa fa-check" onClick={this.confirmAddMenu}/>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={<Tooltip id={Math.random()}>取消</Tooltip>}>
                                <a href="#" className="fa fa-close" onClick={this.cancelAddMenu}/>
                            </OverlayTrigger>
                        </div>
                    </li>
                    {this.props.subMenu.map((item) =>
                        <li key={item.id} id={item.id}>
                            <span className="name">{item.name}</span>
                            <input type="text" value={this.state.selectedMenuValue}
                                   onChange={this.handleUpdateMenuInput}/>
                            <div className="action">
                                <OverlayTrigger placement="top" overlay={<Tooltip id={Math.random()}>修改</Tooltip>}>
                                    <a href="#" className="fa fa-edit" onClick={this.updateMenu}/>
                                </OverlayTrigger>
                                <OverlayTrigger placement="top" overlay={<Tooltip id={Math.random()}>删除</Tooltip>}>
                                    <a href="#" className="fa fa-trash" onClick={this.deleteMenu}/>
                                </OverlayTrigger>
                            </div>
                            <div className="action" style={{display: "none"}}>
                                <OverlayTrigger placement="top" overlay={<Tooltip id={Math.random()}>确定</Tooltip>}>
                                    <a href="#" className="fa fa-check" onClick={this.confirmUpdateMenu}/>
                                </OverlayTrigger>
                                <OverlayTrigger placement="top" overlay={<Tooltip id={Math.random()}>取消</Tooltip>}>
                                    <a href="#" className="fa fa-close" onClick={this.cancelUpdateMenu}/>
                                </OverlayTrigger>
                            </div>
                        </li>
                    )}
                </ul>
            </ul>
        )
    }
}