<template>
    <div>
        <search ref="search" @search="search"></search>
        <div class="mb10 clearfix">
            <button type="button" class="btn btn-sm btn-primary pull-right" @click="add">
                <span class="glyphicon glyphicon-plus"></span>
                添加
            </button>
        </div>
        <adc-table :data="list.data"
                   :status="list.status"
                   :msg="list.msg"
                   :loading="list.loading" @operate-success="getData">
            <adc-table-column prop="configId" name="ID"></adc-table-column>
            <adc-table-column prop="dialogType" name="弹框类型" :mapper="list.source.dialogType"></adc-table-column>
            <adc-table-column prop="dialogTitle" name="标题"></adc-table-column>
            <adc-table-column prop="dialogText" name="文本内容" width="200"></adc-table-column>
            <adc-table-column name="投放时间" :filter="list.filter.time"></adc-table-column>
            <adc-table-column prop="effectStatus" name="日期状态" :mapper="list.source.effectStatus" :class-name="list.className.effectStatus"></adc-table-column>
            <adc-table-column prop="status" name="启用状态" :mapper="list.source.status" :class-name="list.className.status"></adc-table-column>
            <adc-table-column name="操作" :vm="list.vm.operation" width="200"></adc-table-column>
        </adc-table>
        <page form
              :curr-page="pageInfo.pageIndex"
              :page-length="pageInfo.pageSize"
              :total-num="pageInfo.count" @change-page="changePage"></page>
    </div>
</template>
<script type="text/ecmascript-6">
    import Const from 'common/const';
    import List from 'ct-adc-list';
    import Page from 'ct-adc-page';
    import Search from './search';
    import Interface from 'common/interface';
    import utility from 'ct-utility';
    import Buttons from './buttons';
    import Vue from 'vue';
    Vue.component('appSwitchListButtons', Buttons);
    export default{
        components: {
            Search,
            List,
            Page,
            'adc-table': List['adc-table'],
            'adc-table-column': List['adc-table-column']
        },
        data(){
            return {
                form: {
                    dialogType: Const.getKey('dialogType', '不限'),
                    dialogTitle: '',
                    startTime: '',
                    endTime: '',
                    effectStatus: Const.getKey('effectStatus', '不限'),
                    status: Const.getKey('status', '不限')
                },
                list: {
                    data: [],
                    status: true,
                    msg: '请点击搜索',
                    loading: false,
                    vm: {
                        operation: {
                            name: 'appSwitchListButtons'
                        }
                    },
                    source: {
                        dialogType: Const.getData('dialogType', false),
                        effectStatus: Const.getData('effectStatus', false),
                        status: Const.getData('status', false)
                    },
                    className: {
                        effectStatus(val){
                            if (val === '有效期内'){
                                return 'text-success';
                            } else if (val === '已过期'){
                                return 'text-muted';
                            }
                            return '';
                        },
                        status(val){
                            if (val === '已启用'){
                                return 'text-success';
                            } else if (val === '已禁用'){
                                return 'text-danger';
                            }
                            return '';
                        }
                    },
                    filter: {
                        time(data, item){
                            return utility.dateFilter(item.startTimeStamp, 'yyyy-MM-dd HH:mm:ss') + ' 至 ' + utility.dateFilter(item.endTimeStamp, 'yyyy-MM-dd HH:mm:ss');
                        }
                    }
                },
                pageInfo: {
                    pageIndex: 1,
                    count: 0,
                    pageSize: 10
                }
            };
        },
        computed: {
            os(){
                return this.$store.state.os;
            },
            /**
             * 搜索时的请求参数对象
             */
            searchData(){
                return Object.assign({}, this.form, {
                    os: this.os,
                    pageIndex: this.pageInfo.pageIndex,
                    pageSize: this.pageInfo.pageSize
                });
            }
        },
        created(){
            this.getData();
        },
        methods: {
            /**
             * 请求数据
             */
            getData(){
                this.list.loading = true;
                Promise.resolve($.ajax({
                    url: Interface.dialogConfig.getList,
                    type: 'get',
                    cache: false,
                    data: this.searchData
                })).then(res=>{
                    res = utility.objTransfer.lowerKey(res);
                    if (res.code === 0){
                        this.list.data = res.data.pageData;
                        this.pageInfo.count = res.data.totalCounts;
                        this.pageInfo.pageIndex = res.data.pageIndex;
                        this.list.status = true;
                        this.list.msg = '';
                    } else {
                        return Promise.reject(res.message);
                    }
                }).catch(msg=>{
                    if (typeof msg !== 'string') {
                        if (msg.status === 401) {
                            msg = '您没有登录';
                        } else if (msg.status === 403) {
                            msg = '您没有权限';
                        } else {
                            msg = '获取列表失败';
                        }
                    } else if (msg === ''){
                        msg = '获取列表失败';
                    }
                    this.list.status = false;
                    this.list.msg = msg;
                }).then(()=>{
                    this.list.loading = false;
                    this.$refs.search.stopSearching();
                });
            },
            /**
             * 搜索
             */
            search(form){
                Object.assign(this.form, form);
                this.getData();
            },
            /**
             * 修改当前页码后进行的操作
             */
            changePage(page){
                this.pageInfo.pageIndex = page;
                this.getData();
            },
            /**
             * 添加
             */
            add(){
                this.$store.dispatch('add');
                this.$router.push({path: '../operation/update', append: true});
            }
        },
        watch: {
            '$route.params.os': function() {
                this.getData();
            }
        },
        beforeRouteEnter(to, from, next){
            next(vm=> {
                var operateType = vm.$store.state.operateType;

                if (operateType === 'update' || operateType === 'add') {
                    vm.getData();
                }
            });
        }
    };
</script>
