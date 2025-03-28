import { getText } from '@zos/i18n'
import { back, push } from '@zos/router'
import { Calorie, HeartRate, Time } from '@zos/sensor'
import { sessionStorage } from '@zos/storage'
import { createWidget, prop, widget } from '@zos/ui'
import { log } from '@zos/utils'
import { getActualSet } from '../utils/exercise'
import * as styles from './index.styles'


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
    if (!this.state.startTime) {
      this.state.startTime = new Time().getTime()
    }

    this.state.initialCalorie = sessionStorage.getItem('initialCalorie')

    this.state.actualSet = sessionStorage.getItem('actualSet')
    if (!this.state.actualSet) {
      this.state.actualSet = 1
    }

    this.state.actualExercise = sessionStorage.getItem('actualExercise')
    if (!this.state.actualExercise) {
      this.state.actualExercise = 0
    }

    console.log('startTime', this.state.startTime)
    console.log('initialCalorie', this.state.initialCalorie)
    console.log('actualSet', this.state.actualSet)
    console.log('actualExercise', this.state.actualExercise)
  },
  saveState() {
    sessionStorage.setItem('actualSet', this.state.actualSet)
    sessionStorage.setItem('actualExercise', this.state.actualExercise)
    sessionStorage.setItem('startTime', this.state.startTime)
    sessionStorage.setItem('initialCalorie', this.state.initialCalorie)
  },
  build() {
    this.loadState()
    const heartRate = new HeartRate()
    const calorie = new Calorie()

    if (!this.state.initialCalorie) {
      this.state.initialCalorie = calorie.getCurrent()
    }

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
      text: 'Rest',
      click_func: () => {
        const { actualSet, actualExercise, currentExercise } = getActualSet(this.state.actualSet, this.state.actualExercise, this.state.workout)
        this.state.actualSet = actualSet
        this.state.actualExercise = actualExercise
        exerciseText.setProperty(prop.TEXT, {
          text: currentExercise.name
        })
        setText.setProperty(prop.TEXT, {
          text: `${actualSet} / ${currentExercise.sets}`
        })
        this.saveState()
        push({ url: 'page/rest', params: '' })
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

    console.log('startTime', this.state.startTime)
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

