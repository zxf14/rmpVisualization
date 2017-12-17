import React, {Component, PropTypes} from 'react';

export default class Loading extends React.Component {
    static propTypes = {
        size: PropTypes.string,
        visible: PropTypes.bool,
    };

    static defaultProps = {
        size: 'normal',
        visible: true,
    };

    render() {
        const {visible=true, display='block'} = this.props;
        let {size, } = this.props;
        if(size != 'small' && size != 'normal' && size != 'large'){
            size = 'normal';
        }
        const loadingClassName = visible ? `xinzhu-loading ${size} ${display}` : 'hidden';
        return (
            <div className={loadingClassName}>
                <div className="loading-logo"></div>
            </div>
        )
    }
}
