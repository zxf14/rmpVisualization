import React from 'react';
import {connect} from 'react-redux';
import {xinzhuToaster} from '../../components/Toaster/actions';
import {browserHistory} from 'react-router';
import Card from '../../components/Card';
import { QUIZ_TYPE } from '../../common/utils/constants'

const QUIZ_INDEX = ['A', 'B', 'C', 'D']
class ExamInfo extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            exam:{}
        }
    }

    componentWillMount() {
        this.getExamInfo();
    }

    getExamInfo = () => {
        let examId = this.props.params.examId;
        let studentId = this.props.params.studentId;
        fetch(`/test/exam/teacherCreate/?examId=${examId}&testeeId=${studentId}`, {credentials: 'include'})
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
                                exam: json.data.exam
                            });
                        }
                    });
                }

            })
            .catch(error => console.log(error));
    };


    render() {
        
        return (
            <div>
                <h4>考试名：{this.state.exam.title}</h4>
                {
                    this.state.exam.questions 
                    && 
                    this.state.exam.questions.map((question, index) => {
                        let title = `${index+1}.(${this.state.exam.value}分) ${QUIZ_TYPE[question.type]}`
                        return (
                            <Card title={title}>
                                <div></div>
                                <p>{question.content}</p>
                                <div>
                                    {question.optionVOList && question.optionVOList.map((option,key) => {
                                        return (
                                            <div className={option.isRight?"right-answer":""}>
                                                {QUIZ_INDEX[key]}.{option.content}{option.isRight?"(正确)":""}
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

export default connect(mapStatetoProps)(ExamInfo);

