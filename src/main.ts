import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
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
  .use(Toast, {
    position: 'top-right',
    timeout: 3000,
    closeOnClick: true,
    pauseOnHover: true,
  })
  .mount('#app')