import React from 'react';
import { connect } from 'react-redux'
import fetch from 'isomorphic-fetch'
import {Link, browserHistory} from 'react-router';
import { Popover, Whisper } from 'rsuite';
import Button from '../Button';
import Input from '../Input';
import { getCourses } from '../Sidebar/actions'

import { LOGIN_TYPE } from '../../containers/Login'

import {xinzhuToaster} from '../../components/Toaster/actions';
import xinzhuInfo from '../../components/Toaster/info';

class Navbar extends React.Component {

    state = {
        courseName: '',
    }

    constructor(props){
        super(props);
    }

    componentDidMount() {
        $(".sidebar-toggle").click(function (e) {
            e.preventDefault();
            $(".main-container").toggleClass("sidebar-collapse ");
        });
    }

    _handleAddCourse = () => {
        const that = this;
        fetch(`/test/course/create?courseName=${this.state.courseName}`, {
            credentials:'include',
            method:'POST',
        }).then(res => res.json()).then(json => {
            if(!json.success){
                that.props.dispatch(xinzhuToaster({
                    type: 2,
                    content: "失败"
                }))
            }else{
                that.props.dispatch(xinzhuToaster({
                    type: 1,
                    content: xinzhuInfo.operation.addSuccess
                }))
                that.props.dispatch(getCourses())
            }

        })
    }

    _handleLogout = (e) => {
        e.preventDefault();
        // fetch(`/xinzhu/api/logout`, {credentials: 'include'})
        //     .then(response => browserHistory.push("/login"));

        browserHistory.push("/login")
    };

    render() {

        const addCourse=(
            <Popover title="添加课程">
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="课程名" autoComplete="off" value={this.state.username}
                           onChange={(e) => this.setState({courseName: e.target.value})}
                    />
                </div>
                <Button onClick={this._handleAddCourse.bind(this)}>确认添加</Button>
            </Popover>
        )

        return (
            <div className="x-navbar">
                <Link className="logo" to={`${window.localStorage.userType == 0?'/teacher':'/student'}`}>
                    {/* mini logo for sidebar mini 50x50 pixels */}
                    <span className="logo-mini"><img src={this.props.logo || ""} alt="logo"
                                                     className="img-rounded"/></span>
                    {/* logo for regular state and mobile devices */}
                    <span className="logo-lg"><img src={this.props.logo || ""} alt="logo"
                                                   className="img-rounded"/>{this.props.appname || ""}</span>
                </Link>

                <nav>
                    <div>
                        <a href="#" className="sidebar-toggle fa fa-bars" data-toggle="offcanvas" role="button"/>
                    </div>

                    <ul className="navbar-menu">
                        {window.localStorage.userType == LOGIN_TYPE.TEACHER ?
                            <li>
                                <Whisper placement="bottom" trigger="click" speaker={addCourse}>
                                    <a href="#" data-toggle="add-course">
                                        <i className="fa fa-plus" aria-hidden="true"/>
                                    </a>
                                </Whisper>
                            </li>
                            :
                            null
                        }
                        <li>
                            <a href="#" data-toggle="control-sidebar" onClick={this._handleLogout}>
                                <i className="fa fa-sign-out"/>
                            </a>
                        </li>
                    </ul>
                </nav>


            </div>
        )
    }

}

export default connect()(Navbar);