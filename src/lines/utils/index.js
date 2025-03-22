import G6 from '@antv/g6'

export function fittingString(str, maxWidth, fontSize = 12, singleline = false) {
  const ellipsis = '...'
  let currentWidth = 0
  let res = str
  const pattern = /[\u4e00-\u9fa5]/ // distinguish the Chinese characters and letters
  str.split('').forEach((letter, i) => {
    if (currentWidth > maxWidth) {
      if (pattern.test(letter)) {
        return
      }
      currentWidth += fontSize
    } else {
      // get the width of single letter according to the fontSize
      currentWidth += G6.Util.getLetterWidth(letter, fontSize)
    }
    if (currentWidth > maxWidth) {
      const line1 = str.substr(0, i)
      const line2 = str.substr(i).length > line1.length ? str.substr(i, line1.length - 3) + ellipsis : str.substr(i)
      res = singleline ? `${line1}${ellipsis}` : `${line1}\n${line2}`
    }
  })
  return res
}

// 高亮某个节点的链路
export const setHighlight = function (graph, item) {
  graph.getNodes().forEach(function (node) {
    graph.clearItemStates(node)
    if (node.id) {
      graph.setItemState(node, 'highlight', true)
    }
  })
}
// 清空状态
// 点击线操作，高亮整条线路和节点
export const setEdgeHighlight = (graph, item) => {
  const model = item.getModel()
  const highLightNodes = []
  graph.getEdges().forEach((edge) => {
    graph.clearItemStates(edge)
    const data = edge.getModel()
    if (data.lineNum === model.lineNum) {
      graph.setItemState(edge, 'highlight', true)
      highLightNodes.push(edge.getTarget().getModel(), edge.getSource().getModel())
    } else {
      graph.setItemState(edge, 'dark', true)
    }
  })
  graph.getNodes().forEach((node) => {
    graph.clearItemStates(node)
    const data = node.getModel()
    if (highLightNodes.some(({ id }) => id === data.id)) {
      graph.setItemState(node, 'highlight', true)
      graph.setItemState(node, 'dark', false)
    } else {
      graph.setItemState(node, 'dark', true)
    }
  })
}
// 点击线操作，高亮整条线路和节点
export const setSomeEdgeHighlight = (graph, edgeInstance) => {
  // 根据当前边来寻找到上下游边
  // 确定当前边的连接节点是否为真实的业务节点
  const model = edgeInstance.getModel()
  const sourceDataId = model.sourceDataId
  const targetDataId = model.targetDataId

  const nextTrueNodeId = model.nextTrueNodeId
  const previousTrueNodeId = model.previousTrueNodeId
  graph.getEdges().forEach((edge) => {
    graph.clearItemStates(edge)
    const data = edge.getModel()
    if (data.lineNum === model.lineNum) {
      if (data.sourceDataId === sourceDataId && data.targetDataId === targetDataId) {
        graph.setItemState(edge, 'highlight', true)
      } else {
        graph.clearItemStates(edge)
      }
    } else {
      graph.setItemState(edge, 'dark', true)
    }
  })
  graph.getNodes().forEach((node) => {
    graph.clearItemStates(node)
    graph.setItemState(node, 'dark', true)
    const data = node.getModel()
    if (data.lineNum === model.lineNum) {
      graph.setItemState(node, 'dark', false)
    } else {
      graph.setItemState(node, 'dark', true)
    }
  })
  const pre = graph.findById(nextTrueNodeId)
  const next = graph.findById(previousTrueNodeId)
  if (pre) {
    graph.setItemState(pre, 'highlight', true)
  }
  if (next) {
    graph.setItemState(next, 'highlight', true)
  }
}

// 清空状态
export const clearAllState = (graph, isClearAll = false) => {
  graph.setAutoPaint(false)
  graph.getNodes().forEach(function (node) {
    graph.clearItemStates(node)
  })
  graph.getEdges().forEach(function (edge) {
    graph.clearItemStates(edge)
  })
  graph.getCombos().forEach((combo) => {
    graph.clearItemStates(combo)
  })
  graph.paint()
  graph.setAutoPaint(true)
}

// 根据传入的节点、线条、蜂窝图节点进行高亮
export function handleHighlightNodes(highlightData, hoverEdge = false) {
  const graph = this.graph
  graph.setAutoPaint(false)
  const { nodes, edges } = highlightData
  graph.getNodes().forEach((node) => {
    const data = node.getModel()
    graph.clearItemStates(node)
    if (nodes.some((v) => v.id === data.id)) {
      graph.setItemState(node, 'highlight', true)
    } else {
      graph.setItemState(node, 'dark', true)
    }
  })

  graph.getEdges().forEach((edge) => {
    graph.clearItemStates(edge)
    const data = edge.getModel()
    if (edges.some((v) => v.source === data.source && v.target === data.target)) {
      graph.updateItem(edge, {
        label: data.highlightText || '',
        labelCfg: {
          style: {
            ...(data.labelCfg?.style || {}),
            opacity: 1,
          },
        },
      })
      graph.setItemState(edge.getTarget(), 'dark', false)
      graph.setItemState(edge.getSource(), 'dark', false)
      graph.setItemState(edge, 'running', true)
    } else {
      graph.updateItem(edge, {
        label: !data.isHide ? data.labelText : '',
        labelCfg: {
          style: {
            ...(data.labelCfg?.style || {}),
            opacity: 0.2,
          },
        },
      })
      graph.setItemState(edge, 'highlight', false)
      graph.setItemState(edge, 'dark', true)
    }
  })

  graph.getCombos().forEach((combo) => {
    graph.clearItemStates(combo)
    if (!nodes.some((v) => v.comboId === combo.getModel().id)) {
      graph.setItemState(combo, 'dark', true)
    }
  })

  graph.paint()
  graph.setAutoPaint(true)
  this.hoverEdge = hoverEdge
}
