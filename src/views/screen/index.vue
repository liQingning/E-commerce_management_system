<template>
  <div class="container">
    <div class="screen" ref="screen">
      <!-- 顶部 -->
      <div class="top">
        <top></top>
      </div>
      <div class="bottom">
        <div class="left">
          <tourist class="tourist" :color="color"></tourist>
          <sex class="sex" :color="color"></sex>
          <age class="age" :color="color"></age>
        </div>
        <div class="center">
          <Map class="map" :color="color"></Map>
          <Line class="line" :color="color"></Line>
        </div>
        <div class="right">
          <commodity class="commodity" :color="color"></commodity>
          <salesvolume class="sales" :color="color"></salesvolume>
          <subscribe class="sbuscribe" :color="color"></subscribe>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Top from './components/top/index.vue'
import Tourist from './components/tourist/index.vue'

import Sex from './components/sex/index.vue'
import Age from './components/age/index.vue'
import Line from './components/line/index.vue'
import Map from './components/map/index.vue'
import Commodity from './components/commodity/index.vue'
import Subscribe from './components/subscribe/index.vue'
import Salesvolume from './components/salesvolume/index.vue'
const color = ref('rgb(94, 193, 2)')
const defaultThemeColor = 'rgb(94, 193, 2)' // 默认主题颜色
const imageUrl = ref('')
let screen = ref()
// 先从localStorage加载颜色和背景图片
const savedColor = localStorage.getItem('themeColor')
if (savedColor) {
  color.value = savedColor
} else {
  // 使用默认主题颜色
  color.value = defaultThemeColor
}
// 从localStorage读取保存的背景图片
const savedBackground = localStorage.getItem('backgroundImage')
if (savedBackground) {
  imageUrl.value = savedBackground
}

function getScale(w = 1920, h = 1080) {
  const wh = window.innerHeight / h
  const ww = window.innerWidth / w
  return Math.min(wh, ww)
}

onMounted(() => {
  // 应用主题色和背景图片
  toggleTheme()
  if (imageUrl.value) {
    applyBackgroundImage(imageUrl.value)
  }
  // 设置屏幕缩放
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%) `
})

window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%) `
}
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
const applyBackgroundImage = (imageUrl: string) => {
  document.body.style.backgroundImage = `url(${imageUrl})`
  document.body.style.backgroundSize = 'cover'
  document.body.style.backgroundPosition = 'center'
  document.body.style.backgroundRepeat = 'no-repeat'
}
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;

  .screen {
    position: fixed;
    width: 1920px;
    height: 1040px;
    border-radius: 25px;
    box-sizing: border-box;
    overflow: hidden;
    padding: 20px;
    background: var(--base-glass-bgcolor);
    backdrop-filter: $base-backdrop-filter;
    box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-right: 2px solid rgba(255, 255, 255, 0.2);
    border-bottom: 2px solid rgba(255, 255, 255, 0.2);
    left: 50%;
    top: 50%;
    transform-origin: left top;
    .top {
      width: 100%;
      height: 80px;
    }
    .bottom {
      width: 100%;
      height: calc(100% - 40px);
      display: flex;
      height: 100%;
      gap: 20px;
      .left {
        height: 917px;
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
        .tourist {
          flex: 1.3;
        }
        .sex {
          flex: 1;
        }
        .age {
          flex: 1;
        }
      }
      .center {
        flex: 2;
        height: 897px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 20px;
        .line {
          flex: 1;
        }
        .map {
          flex: 3;
        }
      }
      .right {
        height: 917px;
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
        .commodity {
          flex: 1.3;
        }
        .sbuscribe {
          flex: 1;
        }
        .sales {
          flex: 1;
        }
      }
    }
  }
}
</style>
