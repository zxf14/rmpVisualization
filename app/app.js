require('./styles/styles.scss');

import React from 'react';
import {Router, browserHistory} from 'react-router';
import {Provider} from 'react-redux';

import configureStore from './redux/configureStore';
import routes from './routes';

const store = configureStore(window.__INITIAL_STATE__);
export default class App extends React.Component {

    render() {
        return (
            <Provider store={store}>
                <Router history={browserHistory}>
                    {routes}
                </Router>
            </Provider>
        )
    }
}
