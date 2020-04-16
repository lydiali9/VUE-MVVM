import App from "./App.vue"
import router from "./router"
import Vue from "vue"

require('../main')
// import 'isomorphic-fetch'

new Vue({
    el: "#app",
    router,
    template: '<App/>',
    components: { App },
    render: function(createElement) {
    	window.$router = this.$router;
    	return createElement(App);
    }
});
