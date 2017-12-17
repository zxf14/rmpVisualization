import React from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router";

import Card from "../Card";
import {Modal, Tabs, Tab, Button} from "react-bootstrap";

import {fetchArticles} from '../../containers/ArticleList/actions';
import {fetchVideos} from '../../containers/VideoList/actions';
import {fetchActivities} from '../../containers/ActivityList/actions';
import {fetchMaterials} from '../../containers/MaterialList/actions';
import {fetchLives} from '../../containers/LiveList/actions';
import {fetchExamines} from '../../containers/ExamineList/actions';
import {fetchAudios} from '../../containers/AudioList/actions';

class RelationCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            tabKey: 1,
            selectItems: []
        }
    }

    componentWillMount() {
        // this.props.dispatch(fetchArticles());
        // this.props.dispatch(fetchVideos());
        // this.props.dispatch(fetchActivities());
        // this.props.dispatch(fetchMaterials());
        // if (window.localStorage.userId != 1 && window.localStorage.userId != 5) {
        //     this.props.dispatch(fetchLives());
        //     this.props.dispatch(fetchExamines());
        //     this.props.dispatch(fetchAudios());
        // }
        this.handleSelectTab(this.state.tabKey);
        this.props.list && this.setState({
            selectItems: this.props.list
        });
        this.props.onChange && this.props.list && this.props.onChange(this.props.list.map(item => ({
            type: item.type,
            id: item.id
        })));
    }


    showModal = (e) => {
        e.preventDefault();
        this.setState({
            showModal: true
        })
    };

    closeModal = () => {
        this.setState({
            showModal: false
        });
    };

    handleSelectTab = (key) => {
        switch (key) {
            case 1:
                this.props.articleList.length === 0 && this.props.dispatch(fetchArticles());
                break;
            case 2:
                this.props.videoList.length === 0 && this.props.dispatch(fetchVideos());
                break;
            case 3:
                this.props.activityList.length === 0 && this.props.dispatch(fetchActivities());
                break;
            case 4:
                this.props.materialList.length === 0 && this.props.dispatch(fetchMaterials());
                break;
            case 5:
                this.props.liveList.length === 0 && this.props.dispatch(fetchLives());
                break;
            case 6:
                this.props.examineList.length === 0 && this.props.dispatch(fetchExamines());
                break;
            case 7:
                this.props.audioList.length === 0 && this.props.dispatch(fetchAudios());
                break;
        }
        this.setState({tabKey: key});
    };

    removeItem = (e) => {
        e.preventDefault();
        var info = e.target.getAttribute('data-target').split("_");
        this.state.selectItems = this.state.selectItems.filter(item => item.id != info[1] || item.type != info[0]);
        this.setState({selectItems: this.state.selectItems});
        this.props.onChange && this.props.onChange(this.state.selectItems.map(item => ({
            type: item.type,
            id: item.id
        })));
    };

    handleConfirm = () => {
        var tmp = this.state.selectItems;
        $('input[type=checkbox][name="rela_sel"]:checked').each(function () {
            var item = $(this).attr('id').split("_");
            tmp.push({
                type: item[0],
                id: +item[1],
                title: item[2]
            });
        });
        this.setState({
            showModal: false,
            selectItems: tmp
        });
        this.props.onChange && this.props.onChange(this.state.selectItems.map(item => ({
            type: item.type,
            id: item.id
        })));
    };

    doNothing = (e) => {
        e.preventDefault();
    };

    _mapTypeToName = (type) => {
        switch (type) {
            case 'article':
                return "资讯";
            case 'video':
                return "视频";
            case 'activity':
                return '活动';
            case 'material':
                return '资料';
            case 'live':
                return '直播';
            case 'examine':
                return '考试';
            case 'audio':
                return '音频';
            default:
                return '';
        }
    };

    render() {

        return (
            <div className="x-relative">
                <Card title="相关内容">
                    <a href="#" className="fa fa-plus" onClick={this.showModal}>添加</a>
                    <ul>
                        {
                            this.state.selectItems.map(item => {
                                return (
                                    <li>
                                        <a href="#"
                                           onClick={this.doNothing}>{"[" + this._mapTypeToName(item.type) + "] " + item.title}</a>
                                        <a href="#" data-target={item.type + "_" + item.id}
                                           onClick={this.removeItem}>删除</a>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </Card>
                <Modal show={this.state.showModal} onHide={this.closeModal} dialogClassName="resource-picker">
                    <Modal.Header>
                        <Modal.Title>选择相关内容</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Tabs defaultActiveKey={1} activeKey={this.state.tabKey} onSelect={this.handleSelectTab}>
                            <Tab eventKey={1} title="资讯">{this._renderArticleList()}</Tab>
                            <Tab eventKey={2} title="视频">{this._renderVideoList()}</Tab>
                            <Tab eventKey={3} title="活动">{this._renderActivityList()}</Tab>
                            <Tab eventKey={4} title="资料">{this._renderMaterialList()}</Tab>
                            {
                                window.localStorage.userId != 1 &&
                                window.localStorage.userId != 5 &&
                                <Tab eventKey={5} title="直播">{this._renderLiveList()}</Tab>
                            }
                            {
                                window.localStorage.userId != 1 &&
                                window.localStorage.userId != 5 &&
                                <Tab eventKey={6} title="考试">{this._renderExamineList()}</Tab>
                            }
                            {
                                window.localStorage.userId != 1 &&
                                window.localStorage.userId != 5 &&
                                <Tab eventKey={7} title="音频">{this._renderAudioList()}</Tab>
                            }

                        </Tabs>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="success" onClick={this.handleConfirm}>确定</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }


    _filter = (list, type) => {
        var tmp = this.state.selectItems.filter(item => item.type == type);
        return list.filter(
            item => {
                for (var i = 0; i < tmp.length; i++) {
                    if (tmp[i].id == item.id) {
                        return false;
                    }
                }
                return true;
            }
        );
    };

    _renderArticleList = () => {

        var list = this._filter(this.props.articleList, 'article');

        return (
            <div className="resource-list">
                {
                    this.props.articleListIsFetching && <h5>加载中...</h5>
                }
                {
                    !this.props.articleListIsFetching && list.length !== 0 &&
                    <ul>
                        {
                            list.map(item => {
                                return (
                                    item.categoryName !== "草稿" &&
                                    <li>
                                        <input type="checkbox" name="rela_sel"
                                               id={'article_' + item.id + "_" + item.title}/>
                                        <label htmlFor={'article_' + item.id + "_" + item.title}>{item.title}</label>
                                    </li>
                                )
                            })
                        }
                    </ul>
                }
            </div>
        )
    };

    _renderVideoList = () => {
        var list = this._filter(this.props.videoList, 'video');
        return (
            <div className="resource-list">
                {
                    this.props.videoListIsFetching && <h5>加载中...</h5>
                }
                {
                    !this.props.videoListIsFetching && list.length !== 0 &&
                    <ul>
                        {
                            list.map(item => {
                                return (
                                    item.categoryName !== "草稿" &&
                                    <li>
                                        <input type="checkbox" name="rela_sel"
                                               id={'video_' + item.id + "_" + item.title}/>
                                        <label htmlFor={'video_' + item.id + "_" + item.title}>{item.title}</label>
                                    </li>
                                )
                            })
                        }
                    </ul>
                }
            </div>
        )
    };

    _renderActivityList = () => {
        var list = this._filter(this.props.activityList, 'activity');
        return (
            <div className="resource-list">
                {
                    this.props.activityListIsFetching && <h5>加载中...</h5>
                }
                {
                    !this.props.activityListIsFetching && list.length !== 0 &&
                    <ul>
                        {
                            list.map(item => {
                                return (
                                    item.categoryName !== "草稿" &&
                                    <li>
                                        <input type="checkbox" name="rela_sel"
                                               id={'activity_' + item.id + "_" + item.title}/>
                                        <label htmlFor={'activity_' + item.id + "_" + item.title}>{item.title}</label>
                                    </li>
                                )
                            })
                        }
                    </ul>
                }
            </div>
        )
    };

    _renderMaterialList = () => {
        var list = this._filter(this.props.materialList, 'material');
        return (
            <div className="resource-list">
                {
                    this.props.materialListIsFetching && <h5>加载中...</h5>
                }
                {
                    !this.props.materialListIsFetching && list.length !== 0 &&
                    <ul>
                        {
                            list.map(item => {
                                return (
                                    item.category.name !== "草稿" &&
                                    <li>
                                        <input type="checkbox" name="rela_sel"
                                               id={'material_' + item.id + "_" + item.title}/>
                                        <label htmlFor={'material_' + item.id + "_" + item.title}>{item.title}</label>
                                    </li>
                                )
                            })
                        }
                    </ul>
                }
            </div>
        )
    };

    _renderLiveList = () => {
        var list = this._filter(this.props.liveList, 'live');
        return (
            <div className="resource-list">
                {
                    this.props.liveListIsFetching && <h5>加载中...</h5>
                }
                {
                    !this.props.liveListIsFetching && list.length !== 0 &&
                    <ul>
                        {
                            list.map(item => {
                                return (
                                    item.categoryName !== "草稿" &&
                                    <li>
                                        <input type="checkbox" name="rela_sel"
                                               id={'live_' + item.id + "_" + item.title}/>
                                        <label htmlFor={'live_' + item.id + "_" + item.title}>{item.title}</label>
                                    </li>
                                )
                            })
                        }
                    </ul>
                }
            </div>
        )
    };


    _renderExamineList = () => {
        var list = this._filter(this.props.examineList, 'examine');
        return (
            <div className="resource-list">
                {
                    this.props.examineListIsFetching && <h5>加载中...</h5>
                }
                {
                    !this.props.examineListIsFetching && list.length !== 0 &&
                    <ul>
                        {
                            list.map(item => {
                                return (
                                    item.category.name !== "草稿" &&
                                    <li>
                                        <input type="checkbox" name="rela_sel"
                                               id={'examine_' + item.id + "_" + item.title}/>
                                        <label htmlFor={'examine_' + item.id + "_" + item.title}>{item.title}</label>
                                    </li>
                                )
                            })
                        }
                    </ul>
                }
            </div>
        )
    };

    _renderAudioList = () => {
        var list = this._filter(this.props.audioList, 'audio');
        return (
            <div className="resource-list">
                {
                    this.props.audioListIsFetching && <h5>加载中...</h5>
                }
                {
                    !this.props.audioListIsFetching && list.length !== 0 &&
                    <ul>
                        {
                            list.map(item => {
                                return (
                                    item.categoryName !== "草稿" &&
                                    <li>
                                        <input type="checkbox" name="rela_sel"
                                               id={'audio_' + item.id + "_" + item.title}/>
                                        <label htmlFor={'audio_' + item.id + "_" + item.title}>{item.title}</label>
                                    </li>
                                )
                            })
                        }
                    </ul>
                }
            </div>
        )
    };
}

function mapStatetoProps(state) {
    const {
        isFetching: articleListIsFetching,
        items: articleList
    } = state.articles;
    const {
        isFetching: videoListIsFetching,
        items: videoList
    } = state.videos;
    const {
        isFetching: activityListIsFetching,
        items: activityList
    } = state.activities;
    const {
        isFetching: materialListIsFetching,
        items: materialList
    } = state.materials;
    const {
        isFetching: liveListIsFetching,
        items: liveList
    } = state.lives;
    const {
        isFetching: examineListIsFetching,
        items: examineList
    } = state.examines;
    const {
        isFetching: audioListIsFetching,
        items: audioList
    } = state.audios;
    return {
        articleListIsFetching,
        articleList,
        videoListIsFetching,
        videoList,
        activityListIsFetching,
        activityList,
        materialListIsFetching,
        materialList,
        liveListIsFetching,
        liveList,
        examineListIsFetching,
        examineList,
        audioListIsFetching,
        audioList
    }
}

export default connect(mapStatetoProps)(RelationCard);