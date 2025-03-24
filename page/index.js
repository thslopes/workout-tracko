import { getText } from '@zos/i18n'
import { Calorie, HeartRate, Time } from '@zos/sensor'
import { createWidget, prop, widget } from '@zos/ui'
import { CALORIE_LABEL, CALORIE_TEXT, HEART_RATE_TEXT, HR_LABEL, START_BUTTON, TIME_TEXT, TOTAL_TIME } from '../utils/styles.gtr3.mini'


Page({
  state: {
    startTime: 0,
    intervalTime: 0,
    started: false,
    timerId: null,
    initialCalorie: 0,
  },
  build() {
    const heartRate = new HeartRate()
    const calorie = new Calorie()

    this.state.initialCalorie = calorie.getCurrent()

    createWidget(widget.TEXT, {
      ...HR_LABEL,
      text: getText('hr')
    })

    const hrText = createWidget(widget.TEXT, {
      ...HEART_RATE_TEXT,
      text: heartRate.getCurrent()
    })

    createWidget(widget.TEXT, {
      ...CALORIE_LABEL,
      text: getText('cal')
    })

    const calorieText = createWidget(widget.TEXT, {
      ...CALORIE_TEXT,
      text: 0
    })

    const calorieChangeCallback = () => {
      calorieText.setProperty(prop.TEXT, {
        text: calorie.getCurrent() - this.state.initialCalorie,
      });
    };

    calorie.onChange(calorieChangeCallback)

    const hrChangeCallback = () => {
      hrText.setProperty(prop.TEXT, {
        text: heartRate.getCurrent(),
      });
    };

    heartRate.onCurrentChange(hrChangeCallback)

    createWidget(widget.BUTTON, {
      ...START_BUTTON,
      text: 'Start',
      click_func: (btn) => {
        if (this.state.startTime === 0) {
          this.state.startTime = new Time().getTime()
          setInterval(setIntervalTime(this.state.startTime, totalTimeTimer), 100)
        }

        if (this.state.started) {
          this.state.started = false
          btn.setProperty(prop.TEXT, { text: 'Start' })
          clearInterval(this.state.timerId)
        } else {
          this.state.started = true
          this.state.intervalTime = new Time().getTime()
          btn.setProperty(prop.TEXT, { text: 'Stop' })
          this.state.timerId = setInterval(setIntervalTime(this.state.intervalTime, intervalTimer), 100)
        }
      }
    })

    const intervalTimer = createWidget(widget.TEXT, {
      ...TIME_TEXT,
      text: '00:00:00.0'
    })

    const totalTimeTimer = createWidget(widget.TEXT, {
      ...TOTAL_TIME,
      text: '00:00:00.0'
    })
  }
})

const setIntervalTime = (startTime, component) => {
  return () => {
      const currentTime = new Time().getTime()
      const elapsedTime = currentTime - startTime
      const elapsedHours = Math.floor(elapsedTime / 1000 / 60 / 60)
      const elapsedMinutes = Math.floor(elapsedTime / 1000 / 60) % 60
      const elapsedSeconds = Math.floor(elapsedTime / 1000) % 60
      const elapsedMilliseconds = Math.floor(elapsedTime / 100) % 10
      let formattedTime = `${String(elapsedMinutes).padStart(2, '0')}:${String(elapsedSeconds).padStart(2, '0')}.${elapsedMilliseconds}`
      if (elapsedHours > 0) {
          formattedTime = `${String(elapsedHours).padStart(2, '0')}:${formattedTime}`
      }
      component.setProperty(prop.TEXT, {
          text: formattedTime
      })
  }
}

