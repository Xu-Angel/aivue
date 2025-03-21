import baseEdge from './baseEdge'
import stationNode from './stationNode'
import customEdge from './customEdge'
import pathNode from './pathNode'
/**
 * 统一注册边和节点
 */
export default function () {
  baseEdge()
  stationNode()
  customEdge()
  pathNode()
}