<template>
  <el-form :model="form" label-width="auto" style="max-width: 600px">
    <el-form-item label="用户名">
      <el-input v-model="form.username"  @keyup.enter="onSubmit"/>
    </el-form-item>
        <el-form-item label="密码">
      <el-input v-model="form.password" @keyup.enter="onSubmit"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">登录</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { loginApi } from "@/http/user.ts"
import useUser from '@/store/user.ts'
// do not use same name with ref
const form = reactive({
  username: '',
  password: '',
})
const router = useRouter()
const onSubmit = () => {
    loginApi(form).then((res: any) => {
        const useUserFn = useUser()
        useUserFn.setUserInfo(res)
        router.push('/')
    })
}
</script>
