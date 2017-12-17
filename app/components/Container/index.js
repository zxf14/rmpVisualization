import React from 'react';
import Toaster from '../Toaster';

export default class Container extends React.Component {

    render() {
        return (
            <div style={{height: "100%", minWidth: 600}}>
                <Toaster />
                {this.props.children}
            </div>
        )
    }

}