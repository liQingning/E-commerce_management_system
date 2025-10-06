<template>
  <div class="tabber">
    <div class="tabber-left">
      <el-icon @click="changeicon">
        <component :is="settingStore.fold ? 'Fold' : 'Expand'"></component>
      </el-icon>
      <!-- 面包屑 -->
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item
          :to="item.path"
          v-for="(item, index) in $route.matched"
          :key="index"
          v-show="item.meta.title"
        >
          {{ item.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 右侧按钮 -->
    <div class="tabber-right">
      <el-button icon="Refresh" circle @click="updateRefresh"></el-button>
      <el-button icon="FullScreen" circle @click="fullScreen"></el-button>
      <el-popover
        placement="bottom"
        title="主题设置"
        :width="300"
        trigger="click"
      >
        <el-form>
          <el-form-item label="主题颜色">
            <el-color-picker
              v-model="color"
              show-alpha
              :predefine="predefineColors"
              @change="toggleTheme"
              :teleported="false"
            />
          </el-form-item>
          <el-form-item label="暗黑模式" align="center">
            <el-switch
              v-model="dark"
              size="large"
              active-icon="MoonNight"
              inactive-icon="Sunny"
              inline-prompt
              @change="toggleDarkMode"
            />
          </el-form-item>
          <el-form-item label="上传背景图片">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :auto-upload="false"
              :on-change="handleAvatarSelect"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-form>
        <template #reference>
          <el-button icon="Setting" circle></el-button>
        </template>
      </el-popover>

      <img :src="userStore.avator" alt="" />
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userStore.username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown class="custom-dropdown">
          <el-dropdown-menu class="custom-dropdown-menu">
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { ArrowRight, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import useUserstore from '@/store/modules/user'
import useLayoutSettingStore from '@/store/modules/setting'
let settingStore = useLayoutSettingStore()
let $route = useRoute()
let $router = useRouter()
let userStore = useUserstore()
const color = ref('rgb(94, 193, 2) ')
let dark = ref<boolean>(false)
const imageUrl = ref('')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#409eff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(94, 193, 2)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])

const defaultThemeColor = 'rgb(94, 193, 2)' // 默认主题颜色

const toggleTheme = () => {
  const el = document.documentElement

  // 检查颜色值是否为空，如果为空则使用默认颜色
  const currentColor = color.value?.trim() || defaultThemeColor

  // 如果当前颜色与默认颜色不同，才更新color.value
  if (color.value?.trim() !== '') {
    color.value = currentColor
  } else {
    color.value = defaultThemeColor
  }

  // 设置主色
  el.style.setProperty('--el-color-primary', currentColor)

  // 计算并设置相关颜色变量，确保hover和禁用状态也能正确显示新主题色
  // 转换颜色为RGB格式以进行计算
  const rgb: any = hexToRgb(currentColor)
  if (rgb) {
    // 浅色系列（用于hover状态等）
    el.style.setProperty('--el-color-primary-light-3', lightenColor(rgb, 0.3))
    el.style.setProperty('--el-color-primary-light-5', lightenColor(rgb, 0.5))
    el.style.setProperty('--el-color-primary-light-7', lightenColor(rgb, 0.7))
    el.style.setProperty('--el-color-primary-light-9', lightenColor(rgb, 0.9))

    // 深色系列（用于active状态等）
    el.style.setProperty('--el-color-primary-dark-2', darkenColor(rgb, 0.2))

    // 禁用状态颜色
    el.style.setProperty(
      '--el-color-primary-disabled',
      `${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4`,
    )
  }

  // 保存主题颜色到localStorage
  localStorage.setItem('themeColor', currentColor)
}

// 默认背景图片URL

// 在组件挂载时，从localStorage读取保存的主题颜色和背景图片
onMounted(() => {
  const savedColor = localStorage.getItem('themeColor')
  if (savedColor) {
    color.value = savedColor
    // 应用保存的主题色
    toggleTheme()
  } else {
    // 使用默认主题颜色
    color.value = defaultThemeColor
    toggleTheme()
  }
  // 从localStorage读取保存的背景图片
  const savedBackground = localStorage.getItem('backgroundImage')
  if (savedBackground) {
    imageUrl.value = savedBackground
    // 应用背景图片
    applyBackgroundImage(savedBackground)
  }
})

// 辅助函数：将十六进制颜色转换为RGB对象
function hexToRgb(hex: string) {
  // 移除可能的 # 前缀
  hex = hex.replace(/^#/, '')

  // 处理RGB格式
  if (hex.startsWith('rgb')) {
    const rgbMatch = hex.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/)
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3]),
      }
    }
  }

  // 处理hex格式
  let r, g, b
  if (hex.length === 3) {
    // 简写hex格式: #RGB
    r = parseInt(hex[0] + hex[0], 16)
    g = parseInt(hex[1] + hex[1], 16)
    b = parseInt(hex[2] + hex[2], 16)
  } else if (hex.length === 6) {
    // 标准hex格式: #RRGGBB
    r = parseInt(hex.substring(0, 2), 16)
    g = parseInt(hex.substring(2, 4), 16)
    b = parseInt(hex.substring(4, 6), 16)
  }

  return r !== undefined ? { r, g, b } : null
}

// 辅助函数：提亮颜色
function lightenColor(
  rgb: { r: number; g: number; b: number },
  factor: number,
) {
  const r = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * factor))
  const g = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * factor))
  const b = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * factor))
  return `rgb(${r}, ${g}, ${b})`
}

