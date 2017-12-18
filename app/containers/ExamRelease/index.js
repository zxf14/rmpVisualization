import React from 'react';
import {connect} from 'react-redux';
import {xinzhuToaster} from '../../components/Toaster/actions';
import xinzhuInfo from '../../components/Toaster/info';
import {Link} from "react-router";
import {browserHistory} from 'react-router';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from '../../components/Table'
import {
    ControlLabel,
    FormControl,
    FormGroup,
    Dropdown,
    Whisper,
    Popover
} from "rsuite";
import Input from '../../components/Input';
import Card from '../../components/Card';
import Button from '../../components/Button';
import fetch from 'isomorphic-fetch'
import { QUIZ_INDEX } from '../../common/utils/constants'

class ExamRelease extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            questionList:[],
            scores:0,
            examTitle:"",
            examPlace:"",
            startTime:"",
            endTime:"",
            group:"-1",
            questionNum:0,
        }
    }

    componentWillMount() {
        this.getQuestions();
    }

    submit = () => {
        let data = {
            questionNum: this.state.questionNum,
            scores: this.state.scores,
            groupId: this.state.group,
            courseId: this.getCourseId(),
            questions: this.state.selected,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            title: this.state.examTitle,
            place: this.state.examPlace
        }
        let config = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include'
        };

        return fetch(`/test/exam/config/create`, config)
            .then(response => {
                if (response.status == 401) {
                    browserHistory.push("/login");
                } else {
                    response.json().then(json => {
                        if (json.success) {
                            this.props.dispatch(xinzhuToaster({
                                type: 1,
                                content: xinzhuInfo.operation.publishSuccess
                            }));
                            browserHistory.push(`/teacher/course/${this.props.params.courseId}/exam`);
                            // http://localhost:3009/teacher/course?id=7
                        } else {
                            this.props.dispatch(xinzhuToaster({
                                type: 2,
                                content: json.errorMes
                            }));
                        }
                    });
                }
            })
            .catch(error => console.log(error));

    };

    getCourseId = () => {
        return this.props.params.courseId;
    };

    getQuestions = ()=>{
        let courseId = this.getCourseId();
        return fetch(`/test/question/list?courseId=${courseId}`, {credentials: 'include'})
                .then(response => {
                    if (response.status == 401) {
                        browserHistory.push("/login");
                    } else {
                        response.json().then(json => {
                            if(!json.success) {
                                this.props.dispatch(xinzhuToaster({
                                    type: 2,
                                    content: json.msg
                                }));
                            } else {
                                this.setState({
                                    questionList: json.data.questions,
                                });
                            }
                        });
                    }
                }).catch(error => console.log(error));
    };

    render() {
        let info = this.state;

        return (
            <div className='flex-container'>
                <div style={{flexGrow: 1}}>
                    <FormGroup controlId='examTitle' value={info.examTitle}>
                        <ControlLabel>考试名</ControlLabel>
                        <FormControl type='text' value={info.examTitle}
                                     onChange={value => this.setState({examTitle:value})}/>
                    </FormGroup>
                    <FormGroup controlId='examPlace' value={info.examPlace}>
                        <ControlLabel>考试地点</ControlLabel>
                        <FormControl type='text' value={info.examPlace}
                                     onChange={value => this.setState({examPlace:value})}/>
                    </FormGroup>
                    <FormGroup controlId='startTime' value={info.startTime}>
                        <ControlLabel>开始时间（yyyy-mm-dd hh:mm:ss）</ControlLabel>
                        <FormControl type='text' value={info.startTime}
                                     onChange={value => this.setState({startTime:value})}/>
                    </FormGroup>
                    <FormGroup controlId='endTime' value={info.endTime}>
                        <ControlLabel>结束时间（yyyy-mm-dd hh:mm:ss）</ControlLabel>
                        <FormControl type='text' value={info.endTime}
                                     onChange={value => this.setState({endTime:value})}/>
                    </FormGroup>

                    <FormGroup controlId='questionNum' value={info.questionNum}>
                        <ControlLabel>考题数量（题库数量：{info.questionList ? info.questionList.length : '0'}）</ControlLabel>
                        <FormControl type='number' value={info.questionNum}
                                     onChange={value => this.setState({questionNum:value})}/>
                    </FormGroup>

                    <FormGroup controlId='scores' value={info.scores}>
                        <ControlLabel>考题分值</ControlLabel>
                        <FormControl type='number' value={info.scores}
                                     onChange={value => this.setState({scores:parseInt(value)})}/>
                    </FormGroup>

                    <div>
                        <label>考试学生</label>
                        <Dropdown style={{margin: '5px 15px 5px 5px'}}
                                  shape="default" key="third"
                                  onSelect={value => {
                                      this.setState({group:value})
                                  }}
                                  activeKey={this.state.group} select>
                            <Dropdown.Item eventKey="-1">请选择</Dropdown.Item>
                            {this.props.groups.map(item => {
                                return <Dropdown.Item
                                    eventKey={item.id}>{item.name}</Dropdown.Item>
                            })}
                        </Dropdown> 
                    </div>

                </div>
                <aside>
                    <Card title="发布">
                        <Button onClick={this.submit} disabled={false}>
                            发布
                        </Button>
                    </Card>
                </aside>

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

export default connect(mapStatetoProps)(ExamRelease);

