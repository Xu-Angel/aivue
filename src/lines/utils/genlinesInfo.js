const fs = require('fs')
const path = require('path')
const svgs = require('./svg.js')

// 路线方向翻转与否
const linesOthInfo = {
  1: {
    reverse: false,
  },
  2: {
    reverse: false,
  },
  3: {
    reverse: false,
  },
  4: {
    reverse: false,
  },
  5: {
    reverse: false,
  },
  6: {
    reverse: true,
  },
  7: {
    reverse: false,
  },
  8: {
    reverse: false,
  },
  9: {
    reverse: false,
  },
  10: {
    reverse: false,
  },
  11: {
    reverse: true,
  },
  12: {
    reverse: false,
  },
  13: {
    reverse: true,
  },
  14: {
    reverse: true,
  },
  15: {
    reverse: true,
  },
  16: {
    reverse: false,
  },
  17: {
    reverse: false,
  },
  18: {
    reverse: false,
  },
  19: {
    reverse: true,
  },
  20: {
    reverse: true,
  },
}
/**
 * 翻转path指令，UI画的路线有些是反过来画的
 * @param {*} d
 * @returns
 */
function reverseSvgPath(d) {
  const parseCommands = (d) => {
    const commandRegex = /([A-Z])\s*((?:-?\d*\.?\d+\s*)+)/gi
    const commands = []
    let match
    while ((match = commandRegex.exec(d)) !== null) {
      const type = match[1].toUpperCase()
      const args = match[2]
        .trim()
        .split(/[\s,]+/)
        .filter((x) => x)
        .map(Number)
      commands.push({ type, args })
    }
    return commands
  }

  const toAbsolute = (commands) => {
    let x = 0
    let y = 0
    return commands.map((cmd) => {
      let absCmd
      switch (cmd.type) {
        case 'M':
          ;[x, y] = cmd.args
          absCmd = { type: 'M', args: [x, y], x, y }
          break
        case 'L':
          ;[x, y] = cmd.args
          absCmd = { type: 'L', args: [x, y], x, y }
          break
        case 'C':
          const [x1, y1, x2, y2, xEnd, yEnd] = cmd.args
          x = xEnd
          y = yEnd
          absCmd = { type: 'C', args: [x1, y1, x2, y2, x, y], x, y }
          break
        case 'V':
          y = cmd.args[0]
          absCmd = { type: 'V', args: [y], x, y }
          break
        case 'H':
          x = cmd.args[0]
          absCmd = { type: 'H', args: [x], x, y }
          break
        default:
          absCmd = { ...cmd, x, y }
          break
      }
      return absCmd
    })
  }

  const commands = parseCommands(d)
  const absolute = toAbsolute(commands)

  if (absolute.length === 0) return ''

  const reversed = []
  const lastX = absolute[absolute.length - 1].x
  const lastY = absolute[absolute.length - 1].y
  reversed.push(`M ${lastX} ${lastY}`)

  for (let i = absolute.length - 1; i > 0; i--) {
    const cmd = absolute[i]
    const prev = absolute[i - 1]
    switch (cmd.type) {
      case 'M':
        break
      case 'L':
        reversed.push(`L ${prev.x} ${prev.y}`)
        break
      case 'C':
        const [x1, y1, x2, y2] = cmd.args
        reversed.push(`C ${x2} ${y2} ${x1} ${y1} ${prev.x} ${prev.y}`)
        break
      case 'V':
        reversed.push(`V ${prev.y}`)
        break
      case 'H':
        reversed.push(`H ${prev.x}`)
        break
    }
  }

  return reversed.join(' ')
}
/**
 *
 * @param {*} d
 * @param {*} convertToRelative 是否改成相对坐标 Canvas 不支持c
 * @returns
 */
