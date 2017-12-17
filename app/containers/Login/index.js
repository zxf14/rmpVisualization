import React from 'react';
import {connect} from 'react-redux';
import fetch from 'isomorphic-fetch'
import MD5 from 'crypto-js/md5';
import {browserHistory} from 'react-router';

import {xinzhuToaster} from '../../components/Toaster/actions';
import xinzhuInfo from '../../components/Toaster/info';

export const LOGIN_TYPE = {
    TEACHER: 0,
    STUDENT: 1,
};

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            title: '学生考试支持平台',
            type: LOGIN_TYPE.TEACHER, //老师
        }
    }

    componentWillMount() {
        var hostname = location.hostname;
    }

    componentDidMount() {
        $('input[name=password]').bind("focus", function () {
            $(this).attr("type", "password");
        });
    }

    _checkPanel = (e) => {
        e.preventDefault();
        this.setState({
            type: this.state.type === LOGIN_TYPE.TEACHER ? LOGIN_TYPE.STUDENT : LOGIN_TYPE.TEACHER, //1位学生， 0位老师
        })
    }

    _handleRegister = (e) => {
        e.preventDefault();

        browserHistory.push("/regist");
    }

    _handleLogin = (e) => {
        e.preventDefault();

        const url = `/test/${this.state.type === LOGIN_TYPE.TEACHER ? 'teacher' : 'student'}/login?${this.state.type === LOGIN_TYPE.TEACHER ? 'username' : 'id'}=${this.state.username}&password=${this.state.password}`;
        fetch(url, {
            method: 'POST',
            credentials: 'include'
        }).then(response => response.json())
            .then(json => {
                if(!json.success) {
                    this.props.dispatch(xinzhuToaster({
                        type: 2,
                        content: xinzhuInfo.auth.passwdError
                    }));
                } else {
                    this.props.dispatch(xinzhuToaster({
                        type: 1,
                        content: xinzhuInfo.auth.loginSuccess
                    }));
                    window.localStorage.userId = this.state.username;
                    window.localStorage.appname = "学生考试支持平台";

                    if(this.state.type === LOGIN_TYPE.STUDENT){
                        window.localStorage.studentNo = this.state.username;
                        localStorage.userType = "1";
                    }else{
                        localStorage.userType = "0";
                        window.localStorage.userId = json.data.id;
                    }
                    setTimeout(() => {
                        this.state.type === LOGIN_TYPE.TEACHER ?
                            browserHistory.push('/teacher')
                            :
                            browserHistory.push('/student')

                    }, 1000);
                }
            });
    };

    render() {
        return (
            <div className="x-auth-container">
                <div className="x-auth">
                    <div className="logo">
                        <h3 className="title">{this.state.title}</h3>
                    </div>
                    <form>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="用户名" autoComplete="off" value={this.state.username}
                                   onChange={(e) => this.setState({username: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <input name="password" className="form-control" type="text" placeholder="密码" autoComplete="off"
                                   value={this.state.password}
                                   onChange={(e) => this.setState({password: e.target.value})}
                            />
                        </div>
                        <button onClick={this._handleLogin}>登录</button>
                        {this.state.type === 1 && <button onClick={this._handleRegister}>注册</button>}
                        <button onClick={this._checkPanel}>{this.state.type===0 ? '学生版':'老师版'}</button>
                    </form>
                </div>
            </div>
        )
    }
}

function mapStatetoProps(state) {
    return {};
}

export default connect(mapStatetoProps)(Login);