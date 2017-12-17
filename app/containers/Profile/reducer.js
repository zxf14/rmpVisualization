import {
    REQUEST_PROFILE,
    RECEIVE_PROFILE
} from './actions';

export function profile(state = {
    isFetching: true,
    info: {}
}, action) {
    switch (action.type) {
        case REQUEST_PROFILE:
            return Object.assign({}, state, {isFetching: true});
        case RECEIVE_PROFILE:
            return Object.assign({}, state, {isFetching: false, info: action.profile});
        default:
            return state;
    }
}