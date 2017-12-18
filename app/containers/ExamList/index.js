import React from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router'
import { Modal } from 'rsuite';
import Button from '../../components/Button'
import styles from './style.scss'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from '../../components/Table'
import { EXAM_STATE } from '../../common/utils/constants';
import { LOGIN_TYPE } from '../Login';
import { fetchStudentExamList, fetchUserExamList } from './actions'

import {xinzhuToaster} from '../../components/Toaster/actions';
import xinzhuInfo from '../../components/Toaster/info';
import { formatTime } from '../../common/utils/utils'

class ExamList extends React.Component {
    constructor(props){
        super(props);

        this.state={
            showJoinExamModal: false,
            clickedExamId: '',
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.params.courseId!=this.props.params.courseId)
        this.loadData(nextProps.params.courseId);
    }

    componentWillMount(){
        this.loadData();
    }

    loadData=(courseId)=>{
        const isStudent = this.isStudent();
        if(isStudent){
            console.log(window.localStorage.studentNo)
            this.props.dispatch(fetchStudentExamList(window.localStorage.studentNo));
        }else{
            console.log(courseId||this.getCourseId())
            this.props.dispatch(fetchUserExamList(courseId||this.getCourseId()));
        }
    };

    isStudent = () => {
        return window.localStorage.userType != LOGIN_TYPE.TEACHER;
    };

    mapTimeToDate = (time) => {
        const date = new Date(time);
        return date.getFullYear() + "-" + this.format(date.getMonth() + 1) + "-" + this.format(date.getDate()) + " " +
            this.format(date.getHours()) + ":" + this.format(date.getMinutes()) + ":" + this.format(date.getSeconds())
    };

    getCourseId = () => {
        return this.props.params.courseId;
    };

    millisecondToDate(msd) {
        let time = parseFloat(msd) / 1000;
        if (null != time && "" != time) {
            if (time > 60 && time < 60 * 60) {
                time = parseInt(time / 60.0) + "分钟"
                    // + parseInt((parseFloat(time / 60.0) -
                    //     parseInt(time / 60.0)) * 60) + "秒";
            }
            else if (time >= 60 * 60) {
                time = parseInt(time / 3600.0) + "小时" + parseInt((parseFloat(time / 3600.0) -
                        parseInt(time / 3600.0)) * 60) + "分钟"
                    // parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                    //     parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
            }
            else {
                time = parseInt(time) + "秒";
            }
        }
        return time;
    }

    _handleJoinExam(){
        const password = this.input.value;
        const exams = this.props.items;
        let testeeId = '';
        for(let i = 0; i < exams.length; i++){
            const e = exams[i];
            if(e.id == this.state.clickedExamId){
                testeeId = e.exam_testee.testeeId;
                break;
            }
        }
        if(!testeeId){
            this.props.dispatch(xinzhuToaster({
                type: 2,
                content: '网络错误',
            }))
            return;
        }
        // fetch 操作查看密码是否正确
        console.log(this.state);
        fetch(`/test/exam/attendExam?testeeId=${testeeId}&password=${password}`, {
            credentials: 'include'
        }).then(res=>res.json()).then(json=>{
            if(!json.success){
                this.props.dispatch(xinzhuToaster({
                    type: 2,
                    content: json.msg
                }))
            }else{
                if(!json.data.validation){
                    this.props.dispatch(xinzhuToaster({
                        type: 2,
                        content: xinzhuInfo.exam.wrongExamPassword,
                    }))
                }else{
                    this.props.dispatch(xinzhuToaster({
                        type: 1,
                        content: xinzhuInfo.exam.joinExamSuccess
                    }));
                    this._handleCancel()
                    console.log(this.props.location,this.state)
                    browserHistory.push(`${this.props.location.pathname}/exam/${this.state.clickedExamId}/${this.props.location.search}`)
                }

            }
        })

        // this._handleCancel()
        // browserHistory.push(`${this.props.location.pathname}/exam/${this.state.clickedExamId}/${location.search}`)

    }

