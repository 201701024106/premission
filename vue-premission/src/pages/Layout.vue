<template>
  <el-container style="height: 100vh; border: 1px solid #eee">
    <!-- 顶部导航栏 -->
    <el-header style="background-color: #b3c0d1; padding: 0 20px">
      <div class="header-content">
        <el-icon class="logo-icon"><Menu /></el-icon>
        <span class="logo-text">系统名称</span>

        <div class="header-right">
          <el-popover placement="top" width="40" trigger="click" v-model:visible="visible">
            <div style="text-align: right; margin: 0">
              <el-button size="small" type="text" @click="clickLogout">退出</el-button>
            </div>
            <!-- 使用 v-slot 或 #reference 替代 slot="reference" -->
            <template #reference>
              <el-avatar :size="32" class="avatar" style="cursor: pointer;">
                <img src="https://picsum.photos/200" alt="用户头像" />
              </el-avatar>
            </template>
          </el-popover>
        </div>
      </div>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px" style="background-color: #d3dce6">
        <leftmenu :data="data" :router="true" :defaultActive="currentPage"></leftmenu>
      </el-aside>

      <!-- 主内容区 -->
      <el-main style="padding: 20px; overflow-y: auto">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>当前页面：{{ route.meta.name }}</span>
            </div>
          </template>
          <div class="content">
            <router-view></router-view>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import leftmenu from "../components/leftmenu.vue";
import { computed, onMounted, reactive, ref } from "vue";
import useUser from "@/store/user";
import { useRouter, useRoute } from 'vue-router'
import usePremissionStore from "@/store/premission";
const useUserFn = useUser();

const router = useRouter()
const route = useRoute()

const premissionStore = usePremissionStore()
const visible = ref(false);
const data = reactive([]);
const currentPage = computed(() => route.path)
onMounted(() => {
    const menuList = premissionStore.menuList.map(fa => {
    return {
        name: fa.meta.name,
        index: fa.path,
        icon: "",
        children: fa.children.map(child => {
            return {
                icon: "",
                name: child.meta.name,
                index: child.path || '/',
            }
        })
    }
    })
    Object.assign(data, menuList)
})
const clickLogout = () => {
    visible.value = false;
    console.log("退出");
    useUserFn.clearUserInfo()
    premissionStore.SET_HAS_ADD_DYNAMIC_ROUTE(false);
    router.push('/login')
};
</script>

<style scoped>
.header-content {
  display: flex;
  align-items: center;
  height: 100%;
  justify-content: space-between;
}

.logo-icon {
  margin-right: 10px;
  font-size: 24px;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.avatar {
  cursor: pointer;
}

.content {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}
</style>
