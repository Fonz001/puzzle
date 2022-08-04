import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import PrimeVue from 'primevue/config'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import '@/scss/index.scss'

import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import ToastService from 'primevue/toastservice'

const app = createApp(App as any)

// Make our components available anywhere
const requireComponent = require.context('./', true, /[A-Z]\w+\.vue$/)
requireComponent.keys().forEach(fileName => {
  const match = fileName.match(/(\w+)\.\w+$/)
  if (match) app.component(match[1], requireComponent(fileName).default)
})

app.use(router)
app.use(ToastService)
app.use(PrimeVue)

app.component('InputText', InputText)
app.component('Dropdown', Dropdown)
app.component('Button', Button)
app.component('DataTable', DataTable)
app.component('Column', Column)

app.mount('#app')
