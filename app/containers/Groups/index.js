import React from 'react';
import {connect} from 'react-redux';
import {xinzhuToaster} from '../../components/Toaster/actions';
import xinzhuInfo from '../../components/Toaster/info';
import Clipboard from 'clipboard';
import {Link} from "react-router";
import {browserHistory} from 'react-router';
import {
    Checkbox,
    CheckboxList,
    Col,
    ControlLabel,
    FormControl,
    FormGroup,
    Radio,
    RadioList,
    Row,
    Dropdown
} from "rsuite";
import Input from '../../components/Input';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { getGroups } from '../../components/Sidebar/actions'

class Groups extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            download: "",
            groupName: ""
        }

    }

    componentWillMount() {
        this.getDownloadLocation();
    }

    uploadFile = () => {
        let file = this.refs.upload.files[0];
        if (this.state.groupName.trim()==""){
            this.props.dispatch(xinzhuToaster({
                type: 2,
                content: "填写组名"
            }));
            return;
        }
        if (file) {
            this.upload(file);
        }else{
            this.props.dispatch(xinzhuToaster({
                type: 2,
                content: "请上传文件"
            }));
        }  
    };

    upload = (file) => {
        let formData = new FormData();
        formData.append('groupName', this.state.groupName);
        formData.append('file', file);
        let config = {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': '*/*',
            },
            credentials: 'include'
        };
        return fetch('/test/group/import', config).then(r => {
                if (r.status != 200) {
                    this.props.dispatch(xinzhuToaster({
                        type: 2,
                        content: xinzhuInfo.auth.unauth
                    }));
                    browserHistory.push("/login");
                } else {
                    r.json().then(json => {
                        if (json.success) {
                            this.props.dispatch(xinzhuToaster({
                                type: 1,
                                content: "上传成功"
                            }));
                            this.props.dispatch(getGroups())
                        } else {
                            this.props.dispatch(xinzhuToaster({
                                type: 2,
                                content: json.errorMes
                            }));
                        }
                    });
                }
            })
    
    };

    getDownloadLocation = ()=>{
        fetch(`/test/group/template`, {credentials: 'include'})
        .then(response => response.json())
            .then(json => {
                if(!json.success) {
                    this.props.dispatch(xinzhuToaster({
                        type: 2,
                        content: json.msg
                    }));
                    browserHistory.push('/login');
                } else {
                    this.setState({
                        download: "//localhost:8080"+json.data.template
                    });
                }
            });
    }

    render() {
        return (
            <div>
                <Card title="学生列表导入模版">
                    <a href={this.state.download}>下载</a>
                </Card>
                <Card title="学生列表导入">
                    <FormGroup controlId='groupName' value={this.state.groupName}>
                        <ControlLabel>组名</ControlLabel>
                        <FormControl type='text' value={this.state.groupName}
                                     onChange={value => this.setState({groupName:value})}/>
                    </FormGroup>
                    <input type="file" ref="upload" style={{margin: '0 0 20px 0'}}/>
                    <Button onClick={this.uploadFile}>上传</Button>
                </Card>
            </div>
        )
    }

}

function mapStatetoProps(state) {
    const {
        groups,
    } = state.sidebar;

    return {
        groups
    };
}

export default connect(mapStatetoProps)(Groups);

