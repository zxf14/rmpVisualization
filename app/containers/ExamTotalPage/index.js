import React from 'react';
import fetch from 'isomorphic-fetch';
import { connect } from 'react-redux';
import {browserHistory} from 'react-router';
import styles from './style.scss'

import Button from '../../components/Button'
import RadioBox from '../../components/RadioBox'

import Card from '../../components/Card';
import { QUESTION_TYPE } from '../../common/utils/constants'

import {xinzhuToaster} from '../../components/Toaster/actions';
import xinzhuInfo from '../../components/Toaster/info';


const PAGE_TYPE = {
    TOTAL: 0,
    SINGLE: 1,
}

const OPTION_KEY = ['A','B','C','D']

class ExamTotalPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            pageType:  PAGE_TYPE.TOTAL,
            chooseQuestionKey: null,
            isFetching: false,
            title: '',
            startTime: new Date(),
            between: 0, //2小时
            remain: '', //剩余时间

            questionList: [],
            isSubmit: false,
        }
    }

    _getStudentNo = () =>{
        return window.localStorage.studentNo
    }

    componentWillMount(){

        const exam = this.props.exam;
        const questionList = this.props.exam.quizVOS;
        let newQuizList = [];
        console.log('question list out of if', questionList);
        if(questionList.length === 0){

        }else{
            this._getRemainTime()
        }

        //以下应该在fetch操作成功后立即处理
        const pastTime = new Date().getTime() - new Date(exam.startTime).getTime();
        //如果停留时间过长，超出时间限制则提示错误
        if(pastTime > exam.between){
            this.props.dispatch(xinzhuToaster({
                type: 2,
                content: xinzhuInfo.exam.passedExamTime
            }))
            return false;
        }

        const remain = exam.between - pastTime;

        newQuizList = exam.quizVOS.map((v,k) => {
            const options = v.question.optionVOList;
            const newOptions = options.map((option) => {
                return Object.assign({}, option, {isChecked: false})
            })
            const newQuestion = Object.assign({}, v.question, {optionVOList: newOptions})
            return Object.assign({}, v , {question: newQuestion})
        })

        newQuizList = newQuizList.sort((a,b) =>{
            if(a.question.type == QUESTION_TYPE.SINGLE){
                return -1
            } else if (b.question.type == QUESTION_TYPE.SINGLE){
                return 1
            } else {
                return 0;
            }
        })


        this.setState({
            quizList: newQuizList,
            remain: remain,
        })
    }

    componentWillUnmount(){
        clearInterval(this.timer);
    }

    _getRemainTime(){
        //更新倒计时
        this.timer = setInterval(function() {
            let remain = this.state.remain;
            remain -= 1000;
            if(remain <= 0){
                this.handleSubmit();
                this.props.dispatch(xinzhuToaster({
                    type: 2,
                    content: xinzhuInfo.exam.passedExamTime
                }))
                browserHistory.push(`/student`);
            }else{
                this.setState({
                    remain,
                })
            }
        }.bind(this), 1000)
    }

    millisecondToDate(msd) {
        let time = parseFloat(msd) / 1000;
        if (null != time && "" != time) {
            if (time > 60 && time < 60 * 60) {
                time = parseInt(time / 60.0) + "分钟" + parseInt((parseFloat(time / 60.0) -
                        parseInt(time / 60.0)) * 60) + "秒";
            }
            else if (time >= 60 * 60 && time < 60 * 60 * 24) {
                time = parseInt(time / 3600.0) + "小时" + parseInt((parseFloat(time / 3600.0) -
                        parseInt(time / 3600.0)) * 60) + "分钟" +
                    parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                        parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
            }
            else {
                time = parseInt(time) + "秒";
            }
        }
        return time;
    }


    getQuestionStyle=(answer, isMarked)=>{
        if(answer.length == 0){
            return 'rgba(255,153,153,1)';
        }
        if(isMarked) {
            return 'rgba(255,230,204,1)';
        }
        else{
            return 'transparent';
        }
    };

    handleSubmit(){
        const { quizList,isSubmit } = this.state;
        this.setState({
            isSubmit:true
        })
        let submitList = [];
        for(let i = 0; i < quizList.length; i++){
            const quiz = quizList[i];
            const question = quiz.question;
            const options = question.optionVOList;
            const optionId = options.map(v => {
                if(v.isChecked){
                    return v.id;
                }
            })
            const submitQuiz = {
                value: quiz.value,
                question: {
                    id: question.id,
                    content: question.content,
                    type: question.type,
                    optionVOList: question.optionVOList.map((v)=>{
                        return {
                            content: v.content,
                            id: v.id,
                            isRight: v.isRight
                        }
                    })
                },
                optionId: optionId,
                id: quiz.id
            }
            submitList.push(submitQuiz);
        }

        fetch(`/test/exam/submit?testeeId=${this.props.testeeId}`,{
            credentials: 'include',
            method:'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(submitList)
        }).then(response => {
            if(response.code == 401){
                browserHistory.push('/login')
            } else {
                response.json().then(json=>{
                    if(!json.success){
                        this.props.dispatch(xinzhuToaster({
                            type: 2,
                            content: xinzhuInfo.exam.submitFail,
                        }))
                    }else{
                        this.props.dispatch(xinzhuToaster({
                            type: 1,
                            content: xinzhuInfo.exam.submitSuccess
                        }))
                        browserHistory.push('/student');

                    }
                })
            }
        })
    }

    handleClickQuestion=(key)=>{
        this.setState({
            pageType: PAGE_TYPE.SINGLE,
            chooseQuestionKey: key,
        })
    }

    handleToTotal = () => {
        this.setState({
            pageType: PAGE_TYPE.TOTAL,
            chooseQuestionKey: null,
        })
    }

    checkCandidate = (optionId) => {
        const { quizList, chooseQuestionKey } = this.state;
        const quiz = quizList[chooseQuestionKey];
        const options = quiz.question.optionVOList;
        let newOptions = [];
        for(let i = 0; i < options.length; i++){
            const option = options[i];
            if(option.id == optionId){
                const newOption = Object.assign({}, option, {isChecked: !option.isChecked});
                newOptions.push(newOption)
            }else{
                if(quiz.question.type == QUESTION_TYPE.SINGLE){
                    newOptions.push(Object.assign({}, option, {isChecked: false}));
                }else{
                    newOptions.push(option)
                }
            }
        }
        let newQuizList = [];
        for(let i = 0; i < quizList.length; i++){
            const qz = quizList[i];
            if(i===chooseQuestionKey){
                newQuizList.push(Object.assign({}, qz, {question:Object.assign({}, qz.question, {optionVOList: newOptions})}));
            }else{
                newQuizList.push(qz);
            }
        }
        this.setState({
            quizList: newQuizList
        })

    }

    handleCheckQuestion = (key) => {
        this.setState({
            chooseQuestionKey: key
        })
    }

    handleRemark = (key) => {
        let quizList = [];
        for(let i = 0; i < this.state.quizList.length; i++) {
            const quiz = this.state.quizList[i];
            if(key===i){
                quizList.push(Object.assign({}, quiz, {question:Object.assign({}, quiz.question, {isMarked:!quiz.question.isMarked})}))
            }else{
                quizList.push(quiz)
            }
        }
        this.setState({
            quizList: quizList
        })
    }

    getQuestionAnswers(key){
        const { quizList } = this.state;
        let quiz = quizList[key];

        const options = quiz.question.optionVOList;
        let answers = [];
        for(let i = 0; i < options.length; i++){
            const option = options[i];
            if(option.isChecked){
                answers.push(Object.assign({}, option, { number: OPTION_KEY[i] }))
            }
        }

        return answers
    }

    render(){
        const { pageType, quizList, chooseQuestionKey,remain, title, isSubmit } = this.state;

        let question = null;
        if(pageType==PAGE_TYPE.SINGLE){
            question = quizList[chooseQuestionKey].question;
        }

            return (
                <div className={styles.container}>
                    <div className={styles.titleContainer}>
                        <div className={styles.time}>
                            剩余：{this.millisecondToDate(remain)}
                        </div>
                        <h1>{title}</h1>
                    </div>
                    {
                        pageType == PAGE_TYPE.TOTAL ?
                            <div className={styles.totalContainer}>
                                <div className={styles.questionsContainer}>
                                    <h2>单选题</h2>
                                    <div className={styles.questions}>
                                        {quizList.length!=0 && quizList.map((quiz, key) => {
                                            const question = quiz.question;
                                            if(question.type == QUESTION_TYPE.SINGLE){
                                                const answer = this.getQuestionAnswers(key);
                                                return (
                                                    <div
                                                        key={key}
                                                        className={styles.question}
                                                        style={{backgroundColor: this.getQuestionStyle(answer, question.isMarked)}}
                                                        onClick={this.handleClickQuestion.bind(this, key)}
                                                    >
                                                        <div>{key+1}.</div>
                                                        <div>{answer.length != 0 && answer[0].number}</div>
                                                    </div>
                                                )
                                            } else {
                                                return null;
                                            }

                                        })}
                                    </div>
                                </div>
                                <div className={styles.questionsContainer}>
                                    <h2>多选题</h2>
                                    <div className={styles.questions}>
                                        {quizList.length!=0 && quizList.map((quiz,key) => {
                                            const question = quiz.question;
                                            if(question.type == QUESTION_TYPE.SINGLE){
                                                return null;
                                            }
                                            const answers = this.getQuestionAnswers(key);
                                            return (
                                                <div
                                                    key={key}
                                                    className={styles.question}
                                                    style={{backgroundColor: this.getQuestionStyle(answers, question.isMarked)}}
                                                    onClick={this.handleClickQuestion.bind(this, key)}
                                                >
                                                    <div>{key+1}</div>
                                                    <div>
                                                        {
                                                            answers.length != 0 &&
                                                            answers.map((answer)=>{
                                                                return `.${answer.number}`
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <Button onClick={this.handleSubmit.bind(this)} disabled={!!isSubmit}>{isSubmit ? '正在提交': '提交'}</Button>
                            </div>
                            :
                            <div className={styles.singleContainer}>
                                <div className={styles.titleContainer}>
                                    <div className={styles.title}>{question.type===QUESTION_TYPE.SINGLE ? '单选题': '多选题'}</div>
                                    <a style={{cursor: 'pointer'}} onClick={this.handleToTotal}>返回试题列表</a>
                                </div>
                                <div className={styles.questionContainer}>
                                    <div>{chooseQuestionKey+1}.{question.content}</div>
                                    <div>
                                        {question.optionVOList.length!=0 && question.optionVOList.map((candidate,key) => {
                                            return (
                                                <div>
                                                    <RadioBox
                                                        id={candidate.id}
                                                        name={OPTION_KEY[key]}
                                                        checked={candidate.isChecked}
                                                        label={candidate.content}
                                                        onChange={this.checkCandidate.bind(this, candidate.id)}
                                                    />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className={styles.btnPanel}>
                                    <div className={styles.left}>
                                        {chooseQuestionKey !== 0 &&
                                        <Button onClick={this.handleCheckQuestion.bind(this, chooseQuestionKey-1)}>上一题</Button>
                                        }
                                    </div>

                                    <div className={styles.right}>
                                        <Button style={{marginRight: 10}} onClick={this.handleRemark.bind(this, chooseQuestionKey)}>
                                            {question.isMarked ? '取消标记':'标记'}
                                        </Button>
                                        {chooseQuestionKey !== quizList.length-1 &&
                                        <Button onClick={this.handleCheckQuestion.bind(this, chooseQuestionKey+1)}>下一题</Button>
                                        }
                                    </div>
                                </div>

                            </div>
                    }

                </div>
            )


    }
}

function mapStateToProps(state, props){
    const examId = props.params.examId;
    const exams = state.examList.items;
    let exam = null;
    console.log(examId, exams);
    for(let i = 0; i < exams.length; i++){
        const e = exams[i];
        if(e.id == examId){
            exam = e;
            break;
        }
    }
    return {
        testeeId: exam.exam_testee.testeeId,
        exam: exam,
    }
}

export default connect(mapStateToProps)(ExamTotalPage)