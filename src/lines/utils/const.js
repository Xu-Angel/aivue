import { hexToRgba } from '@/utils/color.js'
import linesInfo from './linesInfo'

export const rectWidth = 90
export const rectHeight = 30
export const circleSize = 16

// 路线颜色
const colors = Object.entries(linesInfo).map(([key, value]) => value.color)

export const LINE_COLORS = colors.map(item => {
  return {
    color: item,
    backgroundColor: hexToRgba(item, 0.1),
  }
})

// 路线起始点的坐标
export const linesOthInfo = {
  1: {
    startXY: { x: 258, y: 580 },
    startPointDisc: 30,
  },
  2: {
    startXY: { x: 332, y: 378 },
  },
  3: {
    startXY: { x: 914, y: 50 },
  },
  4: {
    startXY: { x: 135, y: 247 },
    startPointDisc: 30,
  },
  5: {
    startXY: { x: 374, y: 847 },
    startPointDisc: 10,
  },
  6: {
    startXY: { x: 1483, y: 151 },
    startPointDisc: -20,
  },
  7: {
    startXY: { x: 200, y: 80 },
    startPointDisc: 30,
  },
  8: {
    startXY: { x: 133, y: 718 },
    startPointDisc: 30,
  },
  9: {
    startXY: { x: 330, y: 697 },
  },
  10: {
    startXY: { x: 1621, y: 988 },
    startPointDisc: 20,
  },
  11: {
    startXY: { x: 1846, y: 366 },
    xFactor: -1,
    startPointDisc: -40,
  },
  12: {
    startXY: { x: 1229, y: 105 },
  },
  13: {
    startXY: { x: 1507, y: 1024 },
    startPointDisc: 20,
  },
  14: {
    startXY: { x: 1840, y: 102 },
    startPointDisc: 20,
  },
  15: {
    startXY: { x: 1110, y: 71 },
  },
  16: {
    startXY: { x: 84, y: 436 },
    startPointDisc: 30,
  },
  17: {
    startXY: { x: 1841, y: 971 },
  },
  18: {
    startXY: { x: 180, y: 985 },
    startPointDisc: 30,
  },
  19: {
    startXY: { x: 1695, y: 30 },
    // xFactor: -1,
    startPointDisc: 10,
  },
  20: {
    startXY: { x: 58, y: 577 },
  },
}
