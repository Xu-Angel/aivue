<template>
  <div
    :class="{
      'is-fullscreen': isFullScreen,
      'is-empty': isEmpty,
      'is-show-map': isShowMap,
    }"
    class="subway-topo"
    ref="topologyRef">
    <div v-loading="loading" class="g6-container" id="g6Container" ref="g6ContainerRef"></div>

    <div class="empty-chart"></div>
    <div class="tools-container" ref="tools" v-if="configTools.length">
      <ul>
        <li v-if="configTools.includes('zoomIn')" title="放大" @click="handleToolbarClick('zoomIn')">
          <span>+</span>
        </li>
        <li v-if="configTools.includes('zoomOut')" title="缩小" @click="handleToolbarClick('zoomOut')">
          <span>-</span>
        </li>
        <li v-if="configTools.includes('fullscreen')" class="fullscreen" :title="this.isFullScreen ? '退出全屏' : '全屏'" @click="handleToolbarClick('fullscreen')">
          <i></i>
        </li>
        <li v-if="configTools.includes('center')" class="center" title="画布中心" @click="handleToolbarClick('center')">
          <i></i>
        </li>
        <!-- <template v-if="configTools.includes('map')">
          <li v-if="isShowMap" title="隐藏小地图" @click="handleToolbarClick('map')">
            <i style="color: #3f92fe" class="apIconfont iconlianludu"></i>
          </li>
          <li v-else title="显示小地图" @click="handleToolbarClick('map')">
            <i style="color: #98a302" class="apIconfont iconlianludu"></i>
          </li>
        </template> -->
      </ul>
    </div>
  </div>
</template>

<script>
import G6 from '@antv/g6'
import { setHighlight, clearAllState, setEdgeHighlight, setSomeEdgeHighlight } from './utils'
import registerG6 from './registerG6'
import _ from 'lodash'

