import G6 from '@antv/g6'
import { hexToRgba } from '@/utils/color.js'

export default function () {
  G6.registerEdge(
    'baseEdge',
    {
      setState(name, value, item) {
        const shape = item.get('keyShape')
        const model = item?.getModel() || {}
        const group = item?.getContainer()
        const children = group?.get('children')
        const edgeHighlight = children.find((item) => item.get('name') === 'edge-highlight')

        shape.attr('opacity', 1)
        edgeHighlight.attr('opacity', 0)

        switch (name) {
          case 'dark':
            shape.attr('opacity', value ? 0.2 : 1)
            break
          case 'highlight':
            edgeHighlight.attr('opacity', value ? 1 : 0)
            break
        }
      },

      afterDraw(cfg, group) {
        const startPoint = cfg.startPoint
        const endPoint = cfg.endPoint
        group.addShape('path', {
          attrs: {
            path: [
              ['M', startPoint.x, startPoint.y],
              ['L', endPoint.x, endPoint.y],
            ],
            stroke: hexToRgba(cfg.color, 0.25),
            lineWidth: 11,
            opacity: 0,
            cursor: 'pointer',
          },
          name: 'edge-highlight',
          zIndex: 1,
        })
      },
    },
    'line'
  )
}
