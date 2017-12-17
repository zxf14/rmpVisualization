import React from 'react';
import {connect} from 'react-redux';
import {xinzhuToaster} from '../../components/Toaster/actions';
import xinzhuInfo from '../../components/Toaster/info';
import {Link} from "react-router";
import {browserHistory} from 'react-router';

import Input from '../../components/Input';
import Card from '../../components/Card';
import Button from '../../components/Button';

class Course extends React.Component {

    constructor(props){
        super(props);
        this.state = {
        }
    }

    componentWillMount() {
         let courseId = this.props.params.courseId;
         if(courseId){
         }else{
            browserHistory.push("/teacher");
         }
    }
    
    render() {
        let courseId = this.props.params.courseId;
        let course = this.props.courses.filter(i=>i.id == courseId)[0];
        return (
            <div>
                <div className="course-title">
                    <h3>课程名：{course&&course.name}</h3>
                    <Link to={`/teacher/course/${courseId}/exam`}>考试列表</Link>
                    <Link to={`/teacher/course/${courseId}/examRelease`}>创建考试</Link>
                    <Link to={`/teacher/course/${courseId}/questions`}>题库</Link>
                </div>
                {this.props.children}
            </div>
        )
    }

}

function mapStatetoProps(state) {
    const {
        courses,
    } = state.sidebar;

    return {
        courses
    };
}

export default connect(mapStatetoProps)(Course);

