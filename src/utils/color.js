/**
 * 将十六进制颜色值转换为带透明度的RGBA格式
 * @param {string} hex - 十六进制颜色值，例如 '#ffffff' 或 '#fff'
 * @param {number} alpha - 透明度值，范围 0-1
 * @returns {string} - 返回rgba格式的颜色字符串
 */
export function hexToRgba(hex, alpha = 1) {
  // 移除可能存在的 # 前缀
  hex = hex.replace('#', '')

  // 如果是简写形式（例如 #fff），转换为完整形式
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(char => char + char)
      .join('')
  }

  // 将十六进制转换为RGB值
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // 返回rgba格式字符串
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
