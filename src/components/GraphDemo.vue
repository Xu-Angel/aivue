<template>
  <div class="graph-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>G6 图形示例</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="refreshGraph">刷新图形</el-button>
      </div>
      <div id="mountNode" ref="container"></div>
    </el-card>
  </div>
</template>

<script>
import G6 from '@antv/g6';

export default {
  name: 'GraphDemo',
  data() {
    return {
      graph: null
    };
  },
  mounted() {
    this.initGraph();
  },
  beforeDestroy() {
    if (this.graph) {
      this.graph.destroy();
    }
  },
  methods: {
    initGraph() {
      // 数据源
      const data = {
        nodes: [
          { id: 'node1', x: 100, y: 200, label: '节点1' },
          { id: 'node2', x: 300, y: 200, label: '节点2' },
          { id: 'node3', x: 200, y: 300, label: '节点3' }
        ],
        edges: [
          { source: 'node1', target: 'node2', label: '边1' },
          { source: 'node2', target: 'node3', label: '边2' },
          { source: 'node3', target: 'node1', label: '边3' }
        ]
      };

      // 创建 G6 图实例
      this.graph = new G6.Graph({
        container: this.$refs.container,
        width: 800,
        height: 500,
        modes: {
          default: ['drag-canvas', 'zoom-canvas', 'drag-node']
        },
        defaultNode: {
          size: 40,
          style: {
            fill: '#91d5ff',
            stroke: '#40a9ff',
            lineWidth: 2
          },
          labelCfg: {
            style: {
              fill: '#333',
              fontSize: 14
            }
          }
        },
        defaultEdge: {
          style: {
            stroke: '#91d5ff',
            lineWidth: 2,
            endArrow: {
              path: G6.Arrow.triangle(8, 10, 0),
              fill: '#91d5ff'
            }
          },
          labelCfg: {
            autoRotate: true,
            style: {
              fill: '#333',
              fontSize: 12
            }
          }
        }
      });

      // 加载数据
      this.graph.data(data);
      // 渲染图
      this.graph.render();
      // 居中显示
      this.graph.fitView();
    },
    refreshGraph() {
      if (this.graph) {
        this.graph.destroy();
      }
      this.$nextTick(() => {
        this.initGraph();
      });
    }
  }
};
</script>

<style scoped>
.graph-container {
  margin: 20px;
}
#mountNode {
  border: 1px solid #ebeef5;
  height: 500px;
  width: 100%;
}
</style>