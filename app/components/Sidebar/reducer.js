import {
    receive_courses_c,
    receive_groups_c
} from './actions';

export function sidebar (state = {
    courses: [],
    groups: []
}, action) {
    switch (action.type) {
        case receive_courses_c:
            return Object.assign({}, state, {
                courses: action.value
            });
        case receive_groups_c:
            return Object.assign({}, state, {
                groups: action.value
            });
        default:
            return state;
    }
}