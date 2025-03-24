import { LINE_COLORS, linesOthInfo, rectWidth, rectHeight, circleSize } from './const'
import { fittingString } from './index'
import _ from 'lodash'
import linesInfo from './linesInfo'
import {
  findPaths,
  findLongestPathsInResult,
  calculateDirection,
  findBestAnchorPoint,
  findValidPrevNode,
  checkStartPoint,
  getExtendedPoint,
  genPointpos,
  calculateSegmentDistances,
  findValidNextNode,
  calculateDistance,
  calculateNewCoordinate,
} from './tool'

/**
 * 根据节点走向设置当前节点的文字属性
 * @param {*} node
 * @param {*} prevNode
 * @returns
 */
function calculateTextAttrs({ node = {}, prevNode = {}, nodes = [], lineNumNodes = [] }) {
  const { nodeSize, isStartNode, shapeType, prevId, label, lineNum, isLastNode, isBrancheNode } = node
  const vGap = 8 // 竖向
  const hGap = 4 // 水平
  const direction = !isStartNode ? calculateDirection(prevNode, node) : ''
  const textAttrs = {
    x: shapeType === 'rect' ? nodeSize[0] / 2 : 0,
    y: shapeType === 'rect' ? nodeSize[1] / 2 - 5 : nodeSize / 2 + hGap,
    fontSize: 14,
    fill: '#333',
    text: '',
    textAlign: 'center', // 设置文本内容的当前对齐方式。支持的属性值：center / end / left / right / start。默认值为 start。
    textBaseline: 'top', // 设置在绘制文本时使用的当前文本基线。支持的属性值：top / middle / bottom。默认值为 bottom。
  }

  const maxWidth = isStartNode ? rectWidth - 30 : 77
  const text = fittingString(label, maxWidth, textAttrs.fontSize, true)
  textAttrs.text = text

  const directionMap = {
    N: () => {
      if (isBrancheNode) {
        if (isLastNode) {
          textAttrs.y = -vGap
          textAttrs.textBaseline = 'bottom'
        }
      } else {
        // noop
      }
    },
    S: () => {
      textAttrs.textAlign = 'left'
      textAttrs.textBaseline = 'middle'
      textAttrs.x = nodeSize / 2 + hGap
      textAttrs.y = 0
      if (isLastNode) {
        textAttrs.y = nodeSize + vGap
        textAttrs.textAlign = 'center'
        if (isBrancheNode) {
          textAttrs.y = 0
          textAttrs.x = nodeSize / 2 + hGap
          textAttrs.textAlign = 'left'
          textAttrs.textBaseline = 'middle'
          // noop
        } else {
          // noop
        }
      }
    },
    E: () => {
      if (isLastNode) {
        if (isBrancheNode) {
          // noop
        } else {
          textAttrs.textAlign = 'left'
          textAttrs.textBaseline = 'bottom'
          textAttrs.y = nodeSize / 2
          textAttrs.x = nodeSize / 2 + hGap
        }
      }
    },
    W: () => {
      // noop
    },
    ES: () => {
      textAttrs.text = text
      textAttrs.textAlign = 'left'
      textAttrs.textBaseline = 'bottom'
      textAttrs.y = nodeSize / 2
      textAttrs.x = nodeSize / 2 + hGap
      if (isLastNode) {
        // noop
      } else {
        const nextNode = findValidNextNode({ node, nextNodes: lineNumNodes })
        const nextDir = nextNode && calculateDirection(node, nextNode)
        if (nextDir === 'E' || nextDir === 'W') {
          textAttrs.y = nodeSize + vGap
          textAttrs.textAlign = 'center'
        }
      }
    },
    WS: () => {
      textAttrs.textAlign = 'left'
      textAttrs.textBaseline = 'bottom'
      textAttrs.y = nodeSize / 2
      textAttrs.x = nodeSize / 2 + hGap

      if (isLastNode) {
        if (isBrancheNode) {
          textAttrs.textAlign = 'center'
          textAttrs.textBaseline = 'bottom'
          textAttrs.y = nodeSize + vGap + 4
          textAttrs.x = 0
        } else {
          // noop
        }
      }
    },
    EN: () => {
      textAttrs.textAlign = 'left'
      textAttrs.textBaseline = 'bottom'
      textAttrs.y = nodeSize / 2
      textAttrs.x = nodeSize / 2 + hGap
    },
    WN: () => {
      textAttrs.textAlign = 'left'
      textAttrs.y = -nodeSize / 2
      textAttrs.x = nodeSize / 2 + hGap

      if (isLastNode) {
        if (isBrancheNode) {
          textAttrs.textAlign = 'center'
          textAttrs.textBaseline = 'top'
          textAttrs.y = -nodeSize - vGap
          textAttrs.x = 0
        } else {
          // noop
        }
      }
    },
  }

  if (directionMap[direction]) {
    directionMap[direction]()
  }
  return textAttrs
}

