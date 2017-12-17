import React from 'react';
import fetch from 'isomorphic-fetch'
import { connect } from 'react-redux';
import { browserHistory } from 'react-router'
import Card from '../../components/Card'
import { QUIZ_INDEX, QUIZ_TYPE } from '../../common/utils/constants'

import {xinzhuToaster} from '../../components/Toaster/actions';
import xinzhuInfo from '../../components/Toaster/info';

class ExamPaperList extends React.Component {
    constructor(props){
        super(props);
        this.state={
            paperList:[],
        }
    }

    componentWillMount(){
        fetch(`/test/exam/getExamList?examId=${this.props.params.examId}`,{credentials:'include'})
            .then(response => {
                if(response.code == 401){
                    browserHistory.push('/login')
                } else {
                    response.json().then(json=>{
                        if(!json.success){
                            this.props.dispatch(xinzhuToaster({
                                type: 2,
                                content: json.msg
                            }))
                        } else {
                            this.setState({
                                paperList: json.data.exam,
                            })
                        }
                    })
                }
            });
    }

    getStudentResult = (examIndex, questionIndex, id)=> {
        let answers = this.state.paperList[examIndex].answers;
        if (answers){
            let arr = answers[questionIndex]?answers[questionIndex].content.split(" "):[];
            if(arr.includes(id+"")){
                return "(学生选择)"
            }
        }
    };

    render(){
        return (
             <div className="flex-container">
                 <div style={{flexGrow: 1, marginRight: 200}}>
                     {this.state.paperList.map((v,k)=>{
                         const student = v.studentVOS;
                         let title = student.name+' '+student.studentNo+' '+student.mail;
                         return (
                             <div id={`paper-${student.studentNo}`}>
                             <Card title={title}>
                                 {v.questions && v.questions.map((question,index)=>{
                                     let title = `${index+1}.(${v.value[index]}分) ${QUIZ_TYPE[question.type]} 得分：${v.answers[index]?v.answers[index].score:0}`
                                     return (
                                         <Card title={title}>
                                             <div></div>
                                             <p>{question.content}</p>
                                             <div>
                                                 {question.optionVOList && question.optionVOList.map((option,key) => {
                                                     return (
                                                         <div className={option.isRight?"right-answer":""}>
                                                             {QUIZ_INDEX[key]}.{option.content}{option.isRight?"(正确)":""}{this.getStudentResult(k,index,option.id)}
                                                         </div>
                                                     )
                                                 })}
                                             </div>
                                         </Card>
                                     )
                                 })}
                             </Card>
                             </div>
                         )
                     })}
                 </div>
                 <aside style={{position:'fixed', right:0}}>
                     <ul>
                         {this.state.paperList.map((v,k) => {
                             const student = v.studentVOS;
                             return (
                                 <li><a href={`#paper-${student.studentNo}`}>{student.name} {student.studentNo}</a></li>
                             )
                         })}
                     </ul>
                 </aside>
             </div>
        )
    }
}

export default connect()(ExamPaperList)