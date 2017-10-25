<template>
    <div>
        <form class="form-horizontal">
            <div class="page-header">
                <h4 class="col-offset-1 text-muted">弹窗基本信息</h4>
            </div>
            <div class="form-group form-group-sm" v-if="$store.state.operateType === 'update'">
                <label class="control-label col-sm-3 form-control-static">
                    弹窗ID
                </label>

                <div class="col-sm-6 form-control-static">
                    {{form.configId}}
                </div>
            </div>
            <div class="form-group form-group-sm" v-if="operateType === 'add'">
                <label class="control-label col-sm-3">
                    <i class="red">*</i> 弹窗类型
                </label>

                <div class="col-sm-3">
                    <select class="form-control" v-model="form.dialogType" @blur="touch('dialogType')">
                        <option v-for="item in source.dialogType" :value="item.key">{{item.val}}</option>
                    </select>
                </div>
                <div class="col-sm-3 text-danger form-control-static"
                     v-if="formTouched.dialogType && !validation.dialogType.required">
                    请选择
                </div>
            </div>
            <div class="form-group form-group-sm" v-if="operateType === 'update'">
                <label class="control-label col-sm-3">
                    弹窗类型
                </label>
                <div class="col-sm-6 form-control-static">
                    {{getDialogType(this.form.dialogType)}}
                </div>
            </div>
            <div class="form-group form-group-sm">
                <label class="control-label col-sm-3">
                    <i class="red">*</i> 标题
                </label>

                <div class="col-sm-3">
                    <input type="text"
                           class="form-control"
                           v-model="form.dialogTitle"
                           @blur="touch('dialogTitle')"
                           maxlength="6"/>
                </div>
                <div class="col-sm-3 text-danger form-control-static"
                     v-if="formTouched.dialogTitle && !validation.dialogTitle.required">
                    请填写
                </div>
            </div>
            <div class="form-group form-group-sm">
                <label class="control-label col-sm-3">
                    <i class="red">*</i> 文本内容
                </label>

                <div class="col-sm-6">
                    <textarea type="text"
                           class="form-control"
                           v-model="form.dialogText"
                           @blur="touch('dialogText')"
                           maxlength="50" style="resize:none"></textarea>
                </div>
                <div class="col-sm-3 text-danger form-control-static"
                     v-if="formTouched.dialogText && !validation.dialogText.required">
                    请填写
                </div>
                <div class="col-sm-offset-3 col-sm-9 form-control-static text-muted" v-if="isYZDialogType">
                    银子类型弹窗的拼接文案为：“##为限额额度，**为已使用额度 ，@@为剩余额度”
                </div>
            </div>
            <div class="form-group form-group-sm">
                <label class="control-label col-sm-3">
                    <i class="red">*</i> 弹窗等级
                </label>

                <div class="col-sm-3">
                    <label v-for="item in source.dialogLevel" class="mr20 radio-inline">
                        <input type="radio" :value="item.key" v-model="form.dialogLevel"> {{item.val}}
                    </label>
                </div>
            </div>
            <div class="form-group form-group-sm">
                <label class="control-label col-sm-3">
                    <i class="red">*</i> 显示方式
                </label>

                <div class="col-sm-3">
                    <label v-for="item in source.showType" class="mr20 radio-inline">
                        <input type="radio" :value="item.key" v-model="form.showType"> {{item.val}}
                    </label>
                </div>
            </div>
            <update-btn ref="form-buttons"></update-btn>
            <div class="form-group form-group-sm">
                <label class="control-label col-sm-3">
                    <i class="red">*</i> 投放时间
                </label>

                <div class="col-sm-4">
                    <dates ref="dates"
                           related
                           :begin-ops="{type:'datetime'}"
                           :end-ops="{type:'datetime',timeStart:'23:59:59'}"
                           :initial-begin-date="form.startTime"
                           :initial-end-date="form.endTime"
                           @change="changeDates"></dates>
                </div>
                <div class="col-sm-5">
                    <div class="col-sm-3 text-danger form-control-static"
                         v-if="(formTouched.startTime && !validation.startTime.required) || (formTouched.endTime && !validation.endTime.required)">
                        请选择
                    </div>
                </div>
            </div>
            <div class="page-header">
                <h4 class="col-offset-1 text-muted">名单管理</h4>
            </div>
            <update-user-list ref="form-userList"></update-user-list>
        </form>
    </div>
