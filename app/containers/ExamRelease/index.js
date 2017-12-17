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
            selected:[],
            unSelected:[],
            scores:[],
            examTitle:"",
            examPlace:"",
            startTime:"",
            endTime:"",
            group:"",
        }
    }

    componentWillMount() {
        this.getQuestions();
    }

    remove_question = (index) => {
        let list = [...this.state.selected];
        list.splice(index, 1);
        this.setState({selected:list});
    };

    add_question = (index) => {
        let obj = this.state.questionList[index];
        obj.point = this.state.scores[index]||0;
        this.setState({
            selected: [...this.state.selected, obj],
        })
    };

    submit = () => {
        const submitScores = this.state.selected.map((v)=>{
            return v.point;
        })
        let data = {
            questionNum: this.state.selected.length,
            scores: submitScores,
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
                                let scores = json.data.questions.map(i=>0);
                                this.setState({
                                    questionList: json.data.questions,
                                    unSelected: json.data.questions,
                                    scores:scores,
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

                    <Table id="selected_questions" title="已选试题">
                        <TableHeader>
                            <TableRow header={true}>
                                <TableHeaderColumn width="40%">标题</TableHeaderColumn>
                                <TableHeaderColumn width="10%">正确答案</TableHeaderColumn>
                                <TableHeaderColumn width="15%">类型</TableHeaderColumn>
                                <TableHeaderColumn width="20%">分值</TableHeaderColumn>
                                <TableHeaderColumn width="15%">移除</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                            this.state.selected.map((question, index) => {
                                const rightAnswers = question.optionVOList.map((v,k)=>{
                                    if(v.isRight){
                                        return QUIZ_INDEX[k]
                                    }
                                });

                                const speaker = (
                                    <Popover>
                                        <p>{question.content}</p>
                                        {question.optionVOList.map((option, index)=>{
                                            return (
                                                <p className={option.isRight?"right-answer":""}>{QUIZ_INDEX[index]}.{option.content}</p>
                                            )
                                        })}
                                    </Popover>
                                );

                                return (
                                    <TableRow>
                                        <TableRowColumn>
                                            <Whisper placement="right" speaker={speaker}>
                                                <p>{question.content}</p>
                                            </Whisper>
                                        </TableRowColumn>
                                        <TableRowColumn>{rightAnswers}</TableRowColumn>
                                        <TableRowColumn>{question.type===0?'单选题':'多选题'}</TableRowColumn>
                                        <TableRowColumn>{question.point}</TableRowColumn>
                                        <TableRowColumn><span style={{'cursor': 'pointer'}} onClick={()=>this.remove_question(index)}>移除问题</span></TableRowColumn>
                                    </TableRow>
                                )
                            })
                            }
                        </TableBody>
                    </Table>

                    <br/>

                    <Table id="questions" title="待选试题">
                        <TableHeader>
                            <TableRow header={true}>
                                <TableHeaderColumn width="40%">题目</TableHeaderColumn>
                                <TableHeaderColumn width="10%">正确答案</TableHeaderColumn>
                                <TableHeaderColumn width="15%">类型</TableHeaderColumn>
                                <TableHeaderColumn width="20%">分值</TableHeaderColumn>
                                <TableHeaderColumn width="15%">添加</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                            this.state.unSelected.map((question, index) => {
                                const rightAnswers = question.optionVOList.map((v,k)=>{
                                    if(v.isRight){
                                        return QUIZ_INDEX[k]
                                    }
                                });
                                const speaker = (
                                    <Popover>
                                        <p>{question.content}</p>
                                        {question.optionVOList.map((option, index)=>{
                                            return (
                                                <p className={option.isRight?"right-answer":""}>{QUIZ_INDEX[index]}.{option.content}</p>
                                            )
                                        })}
                                    </Popover>
                                );
                                return (
                                    <TableRow>
                                        <TableRowColumn>
                                            <Whisper placement="right" speaker={speaker}>
                                                <p>{question.content}</p>
                                            </Whisper>
                                        </TableRowColumn>
                                        <TableRowColumn>{rightAnswers}</TableRowColumn>
                                        <TableRowColumn>{question.type===0?'单选题':'多选题'}</TableRowColumn>
                                        <TableRowColumn>
                                            <FormControl type='number' value={this.state.scores[index]||0}
                                            onChange={(value) => {
                                                let newScore = this.state.scores;
                                                newScore[index] = parseInt(value);
                                                this.setState({scores:newScore})}
                                            }/>
                                        </TableRowColumn>
                                        <TableRowColumn><span style={{'cursor': 'pointer'}} onClick={()=>this.add_question(index)}>添加</span></TableRowColumn>

                                    </TableRow>

                                    )
                                })
                            }
                        </TableBody>
                    </Table>
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

