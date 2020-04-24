'use strict';
import App from "./App.vue";
import router from "./router";
import Vue from "vue";
import $ from 'expose-loader?$!jquery' // 内联loader
console.log('====13123123=====' + window.$);

require('../main');
// import 'isomorphic-fetch'

new Vue({
    el: "#app",
    router,
    template: '<App/>',
    components: { App },
    // render: function(createElement) {
    // 	window.$router = this.$router;
    // 	return createElement(App);
    // }
    render: h => h(App)
});
