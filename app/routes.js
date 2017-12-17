import React from 'react';
import {IndexRoute, Route} from 'react-router';

import Container from './components/Container';
import MainContainer from "./components/MainContainer/index";
import Login from './containers/Login';
import Register from './containers/Register'
import NotFound from './containers/404';
import Homepage from './containers/Homepage';
import Profile from './containers/Profile';
import Group from './containers/Group';
import Course from './containers/Course';
import ExamInfo from './containers/ExamInfo';
import ExamRelease from './containers/ExamRelease';
import Questions from './containers/Questions';
/*学生相关*/
import StudentContainer from './components/StudentContainer';
import ExamList from './containers/ExamList';
import ExamTotalPage from './containers/ExamTotalPage';
import ExamResultPage from './containers/ExamResultPage';
import SingleQuestion from './containers/SingleQuestion';
import ScoreList from './containers/ScoreList';
import Groups from './containers/Groups'

export default (  
    <Route path="/" component={Container}>
        <IndexRoute component={Login}/>
        <Route path="regist" component={Register}/>
        <Route path="login" component={Login}/>
        <Route path="teacher" component={MainContainer}>
            <IndexRoute component={Homepage}/>
            <Route path="group/:groupId" component={Group}/>
            <Route path="groups" component={Groups}/>
            <Route path="course" component={Course}>
                <Route path=":courseId/exam" component={ExamList}/>
                <Route path=":courseId/examInfo/:examId" component={ExamInfo}/>
                <Route path=":courseId/questions" component={Questions}/>
                <Route path=":courseId/examRelease" component={ExamRelease}/>
                <Route path=":courseId/result/:examId/:studentId" component={ExamResultPage}/>
                <Route path=":courseId/scoreList/:examId" component={ScoreList}/>
            </Route>
            
            <Route path="*" component={NotFound}/>
        </Route>

        <Route path="student" component={StudentContainer}>
            <IndexRoute component={ExamList}/>
            <Route path="singleExam/:examId/:questionId" component={SingleQuestion}/>
            <Route path="exam/:examId" component={ExamTotalPage}/>
            <Route path="result/:examId/:studentId" component={ExamResultPage}/>
            {/*<Route path="result/:examId/:studentId" component={ExamTotalPage}/>*/}
            <Route path="*" component={NotFound}/>
        </Route>

    </Route>
);