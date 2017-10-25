<template>
    <div>
        <div class="form-group form-group-sm">
            <label class="control-label col-sm-3">
                名单管理
            </label>
            <div class="col-sm-8">
                <label class="mr20 checkbox-inline">
                    <input type="checkbox" v-model="form.versionLimit" @change="touch('nameList')"> 按版本
                </label>
                <label class="mr20 checkbox-inline">
                    <input type="checkbox" v-model="form.userLimit" @change="touch('nameList')"> 按用户
                </label>
                <label class="mr20 checkbox-inline">
                    <input type="checkbox" v-model="form.gameLimit" @change="touch('nameList')"> 按游戏
                </label>
                <label class="mr20 checkbox-inline">
                    <input type="checkbox" v-model="channelLimit" @change="touch('nameList')"> 按渠道
                </label>
                <template v-if="channelLimit">
                    <label class="mr20 radio-inline">
                        <input type="radio" :value="true" v-model="channelWhite" @change="touch('nameList')"> <span class="ml5">渠道白名单</span>
                    </label>
                    <label class="mr20 radio-inline">
                        <input type="radio" :value="false" v-model="channelWhite" @change="touch('nameList')"> <span class="ml5">渠道黑名单</span>
                    </label>
                </template>
            </div>
        </div>
        <div class="form-group form-group-sm" v-if="form.versionLimit">
            <div class="col-sm-3 p10 text-right">
                <label class="control-label">
                    <i class="red">*</i> 按版本
                </label>
            </div>
            <div class="col-sm-8">
                <div class="p10 clearfix" style="background-color:#f7f7f7;">
                    <div class="col-sm-4">
                        <label class="control-label col-sm-6">
                            <i class="red">*</i> 最低兼容版本
                        </label>
                        <div class="col-sm-6">
                            <select class="form-control" v-model="form.lowVersion" @change="touch('lowVersion')">
                                <option value="">请选择</option>
                                <option v-for="item in source.versionList" :value="item">{{item}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-sm-4">
                <label class="control-label col-sm-6">
                    <i class="red">*</i> 最高兼容版本
                </label>
                <div class="col-sm-6">
                    <select class="form-control" v-model="form.highVersion" @change="touch('highVersion')">
                        <option value="">请选择</option>
                        <option value="999.999.999">最新版本</option>
                        <option v-for="item in source.versionList" :value="item">{{item}}</option>
                    </select>
                </div>
            </div>
                <div class="col-sm-4 text-danger form-control-static"
                     v-if="(formTouched.lowVersion && !validation.lowVersion.required) || (formTouched.highVersion && !validation.highVersion.required)">
                    请选择
                </div>
                <div class="col-sm-4 text-danger form-control-static"
                     v-else-if="formTouched.highVersion && !validation.highVersion.notLowerThanLow">
                    最低兼容版本不得高于最高兼容版本
                </div>

                </div>
            </div>

        </div>
        <div class="form-group form-group-sm" v-if="form.userLimit">
            <label class="control-label col-sm-3">
                <i class="red">*</i> 按用户
            </label>
            <div class="col-sm-8">
                    <importer :server="userImporterServer"
                              button-text="导入xlsx文件"
                              method="POST"
                              ref="userImporter"
                              @success="userImporterSuccess"
                              @error="userImporterError"></importer>
                <textarea class="form-control"
                          style="width:100%;height:100px;resize:none"
                          @input="inputRemoveImporterError('user')"
                          v-model="form.userList"></textarea>
            </div>
            <div class="col-sm-offset-3 col-sm-9"
                 :class="importerRes.user.status ? 'text-success' : 'text-danger'"
                 v-if="importerRes.user.msg!==''" style="word-wrap: break-word;">
                {{importerRes.user.msg}}
            </div>
            <div class="col-sm-offset-3 col-sm-8 text-danger" v-else-if="formTouched.userList && !validation.userList.required">
                请导入
            </div>
        </div>
        <div class="form-group form-group-sm" v-if="form.gameLimit">
            <div class="col-sm-3 text-right">
                <label class="control-label">
                    <i class="red">*</i> 按游戏
                </label>
            </div>
            <div class="col-sm-9 p10" style="background-color:#f7f7f7;">
                <div class="form-group form-group-sm">
                    <label class="control-label col-sm-2">
                        按游戏类型选择
                    </label>
                    <div class="col-sm-10">
                        <div class="checkbox">
                            <label v-for="item in source.gameTag" class="mr20">
                                <input type="checkbox" :value="item.iD" v-model="form.tagList"> {{item.tagName}}
                            </label>
                        </div>
                    </div>
                </div>
                <div>
                    <label class="control-label col-sm-2">
                        自定义选择
                    </label>
                    <div class="col-sm-10">
                        <div class="row">
                            <transfer left-list-title="全部游戏"
                                      right-list-title="已选择游戏"
                                      :data-source="source.gameList"
                                      :selected-items="form.gameList"
                                      :show-key="['gameName','gameCode']"
                                      :match-key="['gameName','gameCode']"
                                      :button="{toLeft: '向左', toRight: '向右'}"
                                      @change="changeGameList"></transfer>
                        </div>
                    </div>
                </div>
                <div class="col-sm-offset-2 col-sm-10 text-danger"
                     v-if="formTouched.gameList && !validation.gameList.required">
                    请选择
                </div>
            </div>
        </div>
        <div class="form-group form-group-sm" v-if="channelLimit && channelWhite">
            <label class="control-label col-sm-3">
                <i class="red">*</i> 渠道白名单
            </label>
            <div class="col-sm-8">
                <importer :server="channelImporterServer"
                          button-text="导入xlsx文件"
                          method="POST"
                          ref="channelWhiteImporter"
                          @success="channelWhiteImporterSuccess"
                          @error="channelWhiteImporterError"></importer>
                <textarea class="form-control"
                          style="width:100%;height:100px;resize:none"
                          @input="inputRemoveImporterError('channelWhite')"
                          v-model="form.channelWhiteList"></textarea>
            </div>
            <div class="col-sm-offset-3 col-sm-9"
                 :class="importerRes.channelWhite.status ? 'text-success' : 'text-danger'"
                 v-if="importerRes.channelWhite.msg!==''" style="word-wrap: break-word;">
                {{importerRes.channelWhite.msg}}
            </div>
            <div class="col-sm-offset-3 col-sm-8 text-danger" v-else-if="formTouched.channelWhiteList && !validation.channelWhiteList.required">
                请导入
            </div>
        </div>
        <div class="form-group form-group-sm" v-if="channelLimit && !channelWhite">
            <label class="control-label col-sm-3">
                <i class="red">*</i> 渠道黑名单
            </label>
            <div class="col-sm-8">
                <importer :server="channelImporterServer"
                          button-text="导入xlsx文件"
                          method="POST"
                          ref="channelBlackImporter"
                          @success="channelBlackImporterSuccess"
                          @error="channelBlackImporterError"></importer>
                <textarea class="form-control"
                          style="width:100%;height:100px;resize:none"
                          @input="inputRemoveImporterError('channelBlack')"
                          v-model="form.channelBlackList"></textarea>
            </div>
            <div class="col-sm-offset-3 col-sm-9"
                 :class="importerRes.channelBlack.status ? 'text-success' : 'text-danger'"
                 v-if="importerRes.channelBlack.msg!==''" style="word-wrap: break-word;">
                {{importerRes.channelBlack.msg}}
            </div>
            <div class="col-sm-offset-3 col-sm-8 text-danger" v-else-if="formTouched.channelBlackList && !validation.channelBlackList.required">
                请导入
            </div>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
    import mixins from 'ct-adc-mixins';
    import Const from 'common/const';
    import utility from 'ct-utility';
    import Interface from 'common/interface';
    import Uploaders from 'ct-adc-uploaders';
    import Transfers from 'ct-adc-transfers';
    import listPromise from 'common/list-promise';
    import util from 'common/util';
    var Validator = mixins.Validator;

    export default{
        mixins: [new Validator({
            lowVersion: {
                rules: {
                    required: {
                        rule: /.+/
                    }
                },
                shouldBeVerified: 'form.versionLimit',
                form: 'form.lowVersion'
            },
            highVersion: {
                rules: {
                    required: {
                        rule: /.+/
                    },
                    notLowerThanLow: {
                        rule(){
                            var lowVersion = this.form.lowVersion.split('.');
                            var highVersion = this.form.highVersion.split('.');
                            var result = true;

                            for (var i = 0; i < Math.min(lowVersion.length, highVersion.length); i++){
                                if (highVersion[i] * 1 > lowVersion[i] * 1){
                                    result = true;
                                    break;
                                } else if (highVersion[i] * 1 < lowVersion[i] * 1){
                                    result = false;
                                    break;
                                }
                            }
                            return result;
                        }
                    }
                },
                shouldBeVerified: 'form.versionLimit',
                form: 'form.highVersion'
            },
            userList: {
                rules: {
                    required: {
                        rule: /.+/
                    }
                },
                shouldBeVerified: 'form.userLimit',
                form: 'form.userList'
            },
            channelWhiteList: {
                rules: {
                    required: {
                        rule: /.+/
                    }
                },
                shouldBeVerified(){
                    return this.channelLimit && this.channelWhite;
                },
                form: 'form.channelWhiteList'
            },
            channelBlackList: {
                rules: {
                    required: {
                        rule: /.+/
                    }
                },
                shouldBeVerified(){
                    return this.channelLimit && !this.channelWhite;
                },
                form: 'form.channelBlackList'
            },
            gameList: {
                rules: {
                    required: {
                        rule(){
                            return this.form.tagList.length > 0 || this.form.gameList.length > 0;
                        }
                    }
                },
                shouldBeVerified(){
                    return this.form.gameLimit;
                },
                form: ''
            }
        })],
        components: {
            importer: Uploaders.Importer,
            transfer: Transfers.LLTransfer
        },
        data(){
            return {
                channelLimit: false,
                channelWhite: true,
                form: {},
                source: {
                    showType: Const.getData('showType', false),
                    gameTag: [],
                    gameList: [],
                    versionList: []
                },
                channelImporterServer: Interface.common.importChannel,
                userImporterServer: Interface.common.importUser,
                importerRes: {
                    user: {
                        status: true,
                        msg: ''
                    },
                    channelWhite: {
                        status: true,
                        msg: ''
                    },
                    channelBlack: {
                        status: true,
                        msg: ''
                    }
                }
            };
        },
        created(){
            this.$set(this, 'form', this.$store.state.targetInfo);
            this.channelLimit = this.form.channelLimit !== Const.getKey('channelLimit', '不限');
            this.channelWhite = this.channelLimit ? Const.getVal('channelLimit', this.form.channelLimit) === '白名单' : true;
            listPromise.gameTag({
                os: this.$store.state.os,
                tagType: Const.getKey('tagType', '经典游戏标签')
            }).then(data=>{
                this.source.gameTag = data;
            });
            listPromise.gameList({
                os: this.$store.state.os,
                tagType: Const.getKey('gamePlayType', '经典游戏')
            }).then(data=>{
                var removeSame = [];
                var nameCode = [];

                data.map(game=>{
                    if (nameCode.indexOf(game.appCode + '&' + game.appName) === -1){
                        removeSame.push(game);
                    }
                    nameCode.push(game.appCode + '&' + game.appName);
                });
                this.source.gameList = removeSame.map(item=>{
                    return {
                        appId: item.appId,
                        gameName: item.appName,
                        packageName: item.checkPackageName,
                        gameCode: item.appCode
                    };
                });
            });
            listPromise.versionList({
                os: this.$store.state.os
            }).then(data=>{
                this.source.versionList = data;
            });
        },
        mounted(){
            if (this.form.userLimit){
                this.$refs.userImporter.refresh();
            }
            if (this.channelLimit && this.channelWhite){
                this.$refs.channelWhiteImporter.refresh();
            }
            if (this.channelLimit && this.channelBlack){
                this.$refs.channelBlackImporter.refresh();
            }
        },
        methods: {
            toAppTypeName(key){
                return Const.getVal('appType', key);
            },
            /**
             * 同步form表单内容到store,便于在modal中保存
             */
            syncForm(){
                var keys = [
                    'versionLimit',
                    'highVersion',
                    'lowVersion',
                    'channelLimit',
                    'channelWhiteList',
                    'channelBlackList',
                    'userLimit',
                    'userList',
                    'gameLimit',
                    'tagList',
                    'gameList'];
                var data = util.objSlicer(JSON.parse(JSON.stringify(this.form)), keys);

                if (this.channelLimit && this.channelWhite){
                    data.channelLimit = Const.getKey('channelLimit', '白名单');
                } else if (this.channelLimit && !this.channelWhite){
                    data.channelLimit = Const.getKey('channelLimit', '黑名单');
                } else {
                    data.channelLimit = Const.getKey('channelLimit', '不限');
                }
                this.$store.commit('syncTargetInfo', data);
            },
            changeDates(){
                var dates = this.$refs.dates.getDates(false);

                this.form.startTime = dates.begin;
                this.form.endTime = dates.end;
            },
            changeGameList(list){
                this.form.gameList = list.map(item=>{
                    return util.objSlicer(item, ['appId', 'gameName', 'gameCode', 'packageName']);
                });
            },
            userImporterSuccess(res){
                res = utility.objTransfer.lowerKey(res);
                this.importerSuccess('user', res);
                this.form.userList = res.data;
            },
            userImporterError(msg){
                this.importerError('user', msg);
            },
            channelWhiteImporterSuccess(res){
                res = utility.objTransfer.lowerKey(res);
                this.importerSuccess('channelWhite', res);
                this.form.channelWhiteList = res.data;
            },
            channelWhiteImporterError(msg){
                this.importerError('channelWhite', msg);
            },
            channelBlackImporterSuccess(res){
                res = utility.objTransfer.lowerKey(res);
                this.importerSuccess('channelBlack', res);
                this.form.channelBlackList = res.data;
            },
            channelBlackImporterError(msg){
                this.importerError('channelBlack', msg);
            },
            importerSuccess(type, res){
                if (res.code === 0){
                    this.importerRes[type].status = true;
                    this.importerRes[type].msg = '上传成功';
                } else {
                    this.importerRes[type].status = false;
                    this.importerRes[type].msg = res.message;
                }
            },
            importerError(type, msg){
                this.importerRes[type].status = false;
                this.importerRes[type].msg = msg;
            },
            inputRemoveImporterError(type){
                this.importerRes[type].status = true;
                this.importerRes[type].msg = '';
            }
        },
        watch: {
            'form.versionLimit': function(v){
                if (!v){
                    this.form.lowVersion = '';
                    this.form.highVersion = '';
                }
            },
            'form.userLimit': function(v){
                if (v){
                    setTimeout(()=>{
                        this.$refs.userImporter.refresh();
                    });
                } else {
                    this.form.userList = '';
                }
            },
            'channelWhite': function(v){
                if (v){
                    setTimeout(()=>{
                        this.$refs.channelWhiteImporter.refresh();
                    });
                    this.form.channelBlackList = '';
                } else {
                    setTimeout(()=>{
                        this.$refs.channelBlackImporter.refresh();
                    });
                    this.form.channelWhiteList = '';
                }
            },
            'channelLimit': function(v){
                if (!v){
                    this.form.channelWhiteList = '';
                    this.form.channelBlackList = '';
                } else {
                    this.$refs.channelWhiteImporter.refresh();
                    this.$refs.channelBlackImporter.refresh();
                }
            },
            'form.gameLimit': function(v){
                if (!v){
                    this.form.tagList = [];
                    this.form.gameList = [];
                }
            }
        }
    };
</script>
