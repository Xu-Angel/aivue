<template>
  <div class="time-slider">
    <div style="margin-top: 18px">
      <span class="font-size-12">今日</span>
      <span class="zoom-time">
        <span v-if="timePick"> {{ formatTime(timePick[0], 'HH:mm') + '~' + formatTime(timePick[1], 'HH:mm') }}</span>
      </span>
    </div>
    <div class="slider-box" ref="sliderBox">
      <div class="marks">
        <span v-for="(item, index) in marks" :key="index">
          <span>{{ item }}</span>
        </span>
      </div>
      <div class="time-block" :key="compKey" @mouseleave="handleMouseleave">
        <el-tooltip
          v-for="item in timeBlocks"
          :key="item.id"
          effect="dark"
          :disabled="item.disabled"
          :content="formatTime(item.timeStart, 'HH:mm') + '~' + formatTime(Math.min(item.timeEnd, current), 'HH:mm')"
          placement="top"
          ref="tooltip"
        >
          <span
            :style="{
              left: item.left,
              width: item.width,
              border: item.border,
              backgroundColor: item.color,
            }"
            :class="{
              active: item.id === selectId,
              disabled: item.disabled,
              anchorFather: true,
              isWidthNow: item.isWidthNow,
              canScale: !item.disabled || item.children.length,
            }"
            :ref="item.id"
            @click="handleClick(item)"
            @mouseover="e => handleMouseover(item, e)"
          >
            <template>
              <em
                v-for="(child, idx) in item.children"
                :key="idx"
                :style="{
                  left: child.left,
                  width: child.width,
                  backgroundColor: child.color,
                  zIndex: child.zIndex,
                }"
              >
              </em>
            </template>
          </span>
        </el-tooltip>
        <svg class="anchor" ref="anchorRef" xmlns="http://www.w3.org/2000/svg" width="8" height="7" viewBox="0 0 8 7" fill="none">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0.173292 4.93047L3.59531 1.18329C3.69756 1.06678 3.84499 1 3.99985 1C4.1547 1 4.30209 1.06673 4.40437 1.18329L7.8264 4.93047C7.99349 5.10715 8.0451 5.36469 7.95875 5.59212C7.87241 5.81956 7.66403 5.97838 7.42187 6L0.580655 6C0.337542 5.9793 0.128241 5.82144 0.0419039 5.59304C-0.0454067 5.36469 0.00625005 5.10806 0.173292 4.93047Z"
            fill="#325A8F"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
