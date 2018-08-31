import Vue from 'vue'
import vueResource from 'vue-resource'
import App from './App'

Vue.use(vueResource);

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
});
