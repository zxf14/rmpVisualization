import React from 'react';

export default class Card extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: true
        }
    }

    toggle = () => {
        this.setState({open: !this.state.open});
        var $cardContent = $(this.cardContent);
        if ($cardContent.is(":visible")) {
            $cardContent.slideUp(300);
        } else {
            $cardContent.slideDown(300);
        }
    };

    render() {
        return (
            <div className="card">
                <header className="card-title" onClick={this.toggle}>
                    <span>{this.props.title}</span>
                    <i className={"fa " + (this.state.open?"fa-caret-up":"fa-caret-down")}/>
                </header>
                <div
                    className="card-content"
                    ref={ (ref) => this.cardContent = ref }
                >
                    {this.props.children}
                </div>
            </div>
        );

    }

}
