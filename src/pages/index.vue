<template>
  <div class="map-container">
    <!-- 竖屏提示蒙层 -->
    <div class="orientation-overlay" v-show="isPortrait">
      <div class="overlay-content">
        <div class="rotate-icon">📱</div>
        <h2>请将手机横屏</h2>
        <p>为了获得最佳体验，请将您的设备旋转至横屏模式</p>
        <div class="rotate-animation">
          <div class="phone-icon">📱 → 📱</div>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content" :class="{ hidden: isPortrait }">
      <!-- 左侧地图区域 -->
      <div class="map-section">
        <div id="baidu-map" class="map-wrapper"></div>
      </div>

      <!-- 右侧内容区域 -->
      <div class="content-section">
        <!-- <img src="/src/pages/curve.png" alt="" class="curve-image" /> -->
        <!-- <div class="test1"></div> -->
        <!-- <div class="content-wrapper" @scroll="handleScroll" ref="contentRef">
          <div
            class="page-item"
            v-for="(page, index) in pages"
            :key="index"
            :data-page="index"
          >
            <div class="page-content">
              <h2>{{ page.title }}</h2>
              <p v-for="paragraph in page.content" :key="paragraph">
                {{ paragraph }}
              </p>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue'

// 当前页码
const currentPage = ref(0)
const contentRef = ref(null)
const isPortrait = ref(false)
let map = null

// 页面内容数据
const pages = ref([
  {
    title: '1812年 - 拿破仑东征',
    content: [
      '1812年，拿破仑率领60万大军远征俄国，这是历史上最著名的军事行动之一。',
      '这次远征标志着拿破仑帝国的转折点，从胜利走向衰落。',
      '大军从法国出发，穿越欧洲各国，目标直指莫斯科。',
      '然而，严酷的俄国冬季和顽强的抵抗让这支无敌的军队遭受了惨重的损失。',
    ],
  },
  {
    title: '进军莫斯科',
    content: [
      '经过数月的行军，拿破仑的军队终于抵达莫斯科。',
      '然而，他们发现的是一座空城，俄军采用了焦土战术。',
      '莫斯科的大火烧了三天三夜，整座城市几乎被夷为平地。',
      '拿破仑在克里姆林宫等待沙皇的投降书，但始终没有等到。',
    ],
  },
  {
    title: '痛苦的撤退',
    content: [
      '随着冬季的到来，拿破仑不得不下令撤退。',
      '撤退路上，寒冷、饥饿和俄军的不断袭击让法军损失惨重。',
      '原本60万的大军，最终只有不到3万人回到法国。',
      '这次失败的远征成为拿破仑政治生涯的重要转折点。',
    ],
  },
  {
    title: '历史的教训',
    content: [
      '拿破仑的俄国远征给后世留下了深刻的历史教训。',
      '它证明了即使是最强大的军队，也无法对抗严酷的自然环境。',
      '俄国人民的顽强抵抗精神在这次战争中得到了充分体现。',
      '这次远征的失败最终导致了拿破仑帝国的崩溃和他本人的流放。',
    ],
  },
])

// 定义自定义覆盖物的构造函数
function SquareOverlay(start, end) {
  this._start = start
  this._end = end
  this._isDraw = false
}
// 继承API的BMap.Overlay
SquareOverlay.prototype = new BMap.Overlay()
// 实现初始化方法
SquareOverlay.prototype.initialize = function (map) {
  // 保存map对象实例
  this._map = map
  const temp = `<div class="test1"></div>`
  const divFragment = document.createRange().createContextualFragment(temp)
  // 创建div元素，作为自定义覆盖物的容器
  var div = divFragment.querySelector('.test1')
  div.style.position = 'absolute'
  //   // 可以根据参数设置元素外观

  map.getPanes().markerPane.appendChild(div)
  // 保存div实例
  this._div = div
}
SquareOverlay.prototype.calculateAngle = function () {
  // 将经纬度从度转换为弧度
  let lat1 = (this._start.lat * Math.PI) / 180
  let lng1 = (this._start.lng * Math.PI) / 180
  let lat2 = (this._end.lat * Math.PI) / 180
  let lng2 = (this._end.lng * Math.PI) / 180

  // 计算方位角
  let angle = Math.atan2(
    Math.sin(lng2 - lng1) * Math.cos(lat2),
    Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1)
  )

  // 将弧度转换为角度
  angle = (angle * 180) / Math.PI

  // 调整角度范围 [0, 360)
  angle = (angle + 360) % 360

  return angle
}
// 实现绘制方法
SquareOverlay.prototype.draw = function () {
  if (this._isDraw) {
    return
  }

  var pixel1 = this._map.pointToPixel(this._start)
  var pixel2 = this._map.pointToPixel(this._end)
  var dx = pixel2.x - pixel1.x
  var dy = pixel2.y - pixel1.y
  var distance = Math.sqrt(dx * dx + dy * dy)
  this._div.style.setProperty('--distance', distance + 'px')

  // 根据地理坐标转换为像素坐标，并设置给容器
  const angle = this.calculateAngle()
  this._div.style.left = pixel1.x - 9.6 + 'px'
  this._div.style.top = pixel1.y - distance + 'px'
  this._div.style.transform = 'rotate(' + angle + 'deg)'
  this._div.style.setProperty('--rotation', angle + 'deg')
  this._div.style.setProperty('--scaleX', 0.2)
  this._isDraw = true
  debugger
}
// 初始化百度地图
const initMap = () => {
  if (typeof BMap !== 'undefined') {
    map = new BMap.Map('baidu-map')
    const point = new BMap.Point(116.404, 39.915) // 北京坐标
    map.centerAndZoom(point, 6)
    map.enableScrollWheelZoom(true)
    // 添加自定义覆盖物
    //[106.575354, 29.558923] [39.906217, 116.3912757] 40.8337963, 111.6730788
    var mySquare = new SquareOverlay(
      new BMap.Point(111.6730788, 40.8337963),
      new BMap.Point(116.404, 39.915)
    )
    var mySquare1 = new SquareOverlay(
      new BMap.Point(106.575354, 40.8337963),
      new BMap.Point(116.404, 39.915)
    )
    var mySquare2 = new SquareOverlay(
      new BMap.Point(106.5478767, 29.5647398),
      new BMap.Point(116.404, 39.915)
    )
    map.addOverlay(mySquare)
    map.addOverlay(mySquare1)
    map.addOverlay(mySquare2)
  } else {
    console.warn('百度地图API未正确加载，请检查网络连接或API密钥')
  }
}

