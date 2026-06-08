import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import '@fontsource/inter'
import '@fontsource/nunito'
import './style.css'
import App from './App.vue'
import { router } from '@/app/router'


const pinia = createPinia()
const queryClient = new QueryClient()

createApp(App)
  .use(router)
  .use(pinia)
  .use(VueQueryPlugin, { queryClient })
  .mount('#app')