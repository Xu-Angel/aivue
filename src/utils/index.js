import dayjs from 'dayjs'

export const formatTime = (time, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!time) return ''
  return dayjs(time).format(format)
}