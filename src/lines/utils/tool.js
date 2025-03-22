import { rectWidth, rectHeight } from './const'

/**
 * 寻找有效的前一个节点，用于确定方向
 * @param {Object} params - 参数对象
 * @param {Object} params.node - 当前节点
 * @param {Array} params.prevNodes - 前驱节点数组
 * @param {Object} params.findRelate - 寻找相近的，忽略方向
 * @returns {Object} 有效的前一个节点
 */
export function findValidPrevNode({ node, prevNodes, findRelate = false }) {
  const prevNode = prevNodes.find((n) => n.id === node.prevId || (findRelate && n.id === node.nextId))
  if (!prevNode) {
    return null // 如果没有前驱节点，返回 null
  }
  const distance = calculateDistance(prevNode, node)
  if (distance > 5) {
    return prevNode // 如果距离大于5，返回当前前驱节点
  } else {
    // 否则，递归寻找前驱节点的前驱
    return findValidPrevNode({ node: prevNode, prevNodes, findRelate })
  }
}

/**
 * 寻找有效的后一个节点，用于确定方向
 * @param {Object} params - 参数对象
 * @param {Object} params.node - 当前节点
 * @param {Array} params.nextNodes - 后继节点数组
 * @param {Object} params.findRelate - 寻找相近的，忽略方向
 * @returns {Object} 有效的后一个节点
 */
export function findValidNextNode({ node, nextNodes, findRelate = false }) {
  const nextNode = nextNodes.find((n) => n.id === node.nextId || (findRelate && n.id === node.prevId))
  if (!nextNode) {
    return null // 如果没有前驱节点，返回 null
  }
  const distance = calculateDistance(node, nextNode)
  if (distance > 5) {
    return nextNode // 如果距离大于5，返回后继节点
  } else {
    // 否则，递归寻找后继节点的后继
    return findValidNextNode({ node: nextNode, nextNodes, findRelate })
  }
}

/**
 * 计算两点之间的距离
 * @param {{x: number, y: number}} p1 起始点
 * @param {{x: number, y: number}} p2 结束点
 * @returns {number} 两点距离
 */
export function calculateDistance(p1, p2) {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  return Math.sqrt(dx ** 2 + dy ** 2)
}

/**
 * 获取延长点坐标
 * @param {{x: number, y: number}} p1 起始点
 * @param {{x: number, y: number}} p2 结束点
 * @param {number} distance 延伸距离
 * @returns {{x:number, y: number, precent:number}} 新坐标点
 */
export function getExtendedPoint(p1, p2, distance) {
  // 计算方向向量
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y

  // 计算原始线段长度
  const lengthAB = Math.sqrt(dx ** 2 + dy ** 2)

  // 处理重合点
  if (lengthAB === 0) return { x: p1.x, y: p1.y }

  // 计算单位向量
  const unitX = dx / lengthAB
  const unitY = dy / lengthAB
  const x = p1.x + unitX * distance
  const y = p1.y + unitY * distance
  const total = calculateDistance(p1, p2)
  const extended = calculateDistance(p1, { x, y })
  // 计算并返回
  return {
    x,
    y,
    precent: extended / total,
  }
}

/**
 * 计算C到直线AB的垂直距离
 * @param {{x: number, y: number}} A 练成直线的A
 * @param {{x: number, y: number}} B 练成直线的B
 * @param {{x: number, y: number}} C 直线外的一个点
 * @returns
 */
