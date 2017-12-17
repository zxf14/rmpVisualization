import React from 'react';
import { connect } from 'react-redux';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import { LOGIN_TYPE } from '../../containers/Login';

import {xinzhuToaster} from '../../components/Toaster/actions';
import xinzhuInfo from '../../components/Toaster/info';

class MainContainer extends React.Component {
    constructor(props){
        super(props);
    }

    routerWillLeave(nextLocation) {
        if (!nextLocation.indexOf('student')>=0 && window.localStorage.userType == LOGIN_TYPE.TEACHER){
            return false;
        }
    }


    render() {
        if(window.localStorage.userType == LOGIN_TYPE.STUDENT){
            this.props.dispatch(xinzhuToaster({
                type: 2,
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
                <div className="x-container">
                    <Sidebar />
                    <div className="x-page-container">
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}

export default connect()(MainContainer)