</template>
<script type="text/ecmascript-6">
    import mixins from 'ct-adc-mixins';
    import Const from 'common/const';
    import util from 'common/util';
    import Form from 'ct-adc-form';
    import Uploaders from 'ct-adc-uploaders';
    import Transfers from 'ct-adc-transfers';
    import UpdateBtn from './update-btn.vue';
    import UpdateUserList from './update-user-list.vue';
    var Validator = mixins.Validator;

    export default{
        mixins: [new Validator({
            dialogType: {
                rules: {
                    required: {
                        rule(v){
                            return v !== Const.getKey('dialogType', '不限');
                        }
                    }
                },
                form: 'form.dialogType'
            },
            dialogTitle: {
                rules: {
                    required: {
                        rule: /.+/
                    }
                },
                form: 'form.dialogTitle'
            },
            dialogText: {
                rules: {
                    required: {
                        rule: /.+/
                    }
                },
                form: 'form.dialogText'
            },
            startTime: {
                rules: {
                    required: {
                        rule(v){
                            return v !== 0 && v !== '';
                        }
                    }
                },
                form: 'form.startTime'
            },
            endTime: {
                rules: {
                    required: {
                        rule(v){
                            return v !== 0 && v !== '';
                        }
                    }
                },
                form: 'form.endTime'
            }
        })],
        components: {
            'dates': Form.DatesInput,
            'importer': Uploaders.Importer,
            'transfer': Transfers.LLTransfer,
            'update-btn': UpdateBtn,
            'update-user-list': UpdateUserList
        },
        data(){
            return {
                form: {},
                source: {
                    dialogType: Const.getData('dialogType'),
                    dialogLevel: Const.getData('dialogLevel', false),
                    showType: Const.getData('showType', false),
                    closeBtnType: Const.getData('closeBtnType'),
                    confirmBtnActionType: Const.getData('confirmBtnActionType', false)
                }
            };
        },
        created(){
            this.$set(this, 'form', this.$store.state.targetInfo);
        },
        computed: {
            isYZDialogType(){
                return this.form.dialogType === Const.getKey('dialogType', '登录银子限额弹窗') || this.form.dialogType === Const.getKey('dialogType', '游戏银子限额弹窗');
            },
            operateType(){
                return this.$store.state.operateType;
            }
        },
        methods: {
            getDialogType(v){
                return Const.getVal('dialogType', v);
            },
            toAppTypeName(key){
                return Const.getVal('appType', key);
            },
            /**
             * 同步form表单内容到store,便于在modal中保存
             */
            syncForm(){
                var keys = [
                    'configId',
                    'dialogType',
                    'dialogTitle',
                    'dialogText',
                    'dialogLevel',
                    'showType',
                    'startTime',
                    'endTime'
                ];
                var data = util.objSlicer(JSON.parse(JSON.stringify(this.form)), keys);

                this.$store.commit('syncTargetInfo', data);
                this.$refs['form-buttons'].syncForm();
                this.$refs['form-userList'].syncForm();
            },
            changeDates(){
                this.touch('startTime');
                this.touch('endTime');
                var dates = this.$refs.dates.getDates(false);

                this.form.startTime = dates.begin;
                this.form.endTime = dates.end;
            },
            verifyAll(){
                this.touchAll();
                this.$refs['form-buttons'].touchAll();
                this.$refs['form-userList'].touchAll();
            },
            isPass(){
                return this.validation._pass && this.$refs['form-buttons'].validation._pass && this.$refs['form-userList'].validation._pass;
            }
        }
    };
</script>
