import React from 'react';
import {connect} from 'react-redux';
import fetch from 'isomorphic-fetch'
import MD5 from 'crypto-js/md5';
import {browserHistory} from 'react-router';

import {xinzhuToaster} from '../../components/Toaster/actions';
import xinzhuInfo from '../../components/Toaster/info';

const emailPattern = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");

class StudentLogin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: "",
            email: "",
            name: "",
            password: "",
            verifyCode: "",
            trueVeriCode: "",
            title: '学生考试支持平台注册',
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

    _sendVerifyCode = (e) => {
        e.preventDefault();
        if(!this.state.email || !emailPattern.test(this.state.email)){
            this.props.dispatch(xinzhuToaster({
                type:2,
                content: xinzhuInfo.verifyCode.wrongEmail
            }))
        }else{
            fetch(`/test/student/register/verify?studentMail=${this.state.email}`,{
                credentials:'include',
            }).then(res=>res.json()).then(json=>{
                if(!json.success){
                    this.props.dispatch(xinzhuToaster({
                        type: 2,
                        content: json.msg
                    }))
                } else {
                    this.props.dispatch(xinzhuToaster({
                        type:1,
                        content: xinzhuInfo.verifyCode.sendSuccess
                    }))
                    this.setState({
                        trueVeriCode: json.msg,
                    })
                }
            })


        }

    }

    _handleRegister = (e) => {
        e.preventDefault();
        if(this.state.verifyCode != this.state.trueVeriCode){
            this.props.dispatch(xinzhuToaster({
                type: 2,
                content: xinzhuInfo.auth.wrongVerifyCode
            }))
        }else{
            fetch(`/test/student/register?name=${this.state.name}&id=${this.state.id}&email=${this.state.email}&password=${this.state.password}`, {
                method: 'POST',
                credentials: 'include',
            }).then(response => response.json())
                .then(json => {
                    console.log(json);
                    if(!json.success) {
                        this.props.dispatch(xinzhuToaster({
                            type: 2,
                            content: xinzhuInfo.auth.registError
                        }));
                    } else {
                        this.props.dispatch(xinzhuToaster({
                            type: 1,
                            content: xinzhuInfo.auth.registSuccess
                        }))
                    }

                })
        }

    }

    _handleLogin = (e) => {
        e.preventDefault();
        browserHistory.push('/login');
        {/*fetch(`/test/student/login?username=${this.state.username}&password=${this.state.password}`, {*/}
            {/*method: 'POST',*/}
            {/*credentials: 'include'*/}
        {/*}).then(response => response.json())*/}
        //     .then(json => {
        //         if(!json.success) {
        //             this.props.dispatch(xinzhuToaster({
        //                 type: 2,
        //                 content: xinzhuInfo.auth.passwdError
        //             }));
        //         } else {
        //             this.props.dispatch(xinzhuToaster({
        //                 type: 1,
        //                 content: xinzhuInfo.auth.loginSuccess
        //             }));
        //             window.localStorage.userId = json.data.id;
        //             window.localStorage.appname = "学生考试支持平台注册";
        //             setTimeout(() => {
        //                 browserHistory.push('/');
        //             }, 1000);
        //         }
        //     });
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
                            <input type="text" className="form-control" placeholder="学号" autoComplete="off" value={this.state.id}
                                   onChange={(e) => this.setState({id: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="姓名" autoComplete="off" value={this.state.name}
                                   onChange={(e) => this.setState({name: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="邮箱" autoComplete="off" value={this.state.email}
                                   onChange={(e) => this.setState({email: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" placeholder="验证码" autoComplete="off" value={this.state.verifyCode}
                                   onChange={(e) => this.setState({verifyCode: e.target.value})}
                            />
                            <button onClick={this._sendVerifyCode}>发送验证码</button>
                        </div>
                        <div className="form-group">
                            <input name="password" className="form-control" type="text" placeholder="密码" autoComplete="off"
                                   value={this.state.password}
                                   onChange={(e) => this.setState({password: e.target.value})}
                            />
                        </div>
                        <button onClick={this._handleRegister}>注册</button>
                        <button onClick={this._handleLogin}>返回登录</button>
                    </form>
                </div>
            </div>
        )
    }
}

function mapStatetoProps(state) {
    return {};
}

export default connect(mapStatetoProps)(StudentLogin);