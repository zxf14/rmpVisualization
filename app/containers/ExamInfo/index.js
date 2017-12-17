import React from 'react';
import {connect} from 'react-redux';
import {xinzhuToaster} from '../../components/Toaster/actions';
import xinzhuInfo from '../../components/Toaster/info';
import {Link} from "react-router";
import {browserHistory} from 'react-router';
import styles from './style.scss'
import Input from '../../components/Input';
import Card from '../../components/Card';
import Button from '../../components/Button';

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
        fetch(`/test/exam/teacherCreate/?examId=${examId}`, {credentials: 'include'})
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
                {
                    this.state.exam.questions 
                    && 
                    this.state.exam.questions.map((question, index) => {
                        return (
                            <Card style={{'margin': '10px'}}>
                                <div>{index+1}.{question.content}</div>
                                <div>
                                    {question.optionVOList.map((option,index) => {
                                        return (
                                            <div>
                                                {QUIZ_INDEX[index]}.{option.content}
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

function mapStatetoProps(state) {
  
    return {
    };
}

export default connect(mapStatetoProps)(ExamInfo);

