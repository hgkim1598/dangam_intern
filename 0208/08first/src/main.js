// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router'

// createApp(App).use(router).mount('#app')

import { createApp } from 'vue'
import App from './App.vue'
import Board from './components/Board.vue' // Board 컴포넌트를 불러옴

const app = createApp(App)
// eslint-disable-next-line vue/multi-word-component-names
app.component('Board', Board) // Board 컴포넌트를 전역 컴포넌트로 등록
app.mount('#app')