onMounted(() => {
  // 如果初始就是横屏，则初始化地图
  if (!isPortrait.value) {
    nextTick(() => {
      setTimeout(initMap, 100)
    })
  }
})
</script>

<style>
.map-container {
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

/* 竖屏提示蒙层 */
.orientation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.overlay-content {
  text-align: center;
  color: white;
  padding: 32px;
}

.rotate-icon {
  font-size: 64px;
  margin-bottom: 24px;
  animation: rotate 2s ease-in-out infinite;
}

.overlay-content h2 {
  font-size: 32px;
  margin-bottom: 16px;
  font-weight: bold;
}

.overlay-content p {
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 32px;
  opacity: 0.9;
}

.rotate-animation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.phone-icon {
  font-size: 24px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes rotate {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-15deg);
  }
  75% {
    transform: rotate(15deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* 主内容区域 */
.main-content {
  display: flex;
  height: 100vh;
  width: 100vw;
  transition: opacity 0.3s ease;
}

.main-content.hidden {
  opacity: 0;
  pointer-events: none;
}

.map-section {
  flex: 1;
  height: 100%;
  position: relative;
}

.map-wrapper {
  width: 100%;
  height: 100%;
}

.content-section {
  flex: 1;
  height: 100%;
  position: relative;
  /* background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); */
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 图片动画样式 */
.curve-image {
  animation: scaleUp 2s linear forwards;
  transform: scaleY(0) scaleX(0.2);
  transform-origin: bottom;
}
.test1 {
  --rotation: 0deg;
  --distance: 10px;
  --scaleX: 0.2;
  background-image: url('/src/pages/curve.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  width: 0.1rem;
  height: var(--distance);
  animation: scaleUp 2s linear forwards;
  transform: rotate(var(--rotation)) scaleY(0);
  transform-origin: bottom;
}
@keyframes scaleUp {
  0% {
    /* 动画起始：保留旋转变量 + 缩放状态 */
    transform: rotate(var(--rotation)) scaleY(0);
    opacity: 0;
  }
  100% {
    /* 动画结束：保留旋转变量 + 最终缩放 */
    transform: rotate(var(--rotation)) scaleY(1);
    opacity: 1;
  }
}

.content-wrapper {
  height: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
  scroll-snap-type: y mandatory;
  /* 隐藏滚动条 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.content-wrapper::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.page-item {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  scroll-snap-align: start;
  padding: 32px;
  box-sizing: border-box;
}

.page-content {
  max-width: 90%;
  color: white;
  text-align: center;
}

.page-content h2 {
  font-size: 40px;
  margin-bottom: 32px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.05em;
}

.page-content p {
  font-size: 19px;
  line-height: 1.8;
  margin-bottom: 16px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.02em;
}

/* 中等屏幕横屏优化 */
@media (orientation: landscape) and (max-width: 1200px) {
  .page-content h2 {
    font-size: 35px;
  }

  .page-content p {
    font-size: 18px;
  }
}

/* 小屏幕横屏优化 */
@media (orientation: landscape) and (max-height: 600px) {
  .page-item {
    padding: 24px;
  }

  .page-content h2 {
    font-size: 32px;
    margin-bottom: 24px;
  }

  .page-content p {
    font-size: 16px;
    margin-bottom: 13px;
  }
}

/* 超小屏幕横屏优化 */
@media (orientation: landscape) and (max-height: 450px) {
  .page-item {
    padding: 16px;
  }

  .page-content h2 {
    font-size: 29px;
    margin-bottom: 16px;
  }

  .page-content p {
    font-size: 14px;
    margin-bottom: 10px;
  }
}
</style>
