import { getText } from '@zos/i18n'
import { push, replace } from '@zos/router'
import { Calorie, HeartRate, Time, Vibrator, VIBRATOR_SCENE_STRONG_REMINDER } from '@zos/sensor'
import { sessionStorage } from '@zos/storage'
import { createWidget, prop, widget } from '@zos/ui'
import { getActualSet } from '../utils/exercise'
import * as styles from './workout.styles'


Page({
  state: {
    startTime: 0,
    intervalTime: 0,
    timerId: null,
    initialCalorie: 0,
    actualSet: 1,
    actualExercise: 0,
    actualRest: 0
  },
  loadState() {
    this.state.workout = JSON.parse(sessionStorage.getItem('workout'))
    this.state.startTime = sessionStorage.getItem('startTime', 0)
    if (!this.state.startTime) {
      this.state.startTime = new Time().getTime()
      sessionStorage.setItem('startTime', this.state.startTime)
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
    sessionStorage.setItem('rest', this.state.rest)
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
      text: calorie.getCurrent() - this.state.initialCalorie
    })

    if (this.state.workout[this.state.actualExercise].sets > 0) {
      const setText = createWidget(widget.TEXT, {
        ...styles.SET_TEXT,
        text: `${this.state.actualSet} / ${this.state.workout[this.state.actualExercise].sets}`
      })
    }

    const exerciseText = createWidget(widget.TEXT, {
      ...styles.EXERCISE_TEXT,
      text: this.state.workout[this.state.actualExercise].name
    })

    this.state.rest = this.state.workout[this.state.actualExercise].rest

    const calorieChangeCallback = () => {
      calorieText.setProperty(prop.TEXT, {
        text: calorie.getCurrent() - this.state.initialCalorie,
      });
    };

    calorie.onChange(calorieChangeCallback)

    const hrChangeCallback = () => {
      if (!sessionStorage.getItem('hrData')) {
        sessionStorage.setItem('hrData', JSON.stringify([]))
      }
      const hrData = JSON.parse(sessionStorage.getItem('hrData'))
      const currentTime = new Time().getTime()
      const currentHr = heartRate.getCurrent()

      hrData.push({
        time: currentTime,
        hr: currentHr
      })

      sessionStorage.setItem('hrData', JSON.stringify(hrData))

      hrText.setProperty(prop.TEXT, {
        text: currentHr,
      });
    };

    heartRate.onCurrentChange(hrChangeCallback)

    createWidget(widget.BUTTON, {
      ...styles.FINISH_BUTTON,
      text: 'FINISH',
      click_func: () => {
        sessionStorage.setItem('endTime', new Time().getTime())
        sessionStorage.setItem('startTime', this.state.startTime)
        sessionStorage.setItem('totalCalorie', calorie.getCurrent() - this.state.initialCalorie)
        replace({ url: 'page/resume', params: '' })
      }
    })

    const shouldDisplayRestButton = this.state.workout[this.state.actualExercise].sets > this.state.actualSet || this.state.workout.length > this.state.actualExercise + 1
    if (shouldDisplayRestButton) {

      const buttonLabel = this.state.workout[this.state.actualExercise].sets > this.state.actualSet ? 'Next Set' : 'Next Exercise'

      createWidget(widget.BUTTON, {
        ...styles.REST_BUTTON,
        text: buttonLabel,
        click_func: () => {
          const reload = !(this.state.workout[this.state.actualExercise].sets > 0)
          const { actualSet, actualExercise } = getActualSet(this.state.actualSet, this.state.actualExercise, this.state.workout)
          this.state.actualSet = actualSet
          this.state.actualExercise = actualExercise
          this.saveState()

          if (reload) {
            replace({ url: 'page/doing', params: '' })
          } else {
            push({ url: 'page/rest', params: '' })
          }
        }
      })
    }

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

    if (this.state.workout[this.state.actualExercise].duration) {
      setTimeout(() => {
        const vibrator = new Vibrator()
        vibrator.start({ mode: VIBRATOR_SCENE_STRONG_REMINDER })
        setTimeout(() => {
          vibrator.stop()
          const reload = !(this.state.workout[this.state.actualExercise].sets > 0)
          const { actualSet, actualExercise } = getActualSet(this.state.actualSet, this.state.actualExercise, this.state.workout)
          this.state.actualSet = actualSet
          this.state.actualExercise = actualExercise
          this.saveState()
          if (reload) {
            replace({ url: 'page/doing', params: '' })
          } else {
            push({ url: 'page/rest', params: '' })
          }
        }, 1000 * 3)
      }, 1000 * (this.state.workout[this.state.actualExercise].duration - 3))
    }
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

