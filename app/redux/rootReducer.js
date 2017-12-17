import {combineReducers} from 'redux';
import {toaster} from '../components/Toaster/reducer';
import {sidebar} from '../components/Sidebar/reducer';
import {profile} from '../containers/Profile/reducer';
import {group} from "../containers/Group/reducer";
import {examList} from "../containers/ExamList/reducer";

export default combineReducers({
    sidebar,
    toaster,
    group,
    examList
});