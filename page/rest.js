import { getText } from '@zos/i18n'
import { back } from '@zos/router'
import { Calorie, HeartRate, Time } from '@zos/sensor'
import { createWidget, prop, widget } from '@zos/ui'
import * as styles from './index.styles'
import { sessionStorage } from '@zos/storage'


Page({
  state: {
    startTime: 0,
    intervalTime: 0,
    timerId: null,
    initialCalorie: 0,
    actualSet: 1,
    actualExercise: 0,
    workout: [
      {
        'name': "Graviton",
        'sets': 4,
      },
      {
        'name': "Remada Articulada 20kg",
        'sets': 3,
      },
      {
        'name': "Serrote 12kg",
        'sets': 3,
      },
      {
        'name': "Rosca Martelo 9kg",
        'sets': 3,
      },
      {
        'name': "Rosca Scott 10kg",
        'sets': 3,
      }
    ]
  },
  loadState() {
    this.state.startTime = sessionStorage.getItem('startTime', 0)
    this.state.initialCalorie = sessionStorage.getItem('initialCalorie', 0)
    this.state.actualSet = sessionStorage.getItem('actualSet', 1)
    this.state.actualExercise = sessionStorage.getItem('actualExercise', 0)
    console.log('startTime', this.state.startTime)
    console.log('initialCalorie', this.state.initialCalorie)
    console.log('actualSet', this.state.actualSet)
    console.log('actualExercise', this.state.actualExercise)
  },
  build() {
    this.loadState()
    const heartRate = new HeartRate()
    const calorie = new Calorie()

    this.state.initialCalorie = calorie.getCurrent()

    createWidget(widget.TEXT, {
      ...styles.HR_LABEL,
      text: getText('hr')
    })

    const hrText = createWidget(widget.TEXT, {
      ...styles.HEART_RATE_TEXT,
      text: heartRate.getCurrent()
    })

    createWidget(widget.TEXT, {
      ...styles.CALORIE_LABEL,
      text: getText('cal')
    })

    const calorieText = createWidget(widget.TEXT, {
      ...styles.CALORIE_TEXT,
      text: 0
    })

    const setText = createWidget(widget.TEXT, {
      ...styles.SET_TEXT,
      text: `${this.state.actualSet} / ${this.state.workout[this.state.actualExercise].sets}`
    })

    const exerciseText = createWidget(widget.TEXT, {
      ...styles.EXERCISE_TEXT,
      text: this.state.workout[this.state.actualExercise].name
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
      ...styles.START_BUTTON,
      text: 'FINISH',
      click_func: (btn) => {
        back()
      }
    })

    createWidget(widget.BUTTON, {
      ...styles.FINISH_BUTTON,
      text: 'GO',
      click_func: () => {
        back()
      }
    })

    const intervalTimer = createWidget(widget.TEXT, {
      ...styles.TIME_TEXT,
      text: '00:00:00.0'
    })

    const totalTimeTimer = createWidget(widget.TEXT, {
      ...styles.TOTAL_TIME,
      text: '00:00:00.0'
    })

    this.state.intervalTime = new Time().getTime()
    setInterval(setIntervalTime(this.state.startTime, totalTimeTimer), 100)
    this.state.timerId = setInterval(setIntervalTime(this.state.intervalTime, intervalTimer), 100)
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

