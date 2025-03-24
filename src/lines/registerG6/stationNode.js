import G6 from '@antv/g6'
import { hexToRgba } from '@/utils/color.js'

export default function StationNode() {
  G6.registerNode(
    'stationNode',
    {      
      update(cfg, item) {
        const group = item.getContainer()
        const children = group.get('children')
        const mainBox = children.find((item) => item.get('name') === 'main-box' || item.get('name') === 'rect-main-box')
        const nodeLabel = children.find((item) => item.get('name') === 'node-label')
        
        // 更新文本属性
        if (cfg.textAttrs && nodeLabel) {
          console.log(cfg.textAttrs,'cccc')
          nodeLabel.attr(cfg.textAttrs)
        }
        
        // 更新其他属性
        if (cfg.style && mainBox) {
          mainBox.attr(cfg.style)
        }
      },
      setState(name, value, item) {
        const model = item.getModel()
        const group = item?.getContainer()
        const children = group?.get('children')
        const mainBox = children.find((item) => item.get('name') === 'main-box')
        const nodeLabel = children.find((item) => item.get('name') === 'node-label')
        const nodeHighlight = children.find((item) => item.get('name') === 'node-highlight')
        switch (name) {
          case 'dark':
            mainBox?.attr('opacity', value ? 0.2 : 1)
            nodeLabel?.attr('opacity', value ? 0.2 : 1)
            break
          case 'highlight':
            nodeHighlight?.attr('opacity', value ? 1 : 0)
            value ? item?.toFront() : item?.toBack()
            break
        }
      },
      draw(cfg, group) {
        let shape = null
        if (cfg.shapeType === 'rect') {
          // 主体
          shape = group.addShape('rect', {
            attrs: {
              x: 0,
              y: 0,
              width: cfg.nodeSize[0],
              height: cfg.nodeSize[1],
              fill: '#fff',
              stroke: cfg.lineColor,
              lineWidth: 2,
              radius: 3,
              ...(cfg.style ?? {}),
            },
            name: 'rect-main-box',
            draggable: false,
            zIndex: 2,
          })

          // 高亮
          group.addShape('rect', {
            attrs: {
              x: 0 - 4,
              y: 0 - 4,
              width: cfg.nodeSize[0] + 8,
              height: cfg.nodeSize[1] + 8,
              cursor: 'pointer',
              fill: hexToRgba(cfg.lineColor, 0.25),
              stroke: hexToRgba(cfg.lineColor, 0.25),
              lineWidth: 4,
              opacity: 0,
              radius: 4,
            },
            name: 'node-highlight',
            draggable: false,
            zIndex: 1,
          })
        } else {
          shape = group.addShape('circle', {
            attrs: {
              x: 0,
              y: 0,
              r: cfg.nodeSize / 2,
              fill: '#fff',
              stroke: cfg.healthColor,
              lineWidth: 2,
              cursor: 'pointer',
            },
            name: 'main-box',
            draggable: false,
            zIndex: 3,
          })

          // 高亮
          group.addShape('circle', {
            attrs: {
              x: 0,
              y: 0,
              r: cfg.nodeSize / 2 + 8,
              cursor: 'pointer',
              fill: hexToRgba(cfg.healthColor, 0.25),
              opacity: 0,
            },
            name: 'node-highlight',
            draggable: false,
            zIndex: 1,
          })
        }
        group.addShape('text', {
          attrs: {
            textAlign: 'center',
            textBaseline: 'top',
            ...(cfg.textAttrs ?? {}),
          },
          name: 'node-label',
          zIndex: 4,
        })

        group.sort()
        return shape
      },
    },
    'single-node'
  )
}
