import { createApp } from 'vue'
import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'
// import { toast } from 'vue3-toastify'
// import 'vue3-toastify/dist/index.css'

// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'

import Vue3Toastify from 'vue3-toastify';




// Create vue app
const app = createApp(App)
app.use(Vue3Toastify, {
    autoClose: 3000,
});


// Register plugins
registerPlugins(app)

// Mount vue app
app.mount('#app')
