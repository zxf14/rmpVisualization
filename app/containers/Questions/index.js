import React from 'react';
import {connect} from 'react-redux';
import {xinzhuToaster} from '../../components/Toaster/actions';
import xinzhuInfo from '../../components/Toaster/info';
import {Link} from "react-router";
import {browserHistory} from 'react-router';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "../../components/Table";

import Input from '../../components/Input';
import Card from '../../components/Card';
import Button from '../../components/Button';

const QUESTION_TYPE = ["单选题", "多选题"]
const OPTION_TYPE = ["A", "B", "C", "D"]
class Questions extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            download:"",
            questionList:[]
        }
    }

    componentWillMount() {
        this.getQuestions();
        this.getDownloadLocation();
    }

    getDownloadLocation = ()=>{
        fetch(`/test/question/template`, {credentials: 'include'})
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
    };

    getQuestions = ()=>{
        let courseId = this.getCourseId();
        return fetch(`/test/question/list?courseId=${courseId}`, {credentials: 'include'})
        .then(response => response.json())
            .then(json => {
                if(!json.success) {
                    this.props.dispatch(xinzhuToaster({
                        type: 2,
                        content: json.msg
                    }));
                } else {
                    this.setState({
                        questionList: json.data.questions
                    });
                }
            });
    };

    uploadFile = () => {
        let file = this.refs.upload.files[0];
        if (file) {
            this.upload(file);
        }else{
            this.props.dispatch(xinzhuToaster({
                type: 2,
                content: "请上传文件"
            }));
        }  
    };

    getCourseId = () => {
        return this.props.params.courseId;
    };

    upload = (file) => {
        let formData = new FormData();
        formData.append('courseId', this.getCourseId());
        formData.append('file', file);
        let config = {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': '*/*',
            },
            credentials: 'include'
        };
        return fetch('/test/question/import', config).then(r => {
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
                            this.getQuestions();
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

    getOption=(optionVOList)=>{
        optionVOList.map((item, index) => OPTION_TYPE[index] + ". " + item.content).join("  ");
    };

    render() {
        
        return (
            <div>
                <Card title="试题列表导入">
                    <a href={this.state.download}>模版下载</a>
                    <input type="file" ref="upload" style={{margin: '20px 0'}}/>
                    <Button onClick={this.uploadFile}>上传</Button>
                </Card>
                { this.state.questionList.length === 0 && <h5>没有试题</h5>}
                {
                    this.state.questionList.length !== 0 &&
                    <Card>
                        <div>tip：红色标注为正确答案</div>
                        <Table id="questions" title="试题列表">
                            <TableHeader>
                                <TableRow header={true}>
                                    <TableHeaderColumn width="28%">题目</TableHeaderColumn>
                                    <TableHeaderColumn width="12%">类型</TableHeaderColumn>
                                    <TableHeaderColumn width="15%">选项A</TableHeaderColumn>
                                    <TableHeaderColumn width="15%">选项B</TableHeaderColumn>
                                    <TableHeaderColumn width="15%">选项C</TableHeaderColumn>
                                    <TableHeaderColumn width="15%">选项D</TableHeaderColumn>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    this.state.questionList.map(question => {
                                        return (
                                            <TableRow>
                                                <TableRowColumn><Link
                                                    to={`/question/${question.id}`}>{question.content}</Link></TableRowColumn>
                                                <TableRowColumn>{QUESTION_TYPE[question.type]}</TableRowColumn>
                                                {
                                                    question.optionVOList.map(item => {
                                                        return  <TableRowColumn className={item.isRight?"right-answer":""}>{item.content}</TableRowColumn>
                                                    })
                                                }
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>
                    </Card>
                }

            </div>
        )
    }

}

function mapStatetoProps(state) {
  
    return {
    };
}

export default connect(mapStatetoProps)(Questions);

