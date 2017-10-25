<template>
    <div>
        <div class="form-group form-group-sm">
            <label class="control-label col-sm-3">
                <i class="red">*</i> 按钮定制
            </label>
            <div class="col-sm-4">
                <label class="mr20 checkbox-inline">
                    <input type="checkbox" v-model="confirmBtnChecked"> 确定按钮
                </label>
                <label class="checkbox-inline">
                    <input type="checkbox" v-model="closeBtnChecked"> 取消按钮
                </label>
            </div>
            <div class="col-sm-4 form-control-static text-danger" v-if="formTouched.btnChecked && !validation.btnChecked.required">
                请选择
            </div>
        </div>
        <div class="form-group form-group-sm" v-if="confirmBtnChecked">
            <div class="col-sm-3 p10 text-right">
                <label class="control-label">
                    <i class="red">*</i> 确定按钮
                </label>
            </div>
            <div class="col-sm-9">
                <div class="p10 clearfix" style="background-color:#f7f7f7;">
                    <div class="col-sm-4">
                    <label class="control-label col-sm-4">
                        <i class="red">*</i> 按钮名称
                    </label>

                    <div class="col-sm-8">
                        <input type="text" class="form-control" placeholder="自定义名称" v-model="form.confirmBtn.name"/>
                    </div>
                </div>
                    <div class="col-sm-8">
                    <label class="control-label col-sm-2">
                        <i class="red">*</i> 按钮类型
                    </label>

                    <div class="col-sm-2">
                        <select class="form-control" v-model="form.confirmBtn.actionType">
                            <option v-for="item in source.confirmBtnActionType" :value="item.key">{{item.val}}
                            </option>
                        </select>
                    </div>
                    <div class="col-sm-4">
                        <input type="text"
                               class="form-control"
                               placeholder="链接/功能缩写/游戏缩写"
                               maxlength="100"
                               v-model="form.confirmBtn.actionContext"/>
                    </div>
                        <div class="col-sm-4 form-control-static text-danger" v-if="formTouched.confirmBtn && !validation.confirmBtn.required">
                            请编辑
                        </div>
                </div>
                </div>
            </div>
        </div>
        <div class="form-group form-group-sm" v-if="closeBtnChecked">
            <div class="col-sm-3 p10 text-right">
                <label class="control-label">
                    <i class="red">*</i> 取消按钮
                </label>
            </div>
            <div class="col-sm-9">
                <div class="p10 clearfix" style="background-color:#f7f7f7;">
                    <div class="col-sm-4">
                        <label class="control-label col-sm-4">
                            <i class="red">*</i> 按钮名称
                        </label>

                        <div class="col-sm-8">
                            <input type="text" class="form-control" v-model="form.closeBtn.name" placeholder="自定义名称"/>
                        </div>
                    </div>
                    <div class="col-sm-8">
                        <label class="control-label col-sm-2">
                            <i class="red">*</i> 按钮类型
                        </label>

                        <div class="col-sm-6">
                            <div class="radio">
                                <label class="mr20" v-for="item in source.closeBtnType">
                                    <input type="radio" v-model="form.closeBtn.type" :value="item.key"> {{item.val}}
                                </label>
                            </div>
                        </div>
                        <div class="col-sm-4 form-control-static text-danger" v-if="formTouched.closeBtn && !validation.closeBtn.required">
                            请编辑
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
    import mixins from 'ct-adc-mixins';
    import Const from 'common/const';
    import util from 'common/util';
    var Validator = mixins.Validator;

    export default{
        mixins: [new Validator({
            btnChecked: {
                rules: {
                    required: {
                        rule(){
                            return this.confirmBtnChecked || this.closeBtnChecked;
                        }
                    }
                },
                form: ''
            },
            confirmBtn: {
                rules: {
                    required: {
                        rule(){
                            return /[^\s]+/.test(this.form.confirmBtn.name) && /[^\s]+/.test(this.form.confirmBtn.actionContext);
                        }
                    }
                },
                shouldBeVerified: 'confirmBtnChecked',
                form: ''
            },
            closeBtn: {
                rules: {
                    required: {
                        rule(){
                            return /[^\s]+/.test(this.form.closeBtn.name);
                        }
                    }
                },
                shouldBeVerified: 'closeBtnChecked',
                form: ''
            }
        })],
        data(){
            return {
                form: {},
                confirmBtnChecked: null,
                closeBtnChecked: null,
                source: {
                    closeBtnType: Const.getData('closeBtnType', false),
                    confirmBtnActionType: Const.getData('confirmBtnActionType', false)
                }
            };
        },
        created(){
            var data = this.$store.state.targetInfo;

            if (data.confirmBtn === null){
                this.confirmBtnChecked = false;
                data.confirmBtn = {
                    name: '',
                    actionType: Const.getKey('confirmBtnActionType', '链接'),
                    actionContext: ''
                };
            } else {
                this.confirmBtnChecked = true;
            }
            if (data.closeBtn === null){
                this.closeBtnChecked = false;
                data.closeBtn = {
                    type: Const.getKey('closeBtnType', '关闭继续'),
                    name: ''
                };
            } else {
                this.closeBtnChecked = true;
            }
            this.$set(this, 'form', data);
        },
        methods: {
            toAppTypeName(key){
                return Const.getVal('appType', key);
            },
            /**
             * 同步form表单内容到store,便于在modal中保存
             */
            syncForm(){
                var keys = ['confirmBtn', 'closeBtn'];
                var data = util.objSlicer(JSON.parse(JSON.stringify(this.form)), keys);

                if (!this.confirmBtnChecked){
                    data.confirmBtn = null;
                }
                if (!this.closeBtnChecked){
                    data.closeBtn = null;
                }
                this.$store.commit('syncTargetInfo', data);
            },
            changeDates(){
                var dates = this.$refs.dates.getDates(false);

                this.form.startTime = dates.begin;
                this.form.endTime = dates.end;
            }
        },
        watch: {
            confirmBtnChecked(v){
                if (!v){
                    this.form.confirmBtn = {
                        name: '',
                        actionType: Const.getKey('confirmBtnActionType', '链接'),
                        actionContext: ''
                    };
                }
            },
            closeBtnChecked(v){
                if (!v){
                    this.form.closeBtn = {
                        name: '',
                        type: Const.getKey('closeBtnType', '关闭继续')
                    };
                }
            }
        }
    };
</script>
