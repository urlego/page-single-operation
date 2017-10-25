<template>
    <div class="container">
        <h4 class="modal-title">{{title}}</h4>
        <div>
            <div class="loading" style="height:100px;" v-if="loading"></div>
            <div style="height:100px;position:relative" v-else-if="!loadStatus">
                <span class="hv-center">{{loadMsg}}</span>
            </div>
            <template v-else>
                <router-view ref="form"></router-view>
                <div class="clearfix">
                    <div class="col-sm-12 text-danger alert alert-danger"
                         v-if="!saveStatus">
                        <span class="glyphicon glyphicon-info-sign mr5"></span>{{saveMsg}}
                    </div>
                </div>
            </template>
        </div>
        <hr class="mt20"/>
        <div class="text-center">
                <button type="button" class="btn btn-primary"
                        v-if="operateType === 'add' || operateType === 'update'" @click="goSave" :class="{disabled:saving}" :disabled="saving">
                    <i class="glyphicon glyphicon-refresh rotate" v-if="saving"></i>
                    <i class="glyphicon glyphicon-saved" v-if="!saving"></i>
                    保存
                </button>
                <button type="button" class="btn btn-default ml10" @click="back">
                    {{operateType==='view' ? '返回' : '取消'}}
                </button>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
    /**
     * 组件事件列表
     * success 保存成功后触发该事件
     */
    import Interface from 'common/interface';
    import utility from 'ct-utility';
    import Const from 'common/const';
    export default{
        data(){
            return {
                loading: false, // 加载状态
                saving: false, // 是否保存中
                loadStatus: true, // 加载数据是否成功
                loadMsg: '', // 加载数据失败时的提示信息
                saveStatus: true, // 保存是否成功
                saveMsg: '' // 保存失败时的提示信息
            };
        },
        computed: {
            operateType(){
                return this.$store.state.operateType;
            },
            title(){
                var titles = {
                    view: '查看',
                    update: '编辑',
                    add: '添加'
                };

                return titles[this.operateType] + ' - ' + Const.getVal('os', this.$store.state.os);
            }
        },
        methods: {
            back(){
                this.$router.go(-1);
            },
            /**
             * 获取
             */
            getInfo(){
                this.loading = true;
                Promise.resolve($.ajax({
                    url: Interface.dialogConfig.getInfo,
                    type: 'get',
                    data: {
                        configId: this.$store.state.targetId
                    }
                })).then(res=> {
                    res = utility.objTransfer.lowerKey(res);
                    if (res.code === 0) {
                        this.resetLoadStatus();
                        this.$store.dispatch('syncTargetInfo', res.data);
                    } else {
                        return Promise.reject(res.message);
                    }
                }).catch(msg=> {
                    if (typeof msg !== 'string') {
                        if (msg.status === 401) {
                            msg = '您没有登录';
                        } else if (msg.status === 403) {
                            msg = '您没有权限';
                        } else {
                            msg = '获取信息失败';
                        }
                    } else if (msg === ''){
                        msg = '获取信息失败';
                    }
                    this.loadStatus = false;
                    this.loadMsg = msg;
                }).then(()=>{
                    this.loading = false;
                });
            },
            /**
             * 表单保存
             */
            goSave(){
                this.resetSaveStatus();
                const formValid = this.isFormValid();

                if (!formValid) {
                    this.saveStatus = false;
                    this.saveMsg = '验证不通过，请检查!';
                } else {
                    this.$refs.form.syncForm();
                    this.saving = true;
                    var reqData = utility.objTransfer.upperKey(Object.assign({}, this.$store.state.targetInfo, {
                        os: this.$store.state.os
                    }));

                    Promise.resolve($.ajax({
                        url: Interface.dialogConfig.update,
                        data: JSON.stringify(reqData),
                        contentType: 'application/json',
                        type: 'post'
                    })).then(res=> {
                        res = utility.objTransfer.lowerKey(res);
                        if (res.code === 0) {
                            this.resetSaveStatus();
                            new MiniMsg({
                                content: '保存成功',
                                type: 'success'
                            }).animation(()=> {
                                this.back();
                            });
                        } else {
                            return Promise.reject(res.message);
                        }
                    }).catch(msg=> {
                        if (typeof msg !== 'string') {
                            if (msg.status === 401) {
                                msg = '您没有登录';
                            } else if (msg.status === 403) {
                                msg = '您没有权限';
                            } else {
                                msg = '保存失败';
                            }
                        } else if (msg === ''){
                            msg = '保存失败';
                        }
                        this.saveStatus = false;
                        this.saveMsg = msg;
                    }).then(()=> {
                        this.saving = false;
                    });
                }
            },
            /**
             * 判断该模态框中的表单数据是否合法
             */
            isFormValid(){
                this.$refs.form.verifyAll();
                return this.$refs.form.isPass();
            },
            /**
             * 重置保存结果状态
             */
            resetSaveStatus(){
                this.saveStatus = true;
                this.saveMsg = '';
            },
            /**
             * 重置加载结果状态
             */
            resetLoadStatus(){
                this.loadStatus = true;
                this.loadMsg = '';
            }
        },
        /**
         * 路由钩子函数：进入该组件所在路由时执行的方法
         * @param to 要进入的路由
         * @param from 来源路由
         * @param next next回调
         */
        beforeRouteEnter(to, from, next){
            next(vm=> {
                var operateType = vm.$store.state.operateType;

                if (operateType === 'update' || operateType === 'view') {
                    vm.getInfo();
                }
            });
        }
    };
</script>