export default {
  props: {
    lineData: {
      type: Object,
    },
    // 底部右侧工具栏
    configTools: {
      type: Array,
      default: () => ['center', 'zoomIn', 'zoomOut', 'fullscreen', 'map'],
    },
    hasAbnormalLine: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  data() {
    return {
      isShowMap: false,
      topologyOffset: null,
      isFullScreen: false,
      zoom: 1,
      minZoom: 0.01,
      maxZoom: 3,
      resizeObserver: null,
      isEmpty: true,
      loading: false,
      hoverEdge: true,
      graph: null,
      g6Data: null,
      tooltipShow: false,
      tooltipData: {},
      activedNode: null,
    }
  },
  watch: {
    zoom: {
      async handler(val, oval) {
        this.setZoomFontSize()
      },
    },
  },
  created() {
    registerG6()
  },
  mounted() {
    this.$nextTick(() => {
      this.initGraph()
    })
    this.$nextTick(() => {
      const parentEl = this.$refs.topologyRef
      this.topologyOffset = {
        width: parentEl.offsetWidth,
        height: parentEl.offsetHeight,
      }
      this.onListeningResize()
      window.addEventListener('mouseup', this.handleMouseup)
    })
  },
  beforeDestroy() {
    this.graph?.destroy()
    this.graph = null
    this.resizeObserver?.unobserve(this.$refs.topologyRef)
    this.resizeObserver.disconnect()
    window.removeEventListener('mouseup', this.handleMouseup)
  },
  methods: {
    async setZoomFontSize() {
      await this.$nextTick()
      const lineNums = [...new Set(this.g6Data.nodes.map((node) => node.lineNum))]
      const singleLine = lineNums.length === 1
      const zoom = this.zoom
      let fontSize = 12
      
      // 根据缩放比例计算字体大小
      if (zoom >= 1) {
        fontSize = 14
      } else if (zoom >= 0.9) {
        fontSize = singleLine ? 16 : 14
      } else if (zoom >= 0.8) {
        fontSize = singleLine ? 18 : 16
      } else if (zoom >= 0.7) {
        fontSize = singleLine ? 20 : 18
      } else if (zoom >= 0.6) {
        fontSize = singleLine ? 22 : 20
      } else if (zoom >= 0.5) {
        fontSize = singleLine ? 24 : 22
      } else {
        fontSize = singleLine ? 26 : 24
      }

      // 只更新需要变化的节点
      this.g6Data.nodes.forEach((node) => {
        if (node?.textAttrs?.fontSize) {
          const nodeModel = this.graph.findById(node.id).getModel()
          nodeModel.textAttrs.fontSize = fontSize
          this.graph.updateItem(node.id, {
            textAttrs: {
              ...nodeModel.textAttrs
            }
          })
        }
      })
      this.graph.refresh()
    },
    handleMouseup() {
      this.isDragging = false
      this.canDragCombo = false
    },
    initGraph() {
      const parentEl = this.$refs.topologyRef
      this.topologyOffset = {
        width: parentEl.offsetWidth,
        height: parentEl.offsetHeight,
      }
      const graph = new G6.Graph({
        container: this.$refs.g6ContainerRef,
        width: parentEl.offsetWidth,
        height: parentEl.offsetHeight,
        background: {
          color: '#f5f5f5',
        },
        layout: {
        },
        modes: {
          default: ['drag-canvas', 'zoom-canvas', 'click-select'],
        },
        nodeDraggable: false, // 启用节点拖动
        // 节点配置
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
        defaultNode: {
          labelCfg: {
            position: 'bottom',
            style: {
              fill: '#666',
            },
          },
        },
        // 线条配置
        defaultEdge: {
          style: {
            cursor: 'pointer',
          },
        },
        /* 不同状态下节点的样式 */
        nodeStateStyles: {
          highlight: {
            'node-highlight': {
              opacity: 1,
            },
          },
          dark: {
            opacity: 0.2,
            strokeOpacity: 0.2,
          },
        },
        /* 不同状态下边的样式 */
        edgeStateStyles: {
          highlight: {
            opacity: 1,
            strokeOpacity: 1,
            fillOpacity: 1,
          },
          dark: {
            opacity: 0.2,
            strokeOpacity: 0.2,
            fillOpacity: 0.2,
          },
        },
      })
      graph.on('canvas:click', () => {
        this.hoverEdge = true
        clearAllState(graph, null)
        this.activedNode = null
        this.$emit('clickCanvas')
      })
      graph.on('node:mouseenter', ({ item }) => {
        if (this.hoverEdge) {
          setHighlight.call(this, graph, item)
        }
      })
      graph.on('node:mouseleave', ({ item }) => {
        if (this.hoverEdge) {
          clearAllState(graph, true)
        }
      })
      graph.on('node:click', ({ item, target }) => {
        this.activedNode = item.getModel()
        clearAllState(graph, true)
        setHighlight.call(this, graph, item)
        this.hoverEdge = false
        // 高亮线路
        const edgeItem = this.g6Data.edges.find((edge) => edge.lineNum === this.activedNode.lineNum)
        this.setOneLineEdgeHighlight(edgeItem.id)
        // 高亮节点赋值，触发节点事件
        this.$emit('clickNode', {
          ...item.getModel(),
        })
      })
      graph.on('edge:click', ({ item }) => {
        this.handleSomeEdgeHighlight(item)
        this.hoverEdge = false
        let edgeData = item.getModel()
        if (edgeData.isShowTooltip) {
          return
        }
        const sourceNode = this.graph.findById(edgeData.previousTrueNodeId).getModel()
        const targetNode = this.graph.findById(edgeData.nextTrueNodeId).getModel()
        edgeData = {
          ...edgeData,
          isSection: true,
          sourceNode,
          targetNode,
        }
        this.$emit('clickEdge', edgeData)
      })
      // 监听缩放事件
      graph.on('wheelzoom', (e) => {
        this.zoom = this.graph.getZoom()
      })
      graph.on('afterrenderer', () => {
        console.log('afterrenderer')
        // 确保数据渲染完成后再调用fitView
        this.$nextTick(() => {
          this.zoom = graph.getZoom()
         
        })
      })
      
      graph.on('viewportchange', () => {
        // console.log('viewportchange')
        this.zoom = this.graph.getZoom()
      })
      this.graph = graph
   

         setTimeout(() => {
                   this.graph.fitView([20, 20, 20, 20])
              }, 100)   

    },
    refreshData(data) {
      if (data.nodes.length) {
        this.isEmpty = false
      }
      this.g6Data = this.transformData(data)
      this.graph.data(this.g6Data)
      this.graph.render()
    },
    transformData(data) {
      return {
        nodes: data.nodes.map((node) => {
          return {
            ...node,
          }
        }),
        edges: data.edges,
      }
    },
    /* 高亮整条线路 */
    setOneLineEdgeHighlight(id) {
      const edgeInstance = this.graph.findById(id)
      setEdgeHighlight(this.graph, edgeInstance)
    },
    /* 高亮整条线路 */
    handleSomeEdgeHighlight(edgeInstance) {
      setSomeEdgeHighlight(this.graph, edgeInstance)
    },
    handleBtnClick(data) {
      this.$emit('clickDetail', data)
    },
    handleToolbarClick(code) {
      switch (code) {
        case 'fullscreen':
          this.handleFullscreen()
          break
        case 'center':
          this.handleToCenter()
          break
        case 'zoomIn':
          this.zoom = +(this.zoom + 0.1).toFixed(2)
          this.graph.zoomTo(this.zoom)
          this.graph.fitCenter()
          break
        case 'zoomOut':
          this.zoom = +(this.zoom - 0.1).toFixed(2)
          this.graph.zoomTo(this.zoom)
          this.graph.fitCenter()
          break
        case 'map':
          this.isShowMap = !this.isShowMap
          break
      }
    },
    handleToCenter(zoom = 1) {
      this.zoom = zoom
      this.graph.zoomTo(zoom)
      this.graph.fitCenter()
    },
    async handleFullscreen() {
      // this.clearNodeAndEdgeState()
      // this.$emit('clickCanvas')
      this.isFullScreen = !this.isFullScreen
      await this.$nextTick()
      if (this.isFullScreen) {
        const { offsetWidth, offsetHeight } = this.$refs.topologyRef
        this.graph.changeSize(offsetWidth, offsetHeight)
      } else {
        this.graph.changeSize(this.topologyOffset.width, this.topologyOffset.height)
      }
      this.handleToCenter()
    },
    resizeCanvas() {
      setTimeout(() => {
        this.graph?.changeSize(this.$refs.topologyRef.offsetWidth, this.$refs.topologyRef.offsetHeight)
      }, 200)
    },
    onListeningResize() {
      this.resizeObserver = new ResizeObserver(
        _.debounce((entries) => {
          this.$refs.topologyRef && this.resizeCanvas()
        }, 100)
      )
      this.resizeObserver.observe(this.$refs.topologyRef)
    },
  },
}
</script>
<style lang="less" scoped>
.subway-topo::v-deep {
  width: 100%;
  height: 100%;
  position: relative;
  // background-color: #f7f9fb;
  user-select: none;
  background-image: radial-gradient(#e8eef4 8%, transparent 0);
  background-size: 14px 14px, 14px 14px;
  background-color: #f4f7fa;
  &.is-fullscreen {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100% !important;
    z-index: 100;
    .legend {
      bottom: 51px;
    }
  }
  &.is-empty {
    .empty-chart {
      display: block;
    }
    .tools-container {
      display: none;
    }
    .top-tools {
      display: none;
    }
    .zoom-slider-wrapper {
      display: none;
    }
    .g6-minimap {
      display: none !important;
    }
  }
  &.is-show-map {
    .g6-minimap {
      display: block;
    }
  }
  .g6-minimap {
    display: none;
    position: absolute;
    right: 60px;
    bottom: 15px;
    background: #fff;
    border-radius: 4px;
  }
  .tools-container {
    position: absolute;
    right: 15px;
    bottom: 15px;
    z-index: 2;
    background: #ffffff;
    border-radius: 4px;
    // box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    ul {
      position: static;
      width: 36px;
      padding: 0;
      border: none;
      margin: 0;
      li {
        float: none;
        width: 36px;
        height: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        background: #fff;
        cursor: pointer;
        font-weight: 600;
        overflow: hidden;
        i {
          display: inline-block;
          width: 16px;
          height: 16px;
          color: #98a3b2;
          font-size: 16px;
          font-weight: normal;
          line-height: 1;
          &:hover {
            color: #3f92fe;
          }
        }
        &.center {
          i {
            background: url('./assets/img/center.svg');
          }
        }
        &.fullscreen {
          i {
            background: url('./assets/img/fullscreen.svg');
          }
        }
        &.fruchterman {
          i {
            background: url('./assets/img/default-layout.svg');
          }
        }
        &.tree-top {
          i {
            background: url('./assets/img/tree-layout.svg');
          }
        }
        &.tree-left {
          i {
            background: url('./assets/img/tree-layout-left.svg');
          }
        }

        &:hover {
          i {
            transform: translateY(-36px);
            filter: drop-shadow(#3f92fe 0 36px);
          }
        }
      }
    }
    .center-btn {
      width: 36px;
      height: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      background: #fff;
      cursor: pointer;
      font-weight: 600;
      overflow: hidden;
      i {
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url('./assets/img/center.svg');
      }
      &:hover {
        i {
          transform: translateY(-36px);
          filter: drop-shadow(#3f92fe 0 36px);
        }
      }
    }
  }
  .g6-container {
    position: relative;
    z-index: 1;
    .g6-grid-container {
      background-color: #f4f7fa;
    }
    canvas {
      // 这个必须加，不然canvas高度不一致导致每次高度变化后，又触发高度计算死循环
      display: block;
    }
  }
  .empty-chart {
    display: none;
    position: absolute;
    width: 200px;
    height: 200px;
    left: 50%;
    top: 50%;
    z-index: 10;
    transform: translate(-50%, -50%);
    background-image: url('~@/assets/img/no-data.png');
    background-repeat: no-repeat;
    background-position: 50% 50%;
  }
}
</style>
