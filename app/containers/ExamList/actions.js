import fetch from 'isomorphic-fetch'

import {xinzhuToaster} from '../../components/Toaster/actions';
import xinzhuInfo from '../../components/Toaster/info';

export const REQUEST_STUDENT_EXAM = 'REQUEST_STUDENT_EXAM';
export const REQUEST_TEACHER_EXAM = 'REQUEST_TEACHER_EXAM';

export const RECEIVE_STUDENT_EXAM = 'RECEIVE_STUDENT_EXAM';
export const RECEIVE_TEACHER_EXAM = 'RECEIVE_TEACHER_EXAM';


export function requestStudentExamList(){
    return {
        type: REQUEST_STUDENT_EXAM
    }
}

export function receiveStudenetExamList(data){
    return {
        type: RECEIVE_STUDENT_EXAM,
        examList: data,
    }
}

export function requestTeacherExamList(data){
    return {
        type: REQUEST_TEACHER_EXAM
    }
}

export function receiveTeacherExamList(data){
    return {
        type: RECEIVE_TEACHER_EXAM,
        data,
    }
}

export function fetchStudentExamList(studentNo){
    return dispatch => {
        dispatch(requestStudentExamList());

        fetch(`/test/exam/getExamByStudentNo?studentNo=${studentNo}`, {credentials: 'include'})
            .then(res=>res.json())
            .then(json=>{
                if(!json.success){
                    this.props.dispatch(xinzhuToaster({
                        type: 2,
                        content: xinzhuInfo.operation.getListFail
                    }))
                }else{
                    dispatch(receiveStudenetExamList(json.data.exam))
                }
            })
    }
}

export function fetchUserExamList(courseId){

    return dispatch => {
        return fetch(`/test/exam/getExamByCourse?courseId=${courseId}`, {credentials: 'include'})
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
                            dispatch(receiveTeacherExamList(json.data.exam))
                        }
                    });
                }

            })
            .catch(error => console.log(error));
    }
        
}