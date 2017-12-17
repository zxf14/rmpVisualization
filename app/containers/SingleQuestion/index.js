import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { RadioGroup, Radio } from 'rsuite';
import styles from './style.scss'
import RadioBox from '../../components/RadioBox'
import Button from '../../components/Button'

import { QUESTION_TYPE } from '../../common/utils/constants'

class SingleQuestion extends React.Component {
    constructor(props){
        super(props);

        this.state={
            candidates:this.props.candidates
        }
    }
    checkCandidate(item){
        let candidates = [];
        if(this.props.type === QUESTION_TYPE.SINGLE){
            for(let i = 0; i < this.state.candidates.length; i++){
                if(this.state.candidates[i].item == item){
                    const candidate = this.state.candidates[i];
                    candidates.push(Object.assign({}, candidate, {isChoosed: !candidate.isChoosed}));
                }else{
                    candidates.push(Object.assign({}, this.state.candidates[i], {isChoosed: false}))
                }
            }
        }else{
            for(let i = 0; i < this.state.candidates.length; i++){
                if(this.state.candidates[i].item == item){
                    const candidate = this.state.candidates[i];
                    candidates.push(Object.assign({}, candidate, {isChoosed: !candidate.isChoosed}));
                }else{
                    candidates.push(this.state.candidates[i])
                }
            }
        }

        this.setState({
            candidates
        })
    }
    render(){
        return (
            <div className={styles.container}>
                <div className={styles.titleContainer}>
                    <div className={styles.title}>{this.props.type===QUESTION_TYPE.SINGLE ? '单选题': '多选题'}</div>
                    <Link to={`/student/exam/${this.props.examId}`}>返回试题列表</Link>
                </div>
                <div className={styles.questionContainer}>
                    <div>{this.props.questionNum}.{this.props.content}</div>
                    <div>
                        {this.state.candidates.map(candidate => {
                            return (
                                <div>
                                    <RadioBox
                                        id={candidate.item}
                                        name={candidate.item}
                                        checked={candidate.isChoosed}
                                        label={candidate.content}
                                        onChange={this.checkCandidate.bind(this, candidate.item)}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className={styles.btnPanel}>
                    <Button >上一题</Button>
                    <div className={styles.right}>
                        <Button style={{marginRight: 10}}>标记</Button>
                        <Button>下一题</Button>
                    </div>
                </div>

            </div>
        )
    }
}

SingleQuestion.defaultProps = {
    type: QUESTION_TYPE.MULTIPLE,
    questionNum: 33,
    content: '试题一试题一试题一试题一试题一试题一试题一试题一试题一试题一试题一试题一',
    candidates: [
        {
            item: 'A',
            content: '答案A',
            isChoosed: false,
        },
        {
            item: 'B',
            content: '答案A',
            isChoosed: false,
        },
        {
            item: 'C',
            content: '答案A',
            isChoosed: false,
        },
        {
            item: 'D',
            content: '答案A',
            isChoosed: false,
        },
    ],

}

function mapStateToProps(state,props){
    return {
        questionId: props.params.questionId,
        examId: props.params.examId,
    }
}


export default connect(mapStateToProps)(SingleQuestion);