export const SHOW_TOASTER = "SHOW_TOASTER";
export const HIDE_TOASTER = "HIDE_TOASTER";

function show_toaster(type, content) {
    return {
        type: SHOW_TOASTER,
        t_type: type,
        content
    }
}

function hide_toaster() {
    return {
        type: HIDE_TOASTER
    }
}

export function xinzhuToaster(options) {
    return dispatch => {
        dispatch(show_toaster(options.type, options.content));
        setTimeout(() => dispatch(hide_toaster()), 1200);
    }
}

