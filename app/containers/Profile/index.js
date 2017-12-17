import React from 'react';
import {connect} from 'react-redux';

import { fetchProfile } from './actions';

class Profile extends React.Component {

    componentWillMount() {
        this.props.dispatch(fetchProfile());
    }

    render() {
        const {info} = this.props;
        return (
            <div>
                <h4 style={{margin: "0 0 30px"}}>APP信息</h4>

                <div className="x-info-table">
                    <table className="table">
                        <tbody>
                        <tr>
                            <td width="30%">名称</td>
                            <td width="70%">{info.appname}</td>
                        </tr>
                        <tr>
                            <td>logo</td>
                            <td><img
                                src={info.logo}
                                alt="logo" className="img-thumbnail"
                                style={{width: "128px", height: "128px"}}/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <h4 style={{margin: "30px 0"}}>个人信息</h4>

                <div className="x-info-table">
                    <table className="table">
                        <tbody>
                        <tr>
                            <td width="30%">手机号</td>
                            <td width="70%">{info.mobile || "未填写"}</td>
                        </tr>
                        <tr>
                            <td>密码</td>
                            <td>************</td>
                        </tr>
                        <tr>
                            <td>姓名</td>
                            <td>{info.realname || "未填写"}</td>
                        </tr>
                        <tr>
                            <td>联系地址</td>
                            <td>{info.location || "未填写"}</td>
                        </tr>
                        <tr>
                            <td>固定电话</td>
                            <td>{info.telephone || "未填写"}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <h4 style={{margin: "30px 0"}}>七牛云信息</h4>

                <div className="x-info-table">
                    <table className="table">
                        <tbody>
                        <tr>
                            <td width="30%">AccessKey</td>
                            <td width="70%">{info.accessKey || "未填写"}</td>
                        </tr>
                        <tr>
                            <td>SecretKey</td>
                            <td>{info.secretKey || "未填写"}</td>
                        </tr>
                        <tr>
                            <td>Domain</td>
                            <td>{info.imageDomain || "未填写"}</td>
                        </tr>
                        <tr>
                            <td>Bucket</td>
                            <td>{info.imageBucket || "未填写"}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>




        )
    }

}

function mapStatetoProps(state) {
    const {
        isFetching,
        info
    } = state.profile;

    return {
        isFetching,
        info
    };
}

export default connect(mapStatetoProps)(Profile);