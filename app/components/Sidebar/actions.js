export const receive_courses_c = "receive_courses_c";
export const receive_groups_c = "receive_groups_c";

function receive_courses(data) {
    return {
        type: receive_courses_c,
        value: data
    }
}

function receive_groups(data) {
    return {
        type: receive_groups_c,
        value: data
    }
}

export function getCourses() {
    return dispatch => {
        return fetch(`/test/course/list`, {credentials: 'include'})
        .then(response => response.json())
            .then(json => {
                if(!json.success) {
                    this.props.dispatch(xinzhuToaster({
                        type: 2,
                        content: json.msg
                    }));
                    browserHistory.push('/login');
                } else {
                    dispatch(receive_courses(json.data.courses));
                }
            });
        }
}

export function getGroups() {
    return dispatch => {
        return fetch(`/test/group/list`, {credentials: 'include'})
        .then(response => response.json())
            .then(json => {
                if(!json.success) {
                    this.props.dispatch(xinzhuToaster({
                        type: 2,
                        content: json.msg
                    }));
                    browserHistory.push('/login');
                } else {
                    dispatch(receive_groups(json.data.groups));
                }
            });
    }
}


