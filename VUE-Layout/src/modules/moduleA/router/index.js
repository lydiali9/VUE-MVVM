import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            component: () => import(/* webpackChunkName: "Home" */'../views/Index.vue')
        },
        {
            path: '/TabA',
            component: () => import(/* webpackChunkName: "Home" */'../views/TabA.vue')
        },
        // {
        //     path: '/TabB',
        //     component: () => import(/* webpackChunkName: "Home" */'../views/TabB.vue')
        // },
        {
            path: '/TabB_1',
            component: () => import(/* webpackChunkName: "Home" */'../views/TabB_1.vue')
        },
        {
            path: '/TabB_2',
            component: () => import(/* webpackChunkName: "Home" */'../views/TabB_2.vue')
        },
        {
            path: '/TabB_3',
            component: () => import(/* webpackChunkName: "Home" */'../views/TabB_3.vue')
        },
        {
            path: '/TabC',
            component: () => import(/* webpackChunkName: "Home" */'../views/TabC.vue')
        },
        {
            path: '/TabD',
            component: () => import(/* webpackChunkName: "Home" */'../views/TabD.vue')
        },
        {
            path: '/TabE',
            component: () => import(/* webpackChunkName: "Home" */'../views/TabE.vue')
        }
    ]
})
