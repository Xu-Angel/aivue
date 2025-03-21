<template>
  <div id="app">
    <Lines ref="subwayTopo"></Lines>
  </div>
</template>

<script>
import GraphDemo from './components/GraphDemo.vue'
import Lines from './lines/index.vue'
import mock from './mock'
import { generateDataForLines } from './lines/utils/getNodeAndEdge'
export default {
  name: 'App',
  components: {
    GraphDemo,
    Lines
  },
  methods: {
    getlineData() {
      this.lingDataLoading = true
      const data = mock
      const lines = {}
      this.abnormalLine = data.alarmLines.sort((a, b) => a.presetLine - b.presetLine)
      data.traces.forEach(item => {
        let { nodes, edges, serviceLineConfig } = item
        const lineNum = Number(serviceLineConfig.presetLine)
        nodes = nodes.map(node => {
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
            color
          }
        })
        edges = edges.map(edge => {
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
            color
          }
        })
        lines[serviceLineConfig.presetLine] = {
          nodes,
          edges,
          serviceLineConfig
        }
        // 本地模拟20条
      })
      console.log(lines, 'lines')
      this.topoData = generateDataForLines(lines)
      this.linesData = lines
      console.log('this.topoData ', this.topoData)
      this.$refs.subwayTopo.refreshData(this.topoData)
    }
  },
  async mounted() {
    await this.$nextTick()
    this.getlineData()
  }
}
</script>

<style>
html,
body {
  height: 100%;
  width: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}
</style>
