import React from 'react';

import Groups from '../Groups';
export default class Homepage extends React.Component {

    render() {
        return (
            <div>
                <h4 style={{margin: "0 0 30px"}}>首页</h4>
                <hr/>
                <Groups />
            </div>
        )
    }
}
