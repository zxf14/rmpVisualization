import React from "react";
import Card from "../Card";
import RadioBox from '../RadioBox';
import RadioGroup from '../RadioGroup';

export default class CategorySelectCard extends React.Component {

    handleChange = (e) => {
        this.props.onChange && this.props.onChange(e.target.id);
    };

    render() {
        return (
            <Card title="分类目录">
                <RadioGroup name='category'>
                    {
                        this.props.categories.map((category) =>
                            <RadioBox
                                key={category.id}
                                id={category.id}
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