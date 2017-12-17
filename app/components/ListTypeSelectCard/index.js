import React from "react";
import Card from "../Card";
import RadioBox from '../RadioBox';
import RadioGroup from '../RadioGroup';

export default class ListTypeSelectedCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: [
                {
                    id: 1,
                    name: "左主图模式"
                },
                {
                    id: 2,
                    name: "右主图模式"
                },
                {
                    id: 3,
                    name: "3主图模式"
                },
                {
                    id: 4,
                    name: "通栏模式"
                }
            ]
        }
    }

    handleChange = (e) => {
        this.props.onChange && this.props.onChange(e.target.id.split("-")[1]);
    };

    render() {
        return (
            <Card title="列表样式">
                <RadioGroup name='type'>
                    {
                        this.state.categories.map((category) =>
                            <RadioBox
                                key={"type-" + category.id}
                                id={"type-" + category.id}
                                label={category.name}
                                onChange={this.handleChange}
                                checked={this.props.defaultChecked && (this.props.defaultChecked == category.id)}
                            />
                        )
                    }
                </RadioGroup>
            </Card>
        )
    }

}