/**
 * @author rubyisapm
 */
import Vue from 'vue';
import Vuex from 'vuex';
import Const from 'common/const';
//import util from 'common/util';
Vue.use(Vuex);
var targetInfoTemplate = {
    configId: 0, // 配置序号
    status: Const.getKey('status', '已禁用'),
    dialogType: Const.getKey('dialogType', '不限'),
    dialogTitle: '',
    dialogText: '',
    dialogLevel: Const.getKey('dialogLevel', '非强制弹窗'),
    showType: Const.getKey('showType', '显示一次'),
    confirmBtn: null,
    closeBtn: null,
    startTime: 0,
    endTime: 0,
    versionLimit: false,
    highVersion: '',
    lowVersion: '',
    channelLimit: Const.getKey('channelLimit', '不限'),
    channelWhiteList: '',
    channelBlackList: '',
    userLimit: false,
    userList: '',
    gameLimit: false,
    tagList: [],
    gameList: []
    //{
    //    "AppId": 1,
    //    "GameName": "大天使之剑",
    //    "PackageName": "DTSZJ"
    //}
    //
};

//var infoResolver = function(data){
//    if (data.confirmBtn === null){
//        data.confirmBtn = util.objSlicer(data, ['confirmBtn']);
//    }
//    if (data.closeBtn === null){
//        data.closeBtn = util.objSlicer(data, ['closeBtn']);
//    }
//    return data;
//};

export default new Vuex.Store({
    state: {
        operateType: '', // 操作类型
        targetId: '', // 操作目标Id
        targetInfo: JSON.parse(JSON.stringify(targetInfoTemplate)), // 操作目标的信息
        os: Const.getKey('os', 'android') // 操作系统
    },
    mutations: {
        update(state){
            state.operateType = 'update';
        },
        view(state){
            state.operateType = 'view';
        },
        add(state){
            state.operateType = 'add';
        },
        syncTargetId(state, id){
            state.targetId = id;
        },
        syncTargetInfo(state, info){
            Object.assign(state.targetInfo, info);
        },
        resetTargetInfo(state){
            state.targetInfo = JSON.parse(JSON.stringify(targetInfoTemplate));
        },
        switchOs(state, os){
            state.os = os;
        }
    },
    actions: {
        update(context, id) {
            context.commit('update');
            context.commit('syncTargetId', id);
        },
        view(context, id) {
            context.commit('view');
            context.commit('syncTargetId', id);
        },
        add(context, id) {
            context.commit('add', id);
            context.commit('resetTargetInfo');
        },
        syncTargetInfo(context, info){
            context.commit('syncTargetInfo', info);
        },
        switchOs(context, os){
            context.commit('switchOs', os);
        }
    }
});
