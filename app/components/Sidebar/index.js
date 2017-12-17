import React from 'react';
import {Link} from "react-router";
import {xinzhuToaster} from '../../components/Toaster/actions';
import xinzhuInfo from '../../components/Toaster/info';
import fetch from 'isomorphic-fetch'
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import {
    getCourses,
    getGroups
} from './actions';

class Sidebar extends React.Component {

    constructor(props) {
        super(props);
        this.props.dispatch(getCourses());
        this.props.dispatch(getGroups());
    }

    componentDidMount() {
        $(".sidebar-menu>li>a").click(function (e) {

            var isCollapsed = $("body").is(".sidebar-collapse");

            var $parent = $(this).parent();
            if ($parent.is(".active")) {
                $parent.removeClass("active");
                if (!isCollapsed) {
                    $parent.find(".treeview-menu").slideUp(400);
                }
            } else {
                $parent.addClass("active");
                $parent.siblings("li").removeClass("active");
                if (!isCollapsed) {
                    $parent.find(".treeview-menu").slideDown(400);
                    $parent.siblings("li").find(".treeview-menu").slideUp(400);
                }
            }
            if ($(this).next().is(".treeview-menu")) {
                e.preventDefault();
            }
        });
    }


    render() {
        return (
            <div className="x-sidebar">
                <ul className="sidebar-menu">
                    <li className="header">MAIN NAVIGATION</li>
                    <li className="treeview">
                        <a href="#">
                            <i className="fa fa-paint-brush"/>
                            <span>课程</span>
                            <i className="fa fa-angle-left pull-right"/>
                        </a>
                        <ul className="treeview-menu">
                            {this.props.courses.map(item=>{
                                return <li><Link to={`/teacher/course/${item.id}/exam`}>{item.name}</Link></li>
                            })}
                        </ul>
                    </li>
                    <li className="treeview">
                        <Link to={`/teacher/groups`}>
                            <i className="fa fa-users"/>
                            <span>学生分类</span>
                            <i className="fa fa-angle-left pull-right"/>
                        </Link>
                        <ul className="treeview-menu">
                            {this.props.groups.map(item=>{
                                return <li><Link to={`/teacher/group/${item.id}`}>{item.name}</Link></li>
                            })}
                        </ul>
                    </li>
                </ul>
            </div>
        )
    }

}

function mapStatetoProps(state) {
    const {
        groups,
        courses
    } = state.sidebar;
    return {
        groups,
        courses
    };
}

export default connect(mapStatetoProps)(Sidebar);