    _handleCancel(){
        this.setState({
            showJoinExamModal: false,

        })
    }

    format = (value) => {
        return (value < 10 ? "0" : "") + value;
    };

    getState(state){
        switch (state){
            case EXAM_STATE.NOT_START:
                return '未开始';
            case EXAM_STATE.ONGOING:
                return '进行中';
            case EXAM_STATE.FINISHED:
                return '已结束';
            case EXAM_STATE.SUBMITED:
                return '已提交';
            default:
                return state;
        }
    }

    renderOptions(state, id){
        const isStudent = this.isStudent();
        switch(state){
            case EXAM_STATE.NOT_START:
                return isStudent ?
                    null
                    :
                    <Link to={`/teacher/course/${this.props.params.courseId}/scoreList/${id}/?type=1`}>查看试卷</Link>;
            case EXAM_STATE.ONGOING:
                return isStudent ?
                    <a
                        style={{cursor: 'pointer'}}
                        onClick={() => this.setState({
                            showJoinExamModal: true,
                            clickedExamId: id,
                        })}
                    >
                        参加考试
                    </a>
                    :
                    <Link to={`/teacher/course/${this.props.params.courseId}/scoreList/${id}/?type=1`}>查看试卷</Link>;
            case EXAM_STATE.FINISHED:
                return isStudent ?
                        <Link to={`/student/result/${id}/${localStorage.studentNo}/${location.search}`}>查看成绩</Link>
                        :
                        <Link to={`/teacher/course/${this.props.params.courseId}/scoreList/${id}/${location.search}`}>查看成绩</Link>;
            case EXAM_STATE.SUBMITED:
                return <span>已提交</span>
            default:
                return null;
        }
    }

    render(){
        const _this = this;
        return (
            <div style={{width:'100%', padding:30}}>
                <Table
                    id="studentExamList"
                    title="我的考试"
                    dataCounts={this.props.items.length}
                >
                    <TableHeader>
                        <TableRow header={true}>
                            <TableHeaderColumn width="20%">考试名称</TableHeaderColumn>
                            <TableHeaderColumn width="20%">开始时间</TableHeaderColumn>
                            <TableHeaderColumn width="10%">时长</TableHeaderColumn>
                            <TableHeaderColumn width="20%">地点</TableHeaderColumn>
                            <TableHeaderColumn width="10%">状态</TableHeaderColumn>
                            <TableHeaderColumn width="20%">操作</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            this.props.items &&
                            this.props.items.map(exam => {
                                return (
                                    <TableRow key={exam.id} index={exam.id}>
                                        <TableRowColumn>{exam.name||exam.title}</TableRowColumn>
                                        <TableRowColumn>{_this.mapTimeToDate(exam.startTime)}</TableRowColumn>
                                        <TableRowColumn>{this.millisecondToDate(exam.between)}</TableRowColumn>
                                        <TableRowColumn>{exam.place}</TableRowColumn>
                                        <TableRowColumn>{this.getState(exam.state)}</TableRowColumn>
                                        <TableRowColumn>{this.renderOptions(exam.state, exam.id)}</TableRowColumn>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>


                <Modal
                    autoResizeHeight={false}
                    show={this.state.showJoinExamModal}
                    onHide={()=>this.setState({ showJoinExamModal: false })}
                >
                    <Modal.Header>
                        <Modal.Title>参加考试</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input ref={(el)=>this.input=el} type="text" className="form-control" placeholder="考试密码" autoComplete="off"/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this._handleJoinExam.bind(this)} style={{marginRight:10}}>确认</Button>
                        <Button onClick={this._handleCancel.bind(this)}>取消</Button>
                    </Modal.Footer>
                </Modal>


            </div>
        )
    }
}

function mapStateToProps(state){
    const {
        isFetching,
        items,
    } = state.examList;

    return {
        isFetching,
        items,
    }
}

export default connect(mapStateToProps)(ExamList)
