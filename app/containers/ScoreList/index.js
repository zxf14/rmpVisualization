import React from 'react';
import {connect} from 'react-redux';
import {xinzhuToaster} from '../../components/Toaster/actions';
import xinzhuInfo from '../../components/Toaster/info';
import {Link} from "react-router";
import {browserHistory} from 'react-router';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from '../../components/Table'

import Input from '../../components/Input';
import Card from '../../components/Card';
import Button from '../../components/Button';

class ScoreList extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            report:''
        }
    }

    componentWillMount() {
        this.getScoreList();
    }

    exportReport = () => {

    };

    getScoreList = ()=>{
        let examId = this.props.params.examId;
        return fetch(`/test/testee/list?examId=${examId}`, {credentials: 'include'})
        .then(response => response.json())
            .then(json => {
                if(!json.success) {
                    this.props.dispatch(xinzhuToaster({
                        type: 2,
                        content: json.msg
                    }));
                    // browserHistory.push('/login');
                } else {
                    this.setState({
                        report: json.data.report
                    });
                }
            });
    };

    render() {
        let examId = this.props.params.examId;
        let courseId = this.props.params.courseId;
        return (
            <div>
                <Card title="">
                    <Button onClick={this.exportReport} disabled={false}>批量导出成绩</Button>
                </Card>
                {
                    this.state.report.length !== 0 &&
                    <Table id="report" title="成绩列表">
                        <TableHeader>
                            <TableRow header={true}>
                                <TableHeaderColumn width="25%">学生</TableHeaderColumn>
                                <TableHeaderColumn width="25%">邮箱</TableHeaderColumn>
                                <TableHeaderColumn width="25%">成绩</TableHeaderColumn>
                                <TableHeaderColumn width="25%">操作</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                this.state.report.map(item => {
                                    return (
                                        <TableRow>
                                            <TableRowColumn>{item.studentName}</TableRowColumn>
                                            <TableRowColumn>{item.studentMail}</TableRowColumn>
                                            <TableRowColumn>{item.score}</TableRowColumn>
                                            <TableRowColumn><Link to={`/teacher/course/${courseId}/result/${examId}/${item.studentId}/${location.search}`}>查看详细成绩</Link></TableRowColumn>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                }
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

export default connect(mapStatetoProps)(ScoreList);