/*
传入原始的脚本提取的路线节点数据，返回扩充真实节点后的节点数据
* @param {} points 脚本提取的路线节点数据
* @param {} trueNodes 后端返回的真实节点的数据
* @returns Array
*/
function generateTruePoints(points = [], trueNodes = [], lineKey = '') {
  points.forEach((item) => {
    item.isC = item.directiveObj.directive.toUpperCase() === 'C'
    item.length = 0
    item.partsNum = 0
  })
  const totalNumPoints = trueNodes.length
  const npoints = JSON.parse(JSON.stringify(points)) // 复制原始指令数组
  // 1.计算每个指令对象实际渲染的线段长度
  npoints.forEach((item, index) => {
    // 存储后端数据id
    item.dataId = null
    // 跳过trueNode 或者 C指令
    if (['trueNode'].includes(item.type) || item.isC) {
      return
    }
    // 如果是最后一个点，直接返回
    // if (!item.nextId) return
    // 计算当前指令对象描绘的线段的长度
    let length = 0
    const prev = npoints[index - 1]
    // const next = npoints[index + 1]
    // const directive = item.directiveObj.directive
    // 不要贝塞尔曲线 先直接过滤掉 然后当做直线来算贝塞尔曲线的指令点一律忽略 当做0
    // 第一个点跳过，没有prev
    if (!prev) return
    length = calculateDistance(prev, item)
    item.length = length
  })
  // 2.每个指令对象相加，得出整个指令数组渲染的线的长度
  const totalLength = npoints.filter((item) => +item.length > 0).reduce((acc, item) => acc + +item.length, 0)
  // console.log('整个指令数组渲染的线的长度为：${totalLength}', totalLength)
  // 2-1.计算每个指令对象的长度占整个指令数组渲染的线的长度的百分比
  npoints.forEach((item) => {
    item.startPercent = 0
    item.endPercent = 0
    if (item.length) {
      item.percent = item.length / totalLength
    }
  })
  // 3.根据传入的totalNumPoints计算得出分别要落在哪个百分比上，就可以得出落在哪个指令对象的区间上
  // 3-1.计算出每个指令对象的百分比区间
  const lenpoints = npoints.filter((item) => item.length)
  lenpoints.forEach((item, index) => {
    const idx = npoints.findIndex((n) => n.id === item.id)
    npoints[idx].startPercent = lenpoints[index - 1]?.endPercent || 0
    npoints[idx].endPercent = npoints[idx].startPercent + npoints[idx].percent
  })
  // 3-2.计算出新增点落在哪指令对象的区间上,使用百分比来平均分配新增点
  let firstPointPercentOffset = 0
  for (let i = 0; i < totalNumPoints; i++) {
    const id = trueNodes[i].id // 新生成的点的起始ID
    const denominator = totalNumPoints
    const numerator = i + 1
    let percent = numerator / denominator
    const targetIndex = npoints.findIndex((item) => item.startPercent <= percent && item.endPercent >= percent) // 实际的逻辑标点，用于连接关系
    let target = npoints[targetIndex]
    // 3-3.根据新增点落在的百分比位置，计算出新增点的坐标
    // 如果百分比为1，则新增点的坐标就是目标点的坐标
    const nObj = {
      ...trueNodes[i],
      // 保存后端的数据
      data: {
        ...trueNodes[i].data,
      },
      id: id,
      dataId: trueNodes[i].id, // 后端数据的id
      prevId: null, // 先不设置
      nextId: null,
      x: null, // 新生成的点的X坐标
      y: null, // 新生成的点的Y坐标
      type: 'trueNode', // 新生成的点用于填充真实业务数据
    }
    // 两个节点及以上 第一个节点要靠近标号
    // 找到抹去用来标号的起始节点，开始寻找第一个不是贝塞尔曲线的节点
    if (i === 0 && totalNumPoints > 1) {
      // 计算是否需要额外调整到节点开关
      target = !npoints[1].isC ? npoints[1] : npoints[2]
      // 插入新生成的点
      const left = npoints[0]
      const right = target
      const x1 = left.x
      const y1 = left.y
      const x2 = right.x
      const y2 = right.y
      // 默认延伸70距离
      const disc = +(linesOthInfo[lineKey].startPointDisc ?? 0) + 70
      const { x, y, precent: t } = getExtendedPoint(left, right, disc)
      // 如果原本计算的第一个节点就在他的前面往右移动 后面的也要加上偏差往右移动
      if (target.endPercent * t > percent) {
        firstPointPercentOffset = target.endPercent * t - percent
      }
      nObj.x = x
      nObj.y = y
      if (x1 === x2 || y1 === y2) {
        nObj.anchorPoints = [findBestAnchorPoint(left, right)]
      }
      nObj.extraInfo = { percent, prev: npoints[0], target, t }
      npoints.splice(1, 0, nObj)
    } else if (i === totalNumPoints - 1) {
      // 最后一个点
      target = npoints[npoints.length - 1]
      // 插入新生成的点
      nObj.x = target.x
      nObj.y = target.y
      npoints.push(nObj)
    } else {
      // 如果百分比不为1，则新增点的坐标需要根据目标点的类型来计算
      // 边界处理补上第一个节点百分比偏差
      percent = Math.min(firstPointPercentOffset + percent, 0.9999)
      // 寻找逻辑点的前一个点
      const prev = npoints.find((item) => item.id === target.prevId) || {}
      // 新生成的点的位置
      // 这个点t在区间百分比
      const t = (percent - target.startPercent) / (target.endPercent - target.startPercent)
      const { x, y, isBias, dir } = genPointpos({ prev, target, t })
      nObj.x = x
      nObj.y = y
      nObj.isBias = isBias
      nObj.dir = dir
      nObj.extraInfo = { percent, prev, target, t }
      // 插入新生成的点在目标点的前面
      npoints.splice(targetIndex, 0, nObj)
      target.partsNum++
      nObj.partsNum = target.partsNum
    }
  }
  // 更新新的指令数组的前后id关系
  npoints.forEach((item, index) => {
    item.id = `${lineKey}-${item.id}`
    if (item.nextId) {
      item.nextId = `${lineKey}-${item.nextId}`
    }
    if (item.prevId) {
      item.prevId = `${lineKey}-${item.prevId}`
    }
  })
  npoints.forEach((item, index) => {
    if (index === 0) {
      item.prevId = null
      item.nextId = npoints[index + 1].id
    } else if (index === npoints.length - 1) {
      item.prevId = npoints[index - 1].id
      item.nextId = null
    } else {
      item.prevId = npoints[index - 1].id
      item.nextId = npoints[index + 1].id
    }
  })
  // 返回新生成的指令数组
  return npoints
}
// 严格按照预设路线和每条预设路线的节点数来生成画布数据
export const generateDataForLines = function (linesObj) {
  // 本个地图所有节点
  const nodes = []
  // 本个地图所有边
  const edges = []
  // 所有的线路序号
  const lineKeys = []
  // 遍历进去每个路线对象 一条一条的生成
  for (const lineKey in linesObj) {
    if (linesObj[lineKey] === null) {
      continue
    }
    lineKeys.push(lineKey)
    const lineObj = _.cloneDeep(linesObj[lineKey])
    const lineIdx = lineKeys.length - 1
    lineObj.nodes = lineObj?.edges?.length
      ? lineObj.nodes.filter((item) => {
          return lineObj.edges.some(({ source, target }) => item.id === source || item.id === target)
        })
      : lineObj.nodes

    lineObj.edges = lineObj.edges.filter(({ source, target }) => {
      const sourceFlag = lineObj.nodes.some(({ id }) => id === source)
      const targetFlag = lineObj.nodes.some(({ id }) => id === target)
      return sourceFlag && targetFlag
    })
    const pathsInResult = findPaths(lineObj)

    const pathObj = findLongestPathsInResult(pathsInResult)
    let longestPathIds = []
    Object.entries(pathObj).forEach(([key, value]) => {
      if (value && value.length > longestPathIds.length) {
        longestPathIds = value
      }
    })
    // 处理nodes更新成一条主干线路 按照最长的路径生成主干节点数据
    const mainDataNodes = longestPathIds.map((id) => {
      return lineObj.nodes.find((node) => node.id === id)
    })
    const branchDataNodes = _.cloneDeep(lineObj.nodes.filter(({ id }) => !longestPathIds.includes(id)))

    // 主干线路节点
    const mainNodes = []
    const mainEdges = []
    const branchNodes = []
    const branchEdges = []
    // 需要渲染的真实业务节点
    // 从脚本生成的路线数据中塞入业务路线的数据
    const mainPoints = generateTruePoints(linesInfo[lineKey].pathsArr, mainDataNodes, lineKey)
    // 设置业务节点对象的信息
    // 按照主线路节点对象的信息排第几号线路，后面base节点为0 0的看不见节点，业务节点渲染为可见的图形UI节点
    // 根据需要渲染的真实业务节点的个数来调用生成节点函数生成对应的节点数据
    /**
     * 生成基础节点数据
     */
    const getDefNodeObj = (point, isStartNode, isBrancheNode) => {
      return {
        isStartNode: isStartNode,
        nodeSize: isStartNode ? [rectWidth, rectHeight] : circleSize,
        healthColor: point.color || LINE_COLORS[lineIdx].color,
        lineColor: point.color || LINE_COLORS[lineIdx].color,
        lineNum: Number(lineKey), // 第几号线
        lineName: lineObj.serviceLineConfig.name,
        isBrancheNode: isBrancheNode,
        isShowNodeTip: point.isShowTooltip ?? true,
        style: {
          lineDash: isStartNode ? [3, 2] : null,
        },
      }
    }
    /**
     * 生成基础边数据
     */
    const getDefEdgeObj = (edgeData, isBranch, prevPoint) => {
      const color = edgeData.color || LINE_COLORS[lineIdx].color
      return {
        ...edgeData,
        edgeId: edgeData.id,
        edgeData: edgeData,
        lineNum: Number(lineKey),
        lineName: lineObj.serviceLineConfig.name,
        lineColor: LINE_COLORS[lineIdx].color,
        color: color,
        style: {
          lineWidth: isBranch ? 3 : 5,
          color,
          cursor: 'pointer',
          lineDash: prevPoint.isStartNode ? [3, 2] : null,
        },
      }
    }
    const { offsetX, offsetY } = checkStartPoint(mainPoints, linesOthInfo[lineKey].startXY)
    const xFactor = linesOthInfo[lineKey].xFactor ?? 1
    const yFactor = linesOthInfo[lineKey].yFactor ?? 1
    // 处理主干节点
    mainPoints.forEach((point, index) => {
      // 加上偏移
      const isStartNode = index === 0
      point.x = point.x + offsetX
      point.y = point.y + offsetY
      point.offsets = {
        x: offsetX,
        y: offsetY,
      }
      point.x = !isStartNode ? point.x : point.x - xFactor * (rectWidth / 2)
      point.y = !isStartNode ? point.y : point.y - yFactor * (rectHeight / 2)
      const label = isStartNode ? `${lineKey}.${lineObj.serviceLineConfig.name}` : point.label || ''
      // 在边的关系中找他的前后节点
      const prevDataId = lineObj.edges.find(({ source, target }) => target === point.dataId)?.source
      const nextDataId = lineObj.edges.find(({ source, target }) => source === point.dataId)?.target
      mainNodes.push({
        ...point,
        ...getDefNodeObj(point, isStartNode, false),
        label,
        prevDataId,
        nextDataId,
        pathsData: { ...point },
        shapeType: isStartNode ? 'rect' : point.type === 'trueNode' ? 'circle' : 'rect',
        type: isStartNode ? 'stationNode' : point.type === 'trueNode' ? 'stationNode' : 'pathNode',
      })
    })
    // 处理主干边
    let previousDataId, targetDataId, previousTrueNodeId, nextTrueNodeId
    // 处理主干边
    mainNodes.forEach((node, index) => {
      if (index > 0) {
        const previousNode = mainNodes[index - 1]
        let edgeData = { isShowTooltip: true }
        const isStationNode = node.type === 'stationNode'
        if (previousDataId) {
          if (!isStationNode) {
            const stationNodes = mainNodes.filter((item) => item.type === 'stationNode')
            const tIdx = stationNodes.findIndex((item) => item.dataId === previousDataId)
            targetDataId = stationNodes[tIdx + 1].dataId
            nextTrueNodeId = stationNodes[tIdx + 1].id
          } else {
            targetDataId = node.dataId
            nextTrueNodeId = node.id
          }
        }
        edgeData = _.cloneDeep(lineObj.edges.find(({ source, target }) => source === previousDataId && target === targetDataId)) || { isShowTooltip: true }

        const prevPoint = mainNodes[index - 1]
        const nextPoint = mainNodes[index]

        const edgeObj = {
          ...getDefEdgeObj(edgeData, false, prevPoint),
          pathsData: { useES: true, offsets: { x: 0, y: 0 }, prevPoint, nextPoint },
          id: `${previousNode.id}-${nextPoint.id}`, // 66用于渲染逻辑
          source: previousNode.id, // 66用于渲染逻辑
          target: node.id, // 66用于渲染逻辑
          dataId: `${previousDataId} to ${targetDataId}`,
          sourceDataId: previousDataId, // 边链接的上一业务节点的id
          previousTrueNodeId: previousTrueNodeId, // 边链接的上一业务节点的id
          targetDataId: targetDataId, // 边链接的下一业务节点的id
          nextTrueNodeId: nextTrueNodeId, // 边链接的下一业务节点的id
          type: node?.directiveObj?.directive?.toUpperCase() === 'C' || node.isBias ? 'customEdge' : 'baseEdge',
        }
        mainEdges.push(edgeObj)
        if (isStationNode) {
          previousDataId = node.dataId
          previousTrueNodeId = node.id
        }
      }
    })
    // 处理分支节点填充数据
    branchDataNodes.forEach((item, index) => {
      // 在边的关系中找他的前后节点
      const prevDataId = lineObj.edges.find(({ source, target }) => target === item.id)?.source
      const nextDataId = lineObj.edges.find(({ source, target }) => source === item.id)?.target
      // console.log(item.id, prevDataId, nextDataId)
      branchNodes.push({
        data: {
          ...item,
        },
        ...item,
        ...getDefNodeObj(item, false, true),
        dataId: item.id,
        id: `${lineKey}-${item.id}`,
        prevId: prevDataId ? `${lineKey}-${prevDataId}` : null,
        prevDataId: prevDataId,
        nextId: nextDataId ? `${lineKey}-${nextDataId}` : null,
        nextDataId: nextDataId,
        pathsData: { offsets: { x: 0, y: 0 } },
        shapeType: 'stationNode',
        type: 'stationNode',
      })
    })
    /**
     * 处理还没生成坐标的分支节点
     * @param {*} doneNodes 已经有坐标了的节点
     * @param {*} beRelatNodes 还没有坐标的节点
     * @param {*} doneDataIds 已经有坐标了的节点dataId数组
     */
    const loop = (doneNodes = [], beRelatNodes = [], doneDataIds = []) => {
      if (!beRelatNodes.length) return
      // 从已经完成的节点中寻找未完成的节点的关系
      doneNodes.forEach((done) => {
        // 寻找和他有关联的节点
        const relatesDataIds = beRelatNodes
          .filter((be) => !doneDataIds.includes(be.dataId))
          .filter((be) => be.prevDataId === done.dataId || be.nextDataId === done.dataId)
          .map((r) => r.dataId)
        // 先找到done的前一个点 和前一个确定走向
        if (!relatesDataIds.length) return
        const prevRelateDoneNode = findValidPrevNode({ node: done, prevNodes: doneNodes, findRelate: true })
        const direction = calculateDirection(prevRelateDoneNode, done)
        // 计算坐标
        beRelatNodes.forEach((r, index) => {
          if (!relatesDataIds.includes(r.dataId)) {
            return
          }
          // 分支节点位置生成设计
          const distance = 100 // 连线距离
          const baseAngle = {
            N: 90, // 北
            S: 270, // 南
            E: 0, // 东
            W: done?.extraInfo?.percent > 0.3 ? 360 : 180, // 西
            ES: 45, // 东南
            WS: 135, // 西南
            EN: 225, // 东北
            WN: 90, // 西北
          }
          // 计算角度区间
          const angleInterval = 45 // 45度一个区间
          // 调整角度，避开主干节点的垂直方向
          const startAngle = 35
          const angle = baseAngle[direction] + startAngle + index * angleInterval
          const newPos = calculateNewCoordinate(done, distance, angle)
          console.log('newPos', newPos)
          r.x = newPos.x
          r.y = newPos.y
        })
        // 处理完后继续递归处理 直到都设置好坐标
        const newDone = beRelatNodes.filter((r) => relatesDataIds.includes(r.dataId))
        const nextBeRelatNodes = beRelatNodes.filter((r) => !relatesDataIds.includes(r.dataId))
        doneDataIds.push(...relatesDataIds)
        loop([...doneNodes, ...newDone], nextBeRelatNodes, doneDataIds)
      })
    }
    const doneDataIds = mainNodes.map((m) => m.dataId)
    loop(mainNodes, branchNodes, doneDataIds)
    // 处理分支边
    // 在后端返回的数据中排除掉已经处理好的主干边，剩下的即分支相关的边
    const branchNodesDataIds = branchNodes.map((b) => b.dataId)
    const bnEdges = lineObj.edges.filter((e) => branchNodesDataIds.includes(e.source) || branchNodesDataIds.includes(e.target))
    bnEdges.forEach((edge) => {
      const prevPoint = mainNodes.find((n) => n.dataId === edge.source) || branchNodes.find((n) => n.dataId === edge.source) || { x: 0, y: 0 }
      const nextPoint = mainNodes.find((n) => n.dataId === edge.target) || branchNodes.find((n) => n.dataId === edge.target) || { x: 0, y: 0 }
      const edgeObj = {
        ...getDefEdgeObj(edge, true, prevPoint),
        pathsData: { useES: true, offsets: { x: 0, y: 0 }, prevPoint, nextPoint },
        id: `${prevPoint.id}-${nextPoint.id}`, // 66用于渲染逻辑
        source: prevPoint.id, // 66用于渲染逻辑
        target: nextPoint.id, // 66用于渲染逻辑
        dataId: `${prevPoint.dataId} to ${nextPoint.dataId}`,
        sourceDataId: prevPoint.dataId, // 边链接的上一业务节点的id
        previousTrueNodeId: prevPoint.id, // 边链接的上一业务节点的id
        targetDataId: nextPoint.dataId, // 边链接的下一业务节点的id
        nextTrueNodeId: nextPoint.id, // 边链接的下一业务节点的id
        type: 'baseEdge',
      }
      branchEdges.push(edgeObj)
    })
    edges.push(...mainEdges, ...branchEdges)
    nodes.push(...mainNodes, ...branchNodes)
  }
  // console.log(nodes)
  // console.log(edges)
  // 处理通用数据
  nodes.forEach((node) => {
    // 按照序号顺序来处理
    const { isBrancheNode, nodeSize, isStartNode, nextId, prevId, label, shapeType, lineNum } = node
    node.isLastNode = (!nextId || !prevId) && !isStartNode
  })
  nodes.forEach((node) => {
    const { isStartNode, isLastNode, isBrancheNode, nextId, prevId, extraInfo, lineNum } = node
    // 节点检验位置调整
    if ((nextId || prevId) && !isStartNode) {
      const loop = (times = 0) => {
        if (times > 1) return
        times++
        let needLoop = false
        // 处理主干节点的碰撞
        const mainLastNodes = nodes.filter((n) => !n.isLastNode && n.isBrancheNode)
        nodes.forEach((node) => {
          const { isBrancheNode, isStartNode, isLastNode, type, x, y, extraInfo } = node
          const { prev, distance, i } = extraInfo || {}
          if (isBrancheNode && !isStartNode && !isLastNode && type === 'stationNode' && prev) {
            // 判断这个点是否有冲突了
            mainLastNodes.forEach((m) => {
              // extraInfo
              const { x, y } = m
              const dis = calculateDistance({ x, y }, m)
              if (dis < 35) {
                const newDis = calculateDistance(prev, node) - 35
                const { x, y } = getExtendedPoint(prev, node, newDis)
                node.x = x
                node.y = y
                // needLoop = true
              }
            })
          }
        })
        // 处理主干中间节点的碰撞，一条一条线路来处理，已经处理过的则不能再被修改
        lineKeys.forEach((num) => {
          const lineNodes = nodes.filter((n) => n.lineNum === num)
          const othNodes = nodes.filter((n) => n.lineNum !== num)
          lineNodes.forEach((node) => {
            const { isBrancheNode, isStartNode, isLastNode, type, x, y, extraInfo } = node
            const { prev, distance, i } = extraInfo || {}
            // 都当前点和其他未被处理 的线路的点进行比较
            if (isBrancheNode && !isStartNode && !isLastNode && type === 'stationNode') {
              othNodes.forEach((n) => {
                const { x, y } = n
                const dis = calculateDistance({ x, y }, n)
                if (dis < 25) {
                  const newDis = calculateDistance(prev, node) - 25
                  const { x, y } = getExtendedPoint(prev, node, newDis)
                  node.x = x
                  node.y = y
                  needLoop = true
                }
              })
            }
          })
        })
        // 处理节点和路线画线的碰撞
        // 取出所有的坐标点
        lineKeys.forEach((num) => {
          const lineNodes = nodes.filter((n) => n.lineNum === num)
          const othNodes = nodes.filter((n) => n.lineNum !== num)
          lineNodes.forEach((node) => {
            const { isBrancheNode, isStartNode, isLastNode, type, x, y, extraInfo, id } = node
            const prevNode = lineNodes.find((n) => n.nextId === node.id)
            const { prev, distance, i } = extraInfo || {}
            if (isBrancheNode && !isStartNode && !isLastNode && type === 'stationNode' && !prevNode.isStartNode) {
              const a = lineNodes.find((n) => n.nextId === node.id || n.id === node.prevId)
              const b = othNodes.find((n) => n.id === a.nextId || n.id === a.prevId)
              if (b && b.id && a && a.id) {
                const CE = calculateSegmentDistances(a, b, prevNode)
                const ED = calculateSegmentDistances(b, a, prevNode)
                if ((CE && CE < 8) || (ED && ED < 8)) {
                  const newDis = calculateDistance(prev, node) - 8
                  const { x, y } = getExtendedPoint(prev, node, newDis)
                  node.x = x
                  node.y = y
                  needLoop = true
                }
              }
            }
          })
        })
        // 处理分支的碰撞
        // 取出所有的坐标点
        if (needLoop) {
          loop(times)
        }
      }
      loop(1)
    }
  })
  // 全部的节点确定坐标后，处理节点的文字位置
  nodes.forEach((node) => {
    if (node.label !== '') {
      const lineNumNodes = nodes.filter((n) => n.lineNum === node.lineNum)
      const prevNode = !node.isStartNode ? findValidPrevNode({ node, prevNodes: lineNumNodes, findRelate: true }) : {}
      node.textAttrs = calculateTextAttrs({ node, prevNode, lineNumNodes, nodes })
    }
  })
  return { nodes, edges }
}