function parsePathCommands(d, convertToRelative = false) {
  const commands = []
  const regex = /([MmLlHhVvCcSsQqTtAa])([^MmLlHhVvCcSsQqTtAa]*)/g
  let match
  let currentX = 0
  let currentY = 0
  let commandId = 0

  while ((match = regex.exec(d))) {
    const [_, commandType, values] = match
    const valuesArray = values
      .trim()
      .split(/[\s,]+/)
      .map(Number)

    let command = {}
    switch (commandType.toUpperCase()) {
      case 'M':
      case 'L':
        const targetX = valuesArray[0]
        const targetY = valuesArray[1]
        currentX = targetX
        currentY = targetY
        command = {
          id: commandId++,
          prevId: commands.length ? commands[commands.length - 1].id : null,
          nextId: null,
          x: targetX,
          y: targetY,
          type: 'base',
          directiveObj: { directive: commandType, directiveValue: `${targetX} ${targetY}` },
        }
        break
      case 'H':
        const hX = valuesArray[0]
        command = {
          id: commandId++,
          prevId: commands.length ? commands[commands.length - 1].id : null,
          nextId: null,
          x: hX,
          y: currentY,
          type: 'base',
          directiveObj: { directive: commandType, directiveValue: `${hX}` },
        }
        currentX = hX
        break
      case 'V':
        const vY = valuesArray[0]
        command = {
          id: commandId++,
          prevId: commands.length ? commands[commands.length - 1].id : null,
          nextId: null,
          x: currentX,
          y: vY,
          type: 'base',
          directiveObj: { directive: commandType, directiveValue: `${vY}` },
        }
        currentY = vY
        break
      case 'C': {
        const [x1, y1, x2, y2, x, y] = valuesArray
        if (convertToRelative) {
          const dx1 = x1 - currentX
          const dy1 = y1 - currentY
          const dx2 = x2 - currentX
          const dy2 = y2 - currentY
          const dx = x - currentX
          const dy = y - currentY

          command = {
            id: commandId++,
            prevId: commands.length ? commands[commands.length - 1].id : null,
            nextId: null,
            x,
            y,
            type: 'cDirective',
            directiveObj: {
              directive: 'c',
              directiveValue: `${dx1} ${dy1} ${dx2} ${dy2} ${dx} ${dy}`,
            },
          }
        } else {
          command = {
            id: commandId++,
            prevId: commands.length ? commands[commands.length - 1].id : null,
            nextId: null,
            x,
            y,
            type: 'cDirective',
            directiveObj: {
              directive: 'C',
              directiveValue: `${x1} ${y1} ${x2} ${y2} ${x} ${y}`,
            },
          }
        }
        currentX = x
        currentY = y
        break
      }
      default:
        console.warn(`Unsupported command type: ${commandType}`)
    }

    if (commands.length) {
      commands[commands.length - 1].nextId = command.id
    }
    commands.push(command)
  }

  return commands
}
// 从SVG内容中提取pathsData
function extractPathsData(svgContent, reverse) {
  const pathRegex = /<path[^>]*d="([^"]*)"/gi
  let match
  const pathsData = []
  while ((match = pathRegex.exec(svgContent))) {
    let d = match[1]
    if (reverse) {
      d = reverseSvgPath(d)
    }
    const commands = parsePathCommands(d)
    pathsData.push(commands)
  }
  return pathsData
}

function extractColor(svgContent) {
  // 使用正则表达式提取 stroke 属性的颜色值
  const strokeRegex = /stroke="([^"]*)"/
  const match = svgContent.match(strokeRegex)
  if (match) {
    const strokeColor = match[1]
    return strokeColor
  } else {
    return '#fff'
  }
}

// 主函数
async function generatePathsFile() {
  try {
    const linesInfoObj = {}
    for (const key in svgs) {
      const svgData = svgs[key]
      const pathsData = extractPathsData(svgData, linesOthInfo[key].reverse)
      const pathColor = extractColor(svgData)
      linesInfoObj[key] = {
        pathsArr: pathsData.flat(),
        color: pathColor,
      }
    }
    const pathsFilePath = path.join(__dirname, 'linesInfo.js')
    const fhsContent = `export default ${JSON.stringify(linesInfoObj, null, 2)};`
    await fs.promises.writeFile(pathsFilePath, fhsContent, 'utf-8')
    console.log('Paths file generated successfully.')
  } catch (error) {
    console.error('Error generating paths file:', error)
  }
}
// 运行主函数
generatePathsFile()
