import {
    SHOW_TOASTER,
    HIDE_TOASTER
} from './actions';

export function toaster (state = {
    visible: false,
    type: 1,
    content: ""
}, action) {
    switch (action.type) {
        case SHOW_TOASTER:
            return Object.assign({}, state, {
                visible: true,
                type: action.t_type,
                content: action.content
            });
        case HIDE_TOASTER:
            return Object.assign({}, state, {
                visible: false
            });
        default:
            return state;
    }
}