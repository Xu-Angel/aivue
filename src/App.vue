<template>
  <div id="app">
     <div class="business-map-top" style="height: 48px; display: flex; justify-content: center; align-items: center">
      <!-- @timeChange="handleTimeChange"  -->
    <TimeSlider v-if="now" style="flex: 1" :now="now" :sliderAlarm="sliderAlarm" />
     </div>
 
    <div class="business-map-content">
      <Lines ref="subwayTopo"></Lines>
    </div>
  </div>
</template>

<script>
import GraphDemo from './components/GraphDemo.vue'
import Lines from './lines/index.vue'
import mock from './mock'
import alarmLine from './alarmLine'
import { generateDataForLines } from './lines/utils/getNodeAndEdge'
import TimeSlider from './timeSlider.vue'
export default {
  name: 'App',
  components: {
    GraphDemo,
    Lines,
    TimeSlider
  },
  data() {
    return {
      lingDataLoading: false,
      topoData: null,
      linesData: null,
      abnormalLine: [],
      now:new Date(),
      sliderAlarm:[...alarmLine]
    }
  },
  methods: {
    async getlineData() {
      this.lingDataLoading = true
      const data = mock
      const lines = {}
      this.abnormalLine = data.alarmLines.sort((a, b) => a.presetLine - b.presetLine)

      data.traces.forEach((item) => {
        let { nodes, edges, serviceLineConfig } = item
        const lineNum = Number(serviceLineConfig.presetLine)
        nodes = nodes.map((node) => {
          const isAbnormal = node.alarmPriority
          let color = ''
          if (isAbnormal) {
            // const level = this.PRIORITY_LEVEL.find(item => item.priorityId === node.alarmPriority)
            color = '#F55F5F'
          }
          return {
            ...node,
            id: `line-${lineNum}-${node.cmdbId}`,
            label: node.iconType === 'app_system' ? node.systemName : node.serviceName || node.name,
            isShowTooltip: node.iconType === 'app_service',
            color,
          }
        })
        edges = edges.map((edge) => {
          const isAbnormal = edge.alarmPriority
          const source = `line-${lineNum}-${edge.source}`
          const target = `line-${lineNum}-${edge.target}`
          let color = ''
          if (isAbnormal) {
            // const level = this.PRIORITY_LEVEL.find(item => item.priorityId === edge.alarmPriority)
            color = '#F55F5F'
          }
          return {
            ...edge,
            source,
            target,
            isAbnormal,
            isShowTooltip: edge.type !== 2,
            color,
          }
        })
        lines[serviceLineConfig.presetLine] = {
          nodes,
          edges,
          serviceLineConfig,
        }
        // 本地模拟20条
      })
      console.log(lines, 'lines')
      this.topoData = generateDataForLines(lines)
      this.linesData = lines

      // 确保数据完整性
      if (this.topoData && this.topoData.nodes && this.topoData.edges) {
        await this.$nextTick()
        this.$refs.subwayTopo.refreshData(this.topoData)
      } else {
        console.error('Topology data is incomplete:', this.topoData)
      }
    },
  },
  async mounted() {
    await this.$nextTick()
    this.getlineData()
  },
}
</script>

<style>
html,
body {
  height: 100%;
  width: 100%;
}
.business-map-content {
  flex: 1;
  position: relative;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
