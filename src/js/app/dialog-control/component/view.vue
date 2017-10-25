<template>
    <div>
        <div class="page-header">
            <h4 class="col-offset-1 text-muted">弹窗基本信息</h4>
        </div>
        <dl class="dl-horizontal">
            <dt><i class="red">*</i> 弹窗ID</dt>
            <dd>{{form.configId}}</dd>
        </dl>
        <hr class="hr-sm"/>
        <dl class="dl-horizontal">
            <dt><i class="red">*</i> 弹窗类型</dt>
            <dd>{{getDialogType(form.dialogType)}}</dd>
        </dl>
        <hr class="hr-sm"/>
        <dl class="dl-horizontal">
            <dt><i class="red">*</i> 标题</dt>
            <dd>{{form.dialogTitle}}</dd>
        </dl>
        <hr class="hr-sm"/>
        <dl class="dl-horizontal">
            <dt>文本内容</dt>
            <dd>{{form.dialogText}}</dd>
        </dl>
        <hr class="hr-sm"/>
        <dl class="dl-horizontal">
            <dt>弹窗等级</dt>
            <dd>{{getDialogLevel(form.dialogLevel)}}</dd>
        </dl>
        <hr class="hr-sm"/>
        <dl class="dl-horizontal">
            <dt>显示方式</dt>
            <dd>{{getShowType(form.showType)}}</dd>
        </dl>
        <hr class="hr-sm"/>
        <template v-if="form.confirmBtn!==null">
            <dl class="dl-horizontal">
                <dt>确定按钮</dt>
                <dd>
                    <span class="mr20"><span class="text-muted">按钮名称:</span> {{form.confirmBtn.name}}</span>
                    <span class="mr20"><span class="text-muted">按钮类型:</span> {{getConfirmActionType(form.confirmBtn.actionType)}} {{form.confirmBtn.actionContext}}</span>
                </dd>
            </dl>
            <hr class="hr-sm"/>
        </template>

        <template v-if="form.closeBtn!==null">
        <dl class="dl-horizontal">
            <dt>取消按钮</dt>
            <dd>
                <span class="mr20"><span class="text-muted">按钮名称:</span> {{form.closeBtn.name}}</span>
                <span class="mr20"><span class="text-muted">按钮类型:</span> {{getCloseType(form.closeBtn.type)}}</span>
            </dd>
        </dl>
        <hr class="hr-sm"/>
        </template>
        <dl class="dl-horizontal">
            <dt>投放时间</dt>
            <dd>
                {{dateTimeFormat(form.startTime)}} 至 {{dateTimeFormat(form.endTime)}}
            </dd>
        </dl>
        <div class="page-header" v-if="form.versionLimit || form.userLimit || form.channelLimit">
            <h4 class="col-offset-1 text-muted">名单管理</h4>
        </div>
        <template v-if="form.versionLimit">
        <dl class="dl-horizontal">
            <dt>按版本</dt>
            <dd>
                <span class="mr20"><span class="text-muted">高版本:</span> {{form.highVersion === '999.999.999' ? '最新版本' : form.highVersion}}</span>
                <span class="mr20"><span class="text-muted">低版本:</span> {{form.lowVersion}}</span>
            </dd>
        </dl>
        <hr class="hr-sm"/>
        </template>
        <template v-if="form.userLimit">
        <dl class="dl-horizontal">
            <dt>按用户</dt>
            <dd>
                {{form.userList}}
            </dd>
        </dl>
        <hr class="hr-sm"/>
        </template>
        <template v-if="form.gameLimit">
            <dl class="dl-horizontal">
                <dt>按游戏</dt>
                <dd>
                <span class="mr20" v-if="form.tagList.length>0">
                    <span class="text-muted">游戏类型:</span> {{tagListStr}}
                </span>
                <span class="mr20" v-if="form.gameList.length>0">
                    <span class="text-muted">游戏列表:</span> {{gameListStr}}
                </span>
                </dd>
            </dl>
            <hr class="hr-sm"/>
        </template>

        <template v-if="channelLimit && channelWhite">
        <dl class="dl-horizontal">
            <dt>渠道白名单</dt>
            <dd>
                {{form.channelWhiteList}}
            </dd>
        </dl>
        <hr class="hr-sm"/>
        </template>
        <dl class="dl-horizontal" v-if="channelLimit && channelBlack">
            <dt>渠道黑名单</dt>
            <dd>
                {{form.channelBlackList}}
            </dd>
        </dl>
    </div>
</template>
<script type="text/ecmascript-6">
    import Const from 'common/const';
    import utility from 'ct-utility';
    import listPromise from 'common/list-promise';
    export default{
        data(){
            return {
                form: {},
                source: {
                    gameTag: []
                }
            };
        },
        created(){
            listPromise.gameTag({
                os: this.$store.state.os,
                tagType: Const.getKey('tagType', '经典游戏标签')
            }).then(data=>{
                this.source.gameTag = data;
            });
            var data = this.$store.state.targetInfo;

            this.$set(this, 'form', data);
        },
        computed: {
            gameListStr(){
                return this.form.gameList.map(item=>{
                    return item.gameName;
                }).join();
            },
            tagListStr(){
                var tagNames = this.form.tagList.map(tagId=>{
                    var matched = this.source.gameTag.filter(item=>{
                        return item.iD === tagId;
                    });

                    if (matched.length > 0){
                        return matched[0].tagName;
                    }
                });

                return tagNames.join();
            },
            channelLimit(){
                return this.form.channelLimit !== Const.getKey('channelLimit', '不限');
            },
            channelWhite(){
                return this.form.channelLimit === Const.getKey('channelLimit', '白名单');
            },
            channelBlack(){
                return this.form.channelLimit === Const.getKey('channelLimit', '黑名单');
            }
        },
        methods: {
            getDialogType(type){
                return Const.getVal('dialogType', type);
            },
            getDialogLevel(level){
                return Const.getVal('dialogLevel', level);
            },
            getShowType(type){
                return Const.getVal('showType', type);
            },
            getConfirmActionType(type){
                return Const.getVal('confirmBtnActionType', type);
            },
            getCloseType(type){
                return Const.getVal('closeBtnType', type);
            },
            dateTimeFormat(v){
                return utility.dateFilter(v, 'yyyy-MM-dd HH:mm:ss');
            }
        }
    };
</script>
