/**
 * @author rubyisapm
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import router from './router';
import store from './store';
import Const from 'common/const';
import 'common/vue-filter';
import 'common.css';
new Vue({
    el: '#app',
    router,
    store,
    data: {
        os: '',
        buttonVisible: false
    },
    computed: {
        href(){
            return this.os === 'android' ? '#/ios/list' : '#/android/list';
        }
    },
    created(){
        this.os = this.$route.params.os;
        this.buttonVisible = this.$route.name === 'list';
        this.$store.dispatch('switchOs', Const.getKey('os', this.os));
    },
    watch: {
        '$route.params.os': function(os) {
            this.os = os;
            this.$store.dispatch('switchOs', Const.getKey('os', os));
        },
        '$route.name': function(name){
            this.buttonVisible = name === 'list';
        }
    }
});
