import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { useAuthStore } from './stores/authStore';
import { getActivePinia } from 'pinia';


// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    const pinia = getActivePinia();
    if (pinia) {
      const authStore = useAuthStore(pinia);
      const token = authStore.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  (response) => {
    return response;
  },
);

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(ElementPlus)
app.mount('#app')
