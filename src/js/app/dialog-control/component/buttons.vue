<template>
    <div>
        <button type="button" class="btn btn-xs btn-primary" @click="goEdit">
            <i class="glyphicon glyphicon-edit"></i> 编辑
        </button>
        <button type="button" class="btn btn-xs btn-danger" @click="goToggleStatus" v-if="toStatusText()==='已启用'">
            <i class="glyphicon glyphicon-ban-circle"></i> 禁用
        </button>
        <button type="button" class="btn btn-xs btn-success" @click="goToggleStatus($event)" v-if="toStatusText()==='已禁用'">
            <i class="glyphicon glyphicon-ok-circle"></i> 启用
        </button>
        <button type="button" class="btn btn-xs btn-success" @click="goView">
            <i class="glyphicon glyphicon-eye-open"></i> 查看
        </button>
    </div>
</template>
<script type="text/ecmascript-6">
    /**
     * 组件事件列表
     * operate-success 按钮操作成功后触发该事件
     */
    import Interface from 'common/interface';
    import utility from 'ct-utility';
    import Const from 'common/const';
    export default{
        name: 'buttons',
        props: {
            prop: {
                // 对应的源数据中的字段名
                type: String,
                default: ''
            },
            item: {
                // 所在行的数据信息
                type: Object,
                default(){
                    return {};
                }
            },
            index: {
                // 所在行的索引
                type: Number,
                default(){
                    return -1;
                }
            },
            data: {
                // 源全局数据，即表格对应的源数据
                type: Array,
                default(){
                    return [];
                }
            }
        },
        methods: {
            /**
             * 根据当前的状态key获取状态文本
             */
            toStatusText(){
                return Const.getVal('status', this.item.status);
            },
            /**
             * 编辑操作
             */
            goEdit(){
                this.$store.dispatch('update', this.item.configId);
                this.$router.push({path: '../operation/update', append: true});
            },
            goView(){
                this.$store.dispatch('view', this.item.configId);
                this.$router.push({path: '../operation/view', append: true});
            },
            /**
             * 切换禁用/启用状态
             */
            goToggleStatus(e){
                e.stopPropagation();
                var that = this;
                var text = this.toStatusText() === '已启用' ? '禁用' : '启用';
                var postData = {
                    configId: this.item.configId,
                    status: this.toStatusText() === '已启用' ? Const.getKey('status', '已禁用') : Const.getKey('status', '已启用')
                };

                popoverConfirm.init({
                    UID: this.item.configId,
                    title: '确定' + text + '弹窗' + this.item.configId + '吗？',
                    loadingContent: text + '弹窗' + this.item.configId + '中...',
                    $trigger: $(e.currentTarget),
                    ajax: {
                        config: {
                            type: 'post',
                            url: Interface.dialogConfig.updateStatus,
                            contentType: 'application/json',
                            data: JSON.stringify(utility.objTransfer.upperKey(postData))
                        },
                        callback: function(res) {
                            res = utility.objTransfer.lowerKey(res);
                            if (res.code === 0) {
                                popoverConfirm.setContent({
                                    title: '操作成功',
                                    content: '<span class="text-success">' + text + '成功</span>'
                                });
                                setTimeout(()=>{
                                    popoverConfirm.destroy();
                                    that.$parent.$emit('operate-success');
                                }, 2000);
                            } else {
                                popoverConfirm.setContent({
                                    title: '操作失败',
                                    content: '<span class="text-danger">' + res.message + '</span>'
                                });
                            }
                        },
                        error: function(xhr) {
                            var msg = '';

                            if (xhr.status === 401) {
                                msg = '您没有权限';
                            } else {
                                msg = '操作失败';
                            }
                            popoverConfirm.setContent({
                                title: '操作失败',
                                content: '<span class="text-danger">' + msg + '</span>'
                            });
                        }
                    }
                });
            }
        }
    };
</script>
