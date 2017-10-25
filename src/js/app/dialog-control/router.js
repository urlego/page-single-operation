/**
 * @author rubyisapm
 */
import App from './component/app.vue';
import VueRouter from 'vue-router';
import Update from './component/update';
import View from './component/view';
import List from './component/list';
import Operation from './component/operation';
export default new VueRouter({
    routes: [
        // 动态路径参数 以冒号开头
        {
            path: '/', redirect: '/android/list'
        },
        {
            path: '/:os',
            component: App,
            children: [{
                path: 'list',
                name: 'list',
                component: List,
                meta: {
                    keepAlive: true
                }
            }, {
                path: 'operation',
                component: Operation,
                meta: {
                    keepAlive: false
                },
                children: [{
                    path: 'update',
                    component: Update
                }, {
                    path: 'view',
                    component: View
                }]
            }]
        }
    ]
});
