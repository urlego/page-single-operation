<template>
    <div class="well well-sm clearfix">
        <form action="javascript:;" class="form-horizontal form-horizontal-sm">
            <div class="col-lg-11 col-sm-11 text-nowrap">
                <div class="col-lg-3 col-sm-4">
                   <div class="form-group form-group-sm">
                       <label class="col-sm-4 control-label">弹框类型</label>
                       <div class="col-sm-8">
                           <select class="form-control" v-model="form.dialogType">
                               <option v-for="item in dialogTypeList" :value="item.key">{{item.val}}</option>
                           </select>
                       </div>
                   </div>
                </div>
                <div class="col-lg-3 col-sm-4">
                   <div class="form-group form-group-sm">
                       <label class="col-sm-4 control-label">标题</label>
                       <div class="col-sm-8">
                           <input type="text" class="form-control" maxlength="10" v-model="form.dialogTitle">
                       </div>
                   </div>
                </div>
                <div class="col-lg-6 col-sm-8">
                   <div class="form-group form-group-sm">
                       <label class="col-sm-2 control-label">投放时间</label>
                       <div class="col-sm-10">
                            <dates ref="dates"
                                   related
                                   :begin-ops="{type:'datetime'}"
                                   :end-ops="{type:'datetime',timeStart:'23:59:59'}"
                                   :initial-begin-date="form.startTime"
                                   :initial-end-date="form.endTime"
                                   @change="changeDates"></dates>
                       </div>
                   </div>
                </div>
                <div class="col-lg-3 col-sm-4">
                    <div class="form-group form-group-sm">
                        <label class="col-sm-4 control-label">日期状态</label>
                        <div class="col-sm-8">
                            <select class="form-control" v-model="form.effectStatus">
                                <option v-for="item in effectStatusList" :value="item.key">{{item.val}}</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-sm-4">
                    <div class="form-group form-group-sm">
                        <label class="col-sm-4 control-label">启用状态</label>
                        <div class="col-sm-8">
                            <select class="form-control" v-model="form.status">
                                <option v-for="item in statusList" :value="item.key">{{item.val}}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-1 col-sm-1 text-right">
                <div class="form-group form-group-sm">
                    <button type="submit" class="btn btn-sm btn-primary" @click="goSearch">
                        <i class="glyphicon glyphicon-search" v-if="!searching"></i>
                        <i class="glyphicon glyphicon-refresh rotate" v-else></i>
                        搜索
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>
<script type="text/ecmascript-6">
    /**
     * 组件事件列表
     * search 事件 搜索动作被触发是触发该事件（点击搜索按钮或敲回车）
     */
    import Const from 'common/const';
    import Form from 'ct-adc-form';
    export default {
        name: 'search',
        components: {
            dates: Form.DatesInput
        },
        data(){
            return {
                searching: false,
                form: {
                    dialogType: Const.getKey('dialogType', '不限'),
                    dialogTitle: '',
                    startTime: 0,
                    endTime: 0,
                    effectStatus: Const.getKey('effectStatus', '不限'),
                    status: Const.getKey('status', '不限')
                },
                effectStatusList: Const.getData('effectStatus'),
                statusList: Const.getData('status'),
                dialogTypeList: Const.getData('dialogType')
            };
        },
        methods: {
            changeDates(){
                var dates = this.$refs.dates.getDates(false);

                this.form.startTime = dates.begin;
                this.form.endTime = dates.end;
            },
            /**
             * 停止searching状态，主要用于外部调用
             */
            stopSearching(){
                this.searching = false;
            },
            /**
             * 发起搜索操作
             */
            goSearch(){
                this.searching = true;
                this.$emit('search', JSON.parse(JSON.stringify(this.form)));
            }
        }
    };
</script>
