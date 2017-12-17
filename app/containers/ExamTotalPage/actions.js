import fetch from 'isomorphic-fetch'
import {xinzhuToaster} from '../../components/Toaster/actions';
import xinzhuInfo from '../../components/Toaster/info';

export const REQUEST_EXAM_INFO = 'REQUEST_EXAM_INFO';
export const RECEIVE_EXAM_INFO = 'RECEIVE_EXAM_INFO';

export function requestExamInfo(){
    return {
        type: REQUEST_EXAM_INFO
    }
}

export function receiveExamInfo(data) {
    return {
        type: RECEIVE_EXAM_INFO,
        examInfo: data,
    }
}

export function fetchExamInfo(examId, studentNo){
    return dispatch => {
        dispatch(requestExamInfo());

        fetch(`/test/exam/getExam?examId=${examId}&studentNo=${studentNo}`,{credentials: 'include'})
            .then(res => res.json)
            .then(json => {
                if(!json.success){
                    this.props.dispatch(xinzhuToaster({
                        type: 2,
                        content: xinzhuInfo.exam.getExamFail
                    }))
                } else {
                    dispatch(receiveExamInfo(json.data))
                }
            })
    }
}