<script>
import { formatTime } from '@/utils'
import dayjs from 'dayjs'
export default {
  props: {
    sliderAlarm: {
      type: Array,
      default: () => [],
    },
    now: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    const timeBlocks = []
    const total = 24
    // 获取今日的 00:00:00 时间戳（以毫秒为单位）
    const startOfDay = dayjs().startOf('day').valueOf()
    const oneDay = 1000 * 60 * 60 * 24
    for (let i = 0; i < total; i++) {
      timeBlocks.push({
        id: `${i}To${i + 1}`,
        left: `${(i / total) * 100}%`,
        width: `calc(${(1 / total) * 100}% - 2px)`,
        timeStart: startOfDay + (i / total) * oneDay,
        timeEnd: startOfDay + ((i + 1) / total) * oneDay,
        children: [],
        disable: false,
      })
    }
    return {
      compKey: 0,
      timeBlocks,
      timePick: null,
      selectId: null,
    }
  },

  mounted() {},

  computed: {
    marks() {
      return ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00']
    },
    current() {
      return this.now?.getTime()
    },
  },
  watch: {
    sliderAlarm: {
      async handler() {
        const uniqueByProperties = (arr, keys) => {
          const lookup = new Set()
          return arr.filter(item => {
            const values = keys.map(key => item[key]).join('|')
            const exists = lookup.has(values)
            if (!exists) {
              lookup.add(values)
            }
            return !exists
          })
        }
        if (!this.now) return
        this.timeBlocks.forEach(timeBlock => {
          // 完全过去了的整时间段
          if (timeBlock.timeEnd <= this.current) {
            timeBlock.color = '#3f92fe'
          }
          timeBlock.children = uniqueByProperties(
            this.sliderAlarm
              .map(alarm => {
                const { value } = alarm
                const res = this.calculateOverlapPercentage({ left: timeBlock.timeStart, right: timeBlock.timeEnd }, { left: value[0], right: value[1] })
                if (res.percent) {
                  return {
                    left: `${((value[0] - timeBlock.timeStart) / timeBlock.timeEnd) * 100}%`,
                    width: `${res.percent * 100}%`,
                    // color,
                    zIndex: 2,
                    color: '#FF6D6D',
                  }
                }
                return false
              })
              .filter(Boolean),
            ['left', 'width', 'color']
          )
          timeBlock.border = !timeBlock.children.length ? '1px solid #d8dfea' : '1px solid #fff'

          // 判断是否需要加上不满格的蓝色时间块
          if (this.current > timeBlock.timeStart && this.current < timeBlock.timeEnd) {
            timeBlock.children.push({
              left: '0%',
              width: `${((this.current - timeBlock.timeStart) / (timeBlock.timeEnd - timeBlock.timeStart)) * 100}%`,
              color: '#3f92fe',
              zIndex: 1,
            })
            timeBlock.border = '1px solid #d8dfea'
            timeBlock.isWidthNow = true
          }
          timeBlock.disabled = !timeBlock.color && !timeBlock.children.length
        })
        const targets = this.timeBlocks.filter(item => item?.children?.length)
        this.handleClick(targets[targets.length - 1])
        this.compKey++
        await this.$nextTick()
        this.handleMouseleave()
      },
    },
  }, methods: {
    formatTime,
    calculateOverlapPercentage(interval1, interval2) {
      const a = interval1.left
      const b = interval1.right
      const c = interval2.left
      const d = interval2.right

      const overlapLeft = Math.max(a, c)
      const overlapRight = Math.min(b, d)

      if (overlapLeft < overlapRight) {
        const overlapLength = overlapRight - overlapLeft
        const interval1Length = b - a
        const overlapPercentage = overlapLength / interval1Length

        return {
          percent: overlapPercentage,
        }
      } else {
        return {}
      }
    },
    getPrecent(value1, value2) {
      return Number(((value1 / value2) * 100).toFixed(2))
    },
    handleClick(item, bubbling = true) {
      if (item.disabled) return
      this.selectId = item.id
      if (bubbling) {
        this.handleTimeChange([item.timeStart, item.timeEnd])
      }
    },
    handleMouseover(item, e) {
      if (item.disabled) return
      const styls = window.getComputedStyle(e.target.closest('.anchorFather'))
      const left = +styls.left.split('px')[0] + +styls.width.split('px')[0] / 2
      this.$refs.anchorRef.style.left = left + 'px'
    },
    handleMouseleave() {
      const target = this.$refs[this.selectId][0]
      const styls = window.getComputedStyle(target)
      const left = +styls.left.split('px')[0] + +styls.width.split('px')[0] / 2
      this.$refs.anchorRef.style.left = left + 'px'
    },
    /**
     * [startTime,endTime]
     */
    handleTimeChange(p = []) {
      // 右侧不能超过当前时间
      const timePick = [p[0], Math.min(p[1], this.current)]
      this.timePick = timePick
      this.$emit('timeChange', timePick)
    },
  },
}
</script>
<style lang="less" scoped>
.time-slider::v-deep {
  display: flex;
  padding: 10px;
  padding-right: 20px;
  align-items: center;
  padding-bottom: 30px;
  .zoom-time {
    display: inline-block;
    min-width: 80px;
    .el-icon-time {
      font-size: 14px;
      color: #666666;
      margin-right: 4px;
    }
    margin: 0 10px 0px 4px;
    padding: 3px 6px;
    border-radius: 3px;
    background: rgba(143, 143, 143, 0.1);
    color: #666;
    font-family: 'PingFang SC';
    font-size: 12px;
    font-weight: 400;
    line-height: 12px;
  }
  .slider-box {
    flex: 1;
    position: relative;
    .marks {
      display: flex;
      width: 100%;
      margin-bottom: 6px;
      position: relative;
      > span {
        display: inline-block;
        color: #666;
        font-family: 'PingFang SC';
        font-size: 12px;
        line-height: 12px;
        font-weight: 400;
        flex: 1;
        text-align: right;
        &:nth-child(1) {
          flex: none;
          position: absolute;
          left: 0;
          > span {
            transform: translateX(0);
          }
        }
        > span {
          transform: translateX(50%);
          display: inline-block;
        }
      }
    }
    .time-block {
      height: 12px;
      width: 100%;
      position: absolute;
      top: 20px;
      span {
        height: 100%;
        position: absolute;
        top: 0;
        display: block;
        border-radius: 1px;
        z-index: 10;
        cursor: pointer;
        border: 1px solid;
        em {
          top: 0;
          height: 100%;
          display: inline-block;
          position: absolute;
        }
        &.active {
          border: 1px solid #325a8f !important;
        }
        &.disabled {
          cursor: not-allowed;
        }
        &.canScale:hover {
          z-index: 4;
          transition: all 0.25;
          transform: scale(1.15);
          border: 1px solid #fff !important;
        }
        &.isWidthNow:hover {
          border: 1px solid #d8dfea !important;
        }
      }
      span + span {
        margin-left: 2px;
      }
      .anchor {
        position: absolute;
        top: 14px;
        transition: all 0.25s;
      }
    }
  }
}
</style>
