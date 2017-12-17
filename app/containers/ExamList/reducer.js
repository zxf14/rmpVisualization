import {
    REQUEST_STUDENT_EXAM,
    RECEIVE_STUDENT_EXAM,
    REQUEST_TEACHER_EXAM,
    RECEIVE_TEACHER_EXAM
} from './actions'

export function examList(state = {
    isFetching: true,
    items: [],
}, action) {
    switch (action.type){
        case REQUEST_STUDENT_EXAM:
            return Object.assign({}, state, {isFetching:true});
        case RECEIVE_STUDENT_EXAM:
            return Object.assign({}, state, {
                isFetching: false,
                items: action.examList
            });
        case REQUEST_TEACHER_EXAM:
            return Object.assign({}, state, {isFetching:true});
        case RECEIVE_TEACHER_EXAM:
            return Object.assign({}, state, {
                isFetching: false,
                items: action.data
            });
        default:
            return state;
    }
}