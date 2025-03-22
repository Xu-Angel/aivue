import G6 from '@antv/g6'
import { hexToRgba } from '@/utils/color.js'

export default function () {
  // 折线
  G6.registerEdge('customEdge', {
    setState(name, value, item) {
      // const shape = item.get('keyShape')
      // const model = item?.getModel() || {}
      const group = item?.getContainer()
      const children = group?.get('children')
      const stationEdge = children.find((item) => item.get('name') === 'station-edge')
      const edgeHighlight = children.find((item) => item.get('name') === 'edge-highlight')

      stationEdge.attr('opacity', 1)
      edgeHighlight.attr('opacity', 0)

      switch (name) {
        case 'dark':
          stationEdge.attr('opacity', value ? 0.2 : 1)
          break
        case 'highlight':
          edgeHighlight.attr('opacity', value ? 1 : 0)
          break
      }
    },
    draw(cfg, group) {
      const ofx = +cfg.pathsData.offsets.x ?? 0
      const ofy = +cfg.pathsData.offsets.y ?? 0
      const prevPoint = cfg.pathsData.prevPoint
      const nextPoint = cfg.pathsData.nextPoint
      const directiveValue = cfg.pathsData.directiveObj?.directiveValue
      const directive = cfg.pathsData.directiveObj?.directive
      let cPath

      const useSE = cfg.pathsData.isBias || cfg.pathsData.useSE
      const px = useSE ? cfg.startPoint.x : prevPoint.x
      const py = useSE ? cfg.startPoint.y : prevPoint.y
      const nx = useSE ? cfg.endPoint.x : nextPoint.x
      const ny = useSE ? cfg.endPoint.y : nextPoint.y
      if (directiveValue) {
        const cs = directiveValue.split(' ')
        if (directive === 'C') {
          /// / C x1 y1 x2 y2 x y
          // C x1 y1 x2 y2 x y
          // c dx1 dy1 dx2 dy2 dx dy
          // 绝对坐标
          cPath = [directive, `${+cs[0] + ofx}`, `${+cs[1] + ofy}`, `${+cs[2] + ofx}`, `${+cs[3] + ofy}`, `${+cs[4] + ofx}`, `${+cs[5] + ofy}`]
        } else if (directive === 'c') {
          // 相对坐标
          cPath = [directive, `${cs[0]} ${cs[1]}`, `${cs[2]} ${cs[3]}`, `${cs[4]} ${cs[5]}`]
        }
      }

      const shapeConfig = {
        attrs: {
          cursor: 'pointer',
          stroke: cfg.color,
          path: [
            // 起点开始移动到当前节点位置
            ...[['M', px, py]],
            ...[['L', nx, ny]], // 直线到终点
          ],
          lineWidth: 5,
          zIndex: 2,
        },
        // label: '边的标签文字',
        labelCfg: {
          refX: 0, // 文本在 x 方向偏移量
          refY: 0, // 文本在 y 方向偏移量
          style: {
            fill: '#595959',
          },
        },
        // 在 G6 3.3 及之后的版本中，必须指定 name，可以是任意字符串，但需要在同一个自定义元素类型中保持唯一性
        name: 'station-edge',
      }
      // 插入曲线指令
      if (cPath) {
        shapeConfig.attrs.path[1] = cPath
      }
      const shape = group.addShape('path', shapeConfig)
      group.addShape('path', {
        ...shapeConfig,
        attrs: {
          ...shapeConfig.attrs,
          stroke: hexToRgba(cfg.color, 0.25),
          lineWidth: 11,
          opacity: 0,
        },
        name: 'edge-highlight',
        zIndex: 1,
      })
      return shape
    },
  })
}
