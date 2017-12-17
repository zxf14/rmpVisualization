import fetch from 'isomorphic-fetch';
import { browserHistory } from 'react-router';
import {xinzhuToaster} from '../../components/Toaster/actions';
import xinzhuInfo from '../../components/Toaster/info';

export const REQUEST_PROFILE = "REQUEST_PROFILE";
export const RECEIVE_PROFILE = "RECEIVE_PROFILE";

function request_profile() {
    return {
        type: REQUEST_PROFILE
    }
}

function receive_profile(profile) {
    return {
        type: RECEIVE_PROFILE,
        profile
    }
}

export function fetchProfile() {

    return dispatch => {
        dispatch(request_profile());
        return fetch(`/xinzhu/api/getBusiness`, { credentials: 'include' })
            .then(response => {
                if(response.status == 401) {
                    dispatch(xinzhuToaster({
                        type: 2,
                        content: xinzhuInfo.auth.unauth
                    }));
                    browserHistory.push("/login");
                } else {
                    response.json().then(json => dispatch(receive_profile(json.obj)));
                }
            })
            .catch(error => console.log(error));
    }

}