// 辅助函数：加深颜色
function darkenColor(rgb: { r: number; g: number; b: number }, factor: number) {
  const r = Math.max(0, Math.floor(rgb.r * (1 - factor)))
  const g = Math.max(0, Math.floor(rgb.g * (1 - factor)))
  const b = Math.max(0, Math.floor(rgb.b * (1 - factor)))
  return `rgb(${r}, ${g}, ${b})`
}
const toggleDarkMode = () => {
  let html = document.documentElement
  if (dark.value) {
    html.className = 'dark'
  } else {
    html.className = ''
  }
}

const changeicon = () => {
  settingStore.fold = !settingStore.fold
}
const updateRefresh = () => {
  //location.reload();
  settingStore.refresh = !settingStore.refresh
}
const fullScreen = () => {
  let full = document.fullscreenElement
  if (full) {
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen()
  }
}
const logout = async () => {
  await userStore.userlogout()
  $router.push({ path: '/login', query: { redirect: $route.path } })
}

// 处理文件选择 (适配on-change回调)
const handleAvatarSelect = (uploadFile: any) => {
  console.log('Selected file:', uploadFile)

  // 直接获取文件对象
  let file = null
  if (uploadFile instanceof File) {
    file = uploadFile
  } else if (uploadFile && uploadFile.raw) {
    file = uploadFile.raw
  } else if (uploadFile && uploadFile.file) {
    file = uploadFile.file
  }

  console.log('Processed file:', file)

  // 执行上传前校验
  if (!beforeAvatarUpload(file)) {
    return
  }

  if (file) {
    try {
      // 使用FileReader将图片转换为Base64格式以持久化存储
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64Image = e.target?.result as string
        imageUrl.value = base64Image

        // 保存Base64格式的图片到localStorage
        localStorage.setItem('backgroundImage', base64Image)

        // 应用背景图片
        applyBackgroundImage(base64Image)

        // 显示上传成功提示
        ElMessage.success('背景图片上传成功')
      }
      reader.onerror = (error) => {
        console.error('FileReader error:', error)
        ElMessage.error('图片处理失败，请重试')
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Upload processing error:', error)
      ElMessage.error('上传处理失败，请重试')
    }
  } else {
    console.error('No valid file found')
    ElMessage.error('未找到有效的文件')
  }
}

// 上传前校验
const beforeAvatarUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'

  if (!isJPG) {
    ElMessage.error('上传头像图片只能是 JPG/PNG 格式!')
  }
  return isJPG
}

// 应用背景图片
const applyBackgroundImage = (imageUrl: string) => {
  document.body.style.backgroundImage = `url(${imageUrl})`
  document.body.style.backgroundSize = 'cover'
  document.body.style.backgroundPosition = 'center'
  document.body.style.backgroundRepeat = 'no-repeat'
}

defineOptions({
  name: 'Tabber',
})
</script>

<style scoped lang="scss">
.tabber {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  .tabber-left {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 20px;
    gap: 10px;
    transition: all 0.2s ease-in-out;
    .el-icon {
      width: 30px;
      height: 30px;
      font-weight: 700;
    }
    svg {
      font-weight: 700;
      width: 25px;
      height: 25px;
    }
    :deep(.el-breadcrumb) {
      width: 200px;
      height: 30px;
      display: flex;
      align-items: center;
    }
    :deep(.el-breadcrumb__inner) {
      font-size: 17px;
    }
    :deep(.el-breadcrumb__separator) {
      width: 20px;
      height: 20px;
      svg {
        font-weight: 700;
        font-size: 20px;
        color: var(--base-separator-icon-color);
      }
    }
  }
  .tabber-right {
    display: flex;
    align-items: center;
    padding-right: 20px;
    gap: 10px;
    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      object-fit: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
    :deep(.el-button) {
      width: 30px;
      height: 30px;
      margin: 0px;
      background: var(--base-glass-bgcolor);
      backdrop-filter: $base-backdrop-filter;
      box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.25);
      border: 1.5px solid rgba(255, 255, 255, 0.5);
      border-right: 1.5px solid rgba(255, 255, 255, 0.2);
      border-bottom: 1.5px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease-in-out;
      .el-icon {
        width: 20px;
        height: 20px;
        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
    :deep(.el-button:hover) {
      background-color: var(--base-menu-hover-bgcolor);
      backdrop-filter: $base-backdrop-filter;
    }

    :deep(.el-dropdown) {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 15px;
      width: auto;
      padding: 0px 10px;
      height: 30px;
      background: var(--base-glass-bgcolor);
      backdrop-filter: $base-backdrop-filter;
      box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.25);
      border: 1.5px solid rgba(255, 255, 255, 0.5);
      border-right: 1.5px solid rgba(255, 255, 255, 0.2);
      border-bottom: 1.5px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease-in-out;
    }
    :deep(.el-dropdown:hover) {
      background-color: var(--base-menu-hover-bgcolor);
      backdrop-filter: $base-backdrop-filter;
    }
    :deep(.example-showcase .el-dropdown-link) {
      cursor: pointer;
      color: var(--el-color-primary);
      display: flex;
      align-items: center;
    }
  }
}

// .el-dropdown-menu {
//
// }
// .el-dropdown-menu__item {
//
//   background: #ffffff53;
// }
:deep(.el-dropdown-menu__item:hover) {
  background: #ffffff00;
}
.custom-dropdown-menu {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 15px;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;

  height: 78px;
  text-align: center;
}
.avatar-uploader .avatar {
  height: 78px;
  display: block;
}
</style>
