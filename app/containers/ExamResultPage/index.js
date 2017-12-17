import React from 'react';
import Card from '../../components/Card'
import { connect } from 'react-redux';
import {Link} from 'react-router';
import {xinzhuToaster} from '../../components/Toaster/actions';
import xinzhuInfo from '../../components/Toaster/info';
import { LOGIN_TYPE } from '../Login'
const QUIZ_INDEX = ['A', 'B', 'C', 'D']
const QUIZ_TYPE = ['单选题', '多选题']

class ExamResultPage extends React.Component {

	constructor(props){
        super(props);

        this.state={
            isFetching: true,
        	exam: {}
        }
    }

    componentWillMount() {
    	this.getExamInfo();
    }

    getStudentResult = (index, id)=> {
        let answers = this.state.exam.answers;
        if (answers){
            let arr = answers[index]?answers[index].content.split(" "):[];
            if(arr.includes(id+"")){
                return "(学生选择)"
            }
        }
    };

    getExamInfo = () => {
    	let studentId = this.props.params.studentId;
        let examId = this.props.params.examId;
        fetch(`/test/exam/getExam/?examId=${examId}&studentNo=${studentId}`, {credentials: 'include'})
        .then(response => {
                if(response.status == 401) {
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
                                exam: json.data.exam,
                                isFetching: false,
                            });
                        }
                    });
                }

            })
            .catch(error => console.log(error));
    };

    _isStudent = () =>{
        return window.localStorage.userType == LOGIN_TYPE.STUDENT
    }

    render(){
        if(this.state.isFetching){
            return null;
        }
    	let totalScore = 0;
    	if(this.state.exam.answers){
    		totalScore = this.state.exam.answers.length!=0 ? this.state.exam.answers.reduce((i,j)=>i.score+j.score):0;
    	}
        let answers = this.state.exam.answers;

    	console.log(this.state.exam);

    	const student = this.state.exam.studentVOS;

        return (
            <div style={{ width: '100%', padding: 30}}>
                {this._isStudent() &&
                    <Link to={`/student`}>返回考试列表</Link>
                }
                <div>
                    <div style={{fontSize: this._isStudent() ? '2em': '18px', textAlign:'center'}}>{this.state.exam.title}成绩</div>
                    <h4>姓名：{student.name}</h4>
                    <h4>学号：{student.studentNo}</h4>
                    <h4>邮箱：{student.mail}</h4>
                </div>
                {
                	this.state.exam.questions && this.state.exam.questions.map((question, index)=> {
                        let title = `${index+1}.(${this.state.exam.value[index]}分) ${QUIZ_TYPE[question.type]} 得分：${answers[index]?answers[index].score:0}` 
                		return (
                			<Card title={title}>
                				<div></div>
                				<p>{question.content}</p>
                                <div>
                                    {question.optionVOList && question.optionVOList.map((option,key) => {
                                        return (
                                            <div className={option.isRight?"right-answer":""}>
                                                {QUIZ_INDEX[key]}.{option.content}{option.isRight?"(正确)":""}{this.getStudentResult(index,option.id)}
                                            </div>
                                        )
                                    })}
                                </div>
                			</Card>
                		)
                	})
                }
            </div>
        )
    }
}

function mapStatetoProps(state, props) {

    return {

    };
}

export default connect(mapStatetoProps)(ExamResultPage);
