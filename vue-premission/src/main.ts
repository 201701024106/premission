import './assets/main.css'

import { createApp } from 'vue'
import router from "./router/index.ts";
import App from './App.vue';
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css"
// 创建app 根组件加载到 #app DOM 上
const app = createApp(App)
const pinia = createPinia();
// 使用pinia
app.use(pinia);
// 使用路由器
app.use(router)
// 安装自定义指令
app.use(ElementPlus)
app.mount('#app')
type infoColor = 'success'|"error"|"warnning"|"info";

type Lod = {
    show:(intype?:infoColor,text?:string)=>void,
    hide:()=>void,
}
declare module "@vue/runtime-core"{
    export interface ComponentCustomProperties {
        _message: Lod;
    }
}