export function calculateVerticalDistance(A, B, C) {
  // 计算向量 AB 的分量
  const dxAB = B.x - A.x
  const dyAB = B.y - A.y

  // 处理 A 和 B 重合的情况
  if (dxAB === 0 && dyAB === 0) {
    // 返回C到A的距离
    const dx = C.x - A.x
    const dy = C.y - A.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  // 计算向量 AC 的分量
  const dxAC = C.x - A.x
  const dyAC = C.y - A.y

  // 计算叉积的绝对值（AB × AC）
  const crossProduct = dxAB * dyAC - dyAB * dxAC
  const absCross = Math.abs(crossProduct)

  // 计算 AB 的模长
  const lengthAB = Math.sqrt(dxAB * dxAB + dyAB * dyAB)

  // 返回垂直距离
  return absCross / lengthAB
}

/**
 * 计算两条直线的交点坐标
 * @param {Object} A 点A坐标 {x, y}
 * @param {Object} B 点B坐标 {x, y}
 * @param {Object} C 点C坐标 {x, y}
 * @param {Object} D 点D坐标 {x, y}
 * @returns {Object|null} 交点坐标或null（平行时）
 */
function getIntersection(A, B, C, D) {
  // 计算直线AB的一般式方程系数
  const a1 = B.y - A.y
  const b1 = A.x - B.x
  const c1 = B.x * A.y - A.x * B.y

  // 计算直线CD的一般式方程系数
  const a2 = D.y - C.y
  const b2 = C.x - D.x
  const c2 = D.x * C.y - C.x * D.y

  // 计算行列式
  const denominator = a1 * b2 - a2 * b1

  // 处理平行情况
  if (denominator === 0) return null

  // 计算交点坐标
  const x = (b1 * c2 - b2 * c1) / denominator
  const y = (a2 * c1 - a1 * c2) / denominator
  return { x, y }
}

/**
 * 主函数：计算ED和CE的距离
 * @returns {Object} 包含ED和CE距离的对象
 */
export function calculateSegmentDistances(A, B, C, D) {
  const E = getIntersection(A, B, C, D)
  if (!E) {
    return { ED: null, CE: null }
  }
  return {
    ED: calculateDistance(E, D),
    CE: calculateDistance(C, E),
  }
}

/**
 * 计算线段延伸距离
 * @param {Object} A 线段AB起点 {x, y}
 * @param {Object} B 线段AB终点 {x, y}
 * @param {Object} C 线段CD起点 {x, y}
 * @param {Object} D 线段CD终点 {x, y}
 * @returns {Object} { type: 'intersected'|'extended'|'parallel', distance: number|null, point: {x,y}|null }
 */
export function calculateSegmentExtension(A, B, C, D) {
  console.log(A, B, C, D, '----')
  // 计算方向向量
  const vecAB = { x: B.x - A.x, y: B.y - A.y }
  const vecCD = { x: D.x - C.x, y: D.y - C.y }

  // 通过叉积判断是否平行（网页1[1](@ref)和网页5[5](@ref)的方法）
  const crossProduct = vecAB.x * vecCD.y - vecAB.y * vecCD.x
  if (Math.abs(crossProduct) < 1e-10) return { type: 'parallel', distance: null, point: null }

  // 使用线性方程组解法（第三阶段：直线交点计算 网页3[3](@ref)和网页7[7](@ref)的公式）
  const denominator = (D.x - C.x) * (B.y - A.y) - (B.x - A.x) * (D.y - C.y)
  const t = ((C.x - A.x) * (B.y - A.y) + (A.y - C.y) * (B.x - A.x)) / denominator
  const E = {
    x: C.x + t * (D.x - C.x),
    y: C.y + t * (D.y - C.y),
  }

  // 判断交点是否在线段CD上（第四阶段：交点位置判断 网页3[3](@ref)的范围检测法）
  const isOnSegmentCD = t >= 0 && t <= 1
  if (isOnSegmentCD) {
    // 正常相交情况
    return calculateSegmentDistances(A, B, C, E)
  } else {
    // 计算需要延伸的向量长度（网页7[7](@ref)的向量投影法）
    const vecCE = { x: E.x - C.x, y: E.y - C.y }
    const vecCDLength = Math.sqrt(vecCD.x ** 2 + vecCD.y ** 2)

    // 单位向量
    const unitCD = {
      x: vecCD.x / vecCDLength,
      y: vecCD.y / vecCDLength,
    }

    // 投影长度计算（网页6[6](@ref)的公式变体）
    const projection = vecCE.x * unitCD.x + vecCE.y * unitCD.y
    const extendDistance = projection * vecCDLength
    return {
      type: 'extended',
      distance: extendDistance,
      point: E,
    }
  }
}

/**
 * 生成主干线路上的点坐标信息
 * @param {*} param0
 * @returns
 */
export function genPointpos({ target, prev, t }) {
  let x, y
  const isH = target.y === prev.y
  if (isH) {
    // 如果得到的target对象是一个水平线，则新生成的点的Y坐标是prev的Y坐标，X坐标是prev的X坐标加上target的X坐标的差值乘以百分比
    const targetX = target.x
    const prevX = prev.x
    // 确定方向
    const dir = targetX > prevX ? 'E' : 'W'
    let left, right
    if (dir === 'E') {
      left = prevX
      right = targetX
    } else if (dir === 'W') {
      left = targetX
      right = prevX
    }
    x = left + (right - left) * t
    y = target.y
  }
  // 确定target对象是否直线，找到它的前一个指令对象，如果前一个指令对象的X坐标和当前指令对象的X坐标相等，则说明是垂直线
  const isV = target.x === prev.x
  if (isV) {
    // 如果得到的target对象是一个垂直线，则新生成的点的X坐标是prev的X坐标，Y坐标是prev的Y坐标加上target的Y坐标的差值乘以百分比
    const nextY = target.y
    const prevY = prev.y
    // 确定方向
    const dir = nextY > prevY ? 'S' : 'N'
    let left, right
    if (dir === 'S') {
      left = prevY
      right = nextY
    } else if (dir === 'N') {
      left = nextY
      right = prevY
    }
    x = target.x
    y = left + (right - left) * t
  }
  // 确定target对象是一条斜线，找到它的前一个指令对象，如果前一个指令对象的X坐标和Y坐标和当前指令对象的X坐标和Y坐标不相等，则说明是斜线
  const isBias = target.x !== prev.x && target.y !== prev.y
  let dir
  if (isBias) {
    // 一条斜线生成了多个节点 位置排放：
    const dir = calculateDirection(prev, target)
    let left, right
    if (dir === 'ES') {
      // 东南方向
      left = prev
      right = target
    } else if (dir === 'WS') {
      // 西南方向
      left = prev
      right = target
    } else if (dir === 'WN') {
      // 西北方向
      left = target
      right = prev
    } else if (dir === 'EN') {
      // 东北方向
      left = prev
      right = target
    }
    const x1 = left.x
    const x2 = right.x
    const y1 = left.y
    const y2 = right.y
    x = x1 + t * (x2 - x1)
    y = y1 + t * (y2 - y1)
  }
  return {
    x,
    y,
    isBias,
    dir,
  }
}

/**
 * 确定两个坐标间的走线向
 * @param {*} source
 * @param {*} target
 * @returns
 */
export function calculateDirection(source, target) {
  if (!source) {
    console.error('calculateDirection:', source, target)
    return
  }
  let sourceX = source.x
  let sourceY = source.y
  if (source.isStartNode) {
    sourceX = source.x + rectWidth / 2
    sourceY = source.y + rectHeight / 2
  }
  const targetX = target.x
  const targetY = target.y

  // 水平线
  if (targetX === sourceX) {
    // 垂直线
    return targetY > sourceY ? 'S' : 'N'
  } else if (targetY === sourceY) {
    return targetX > sourceX ? 'E' : 'W'
  } else if (targetX > sourceX && targetY > sourceY) {
    // 东南方向
    return 'ES'
  } else if (targetX < sourceX && targetY > sourceY) {
    // 西南方向
    return 'WS'
  } else if (targetX < sourceX && targetY < sourceY) {
    // 西北方向
    return 'WN'
  } else if (targetX > sourceX && targetY < sourceY) {
    // 东北方向
    return 'EN'
  }
}

/**
 * 获取目标节点该启用哪个锚点给源节点连接边
 * @param {*} source 源节点
 * @param {*} target 目标节点
 * @returns {Object} 锚点信息
 */
export function findBestAnchorPoint(source, target) {
  const direction = calculateDirection(source, target)
  // 定义方向与锚点的映射
  const directionToAnchorMap = {
    N: [0.5, 0], // 北
    S: [0.5, 1], // 南
    E: [1, 0.5], // 东
    W: [0, 0.5], // 西
    ES: [1, 0.5], // 东南
    WS: [0, 0.5], // 西南
    WN: [0, 0.5], // 西北
    EN: [0, 0.5], // 东北
  }
  // 获取最佳锚点
  return directionToAnchorMap[direction] || []
}

/**
 * 生成新节点位置
 * @param {*} source 源节点
 * @param {*} distance 距离
 * @param {*} angle 角度
 * @returns
 */
export function calculateNewCoordinate(source, distance, angle) {
  const sourceX = source.x
  const sourceY = source.y
  // 将角度从度数转换为弧度
  const radians = (angle * Math.PI) / 180
  // 计算新坐标
  const newX = sourceX + distance * Math.cos(radians)
  const newY = sourceY + distance * Math.sin(radians)
  return { x: newX, y: newY }
}

export function findPaths(data) {
  const graph = {}
  const paths = {}

  // 构建邻接表
  data.edges.forEach((edge) => {
    if (!graph[edge.source]) {
      graph[edge.source] = []
    }
    graph[edge.source].push(edge.target)
  })

  // 深度优先搜索函数
  function dfs(nodeId, currentPath) {
    const node = data.nodes.find((n) => n.id === nodeId)
    const newPath = [...currentPath, node.id]

    // 记录路径
    paths[node.id] = paths[node.id] || []
    paths[node.id].push(newPath)

    // 如果当前节点没有子节点，停止搜索
    if (!graph[node.id] || graph[node.id].length === 0) {
      return
    }

    // 遍历所有子节点
    graph[node.id].forEach((neighborId) => {
      if (!currentPath.includes(neighborId)) {
        // 防止环
        dfs(neighborId, newPath)
      }
    })
  }

  // 从每个节点开始DFS
  data.nodes.forEach((node) => {
    if (!paths[node.id]) {
      // 只对未记录路径的节点执行DFS
      dfs(node.id, [])
    }
  })

  return paths
}
export function findLongestPathsInResult(pathsResult) {
  const longestPaths = {}
  // 遍历pathsResult中的每个键值对
  for (const key in pathsResult) {
    // eslint-disable-next-line no-prototype-builtins
    if (pathsResult.hasOwnProperty(key)) {
      // 如果当前键对应的数组长度大于之前记录的最长长度，则更新最长路径
      if (pathsResult[key].length > 0) {
        longestPaths[key] = pathsResult[key].reduce((longest, current) => {
          return current.length > longest.length ? current : longest
        })
      }
    }
  }

  return longestPaths
}

export function checkStartPoint(points = [], startXY = {}) {
  if (!points || !points.length || !startXY) {
    return { offsetX: 0, offsetY: 0 }
  }
  const firstPoint = points[0]
  if (!firstPoint || typeof firstPoint.x === 'undefined' || typeof firstPoint.y === 'undefined' || typeof startXY.x === 'undefined' || typeof startXY.y === 'undefined') {
    return { offsetX: 0, offsetY: 0 }
  }
  const offsetX = startXY.x - firstPoint.x
  const offsetY = startXY.y - firstPoint.y
  return {
    offsetX, // 水平偏差值
    offsetY, // 垂直偏差值
  }
}
