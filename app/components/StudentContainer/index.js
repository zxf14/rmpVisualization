import React from 'react';
import { connect } from 'react-redux'
import Navbar from '../Navbar';
import { LOGIN_TYPE } from '../../containers/Login'

import {xinzhuToaster} from '../../components/Toaster/actions';
import xinzhuInfo from '../../components/Toaster/info';

class StudentContainer extends React.Component {
    constructor(props){
        super(props);
    }

    routerWillLeave(nextLocation) {
        if (!nextLocation.indexOf('teacher')>=0 && window.localStorage.userType == LOGIN_TYPE.STUDENT){
            return false;
        }
    }

    render(){
        if(window.localStorage.userType == LOGIN_TYPE.TEACHER){
            this.props.dispatch(xinzhuToaster({
                type:2,
                content: xinzhuInfo.auth.wrongAuth
            }))
            return null;
        }
        return (
            <div className="main-container">
                <Navbar
                    appname={window.localStorage.appname}
                    logo={window.localStorage.logo}
                />
                <div className="x-container" style={{minWidth: 800}}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default connect()(StudentContainer)