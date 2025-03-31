import { getText } from '@zos/i18n'
import { back, replace } from '@zos/router'
import { Calorie, Distance, HeartRate, Step, Time, Vibrator, VIBRATOR_SCENE_STRONG_REMINDER } from '@zos/sensor'
import { sessionStorage } from '@zos/storage'
import { createWidget, prop, widget } from '@zos/ui'
import * as styles from './workout.styles'
import { setPageBrightTime } from '@zos/display'


Page({
  state: {
    startTime: 0,
    intervalTime: 0,
    timerId: null,
    initialCalorie: 0,
    initialDistance: 0,
    initialSteps: 0,
    actualSet: 1,
    actualExercise: 0
  },
  loadState() {
    this.state.workout = JSON.parse(sessionStorage.getItem('workout'))
    this.state.startTime = sessionStorage.getItem('startTime', 0)
    this.state.initialCalorie = sessionStorage.getItem('initialCalorie', 0)
    this.state.initialDistance = sessionStorage.getItem('initialDistance', 0)
    this.state.initialSteps = sessionStorage.getItem('initialSteps', 0)
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
    const distance = new Distance()
    const step = new Step()

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

    if (sessionStorage.getItem('external', 0)) {

      const stepCount = createWidget(widget.TEXT, {
        ...styles.STEPS_TEXT,
        text: step.getCurrent() - this.state.initialSteps
      })
      const distanceCount = createWidget(widget.TEXT, {
        ...styles.DISTANCE_TEXT,
        text: distance.getCurrent() - this.state.initialDistance
      })

      createWidget(widget.TEXT, {
        ...styles.STEPS_LABEL,
        text: 'steps'
      })
      createWidget(widget.TEXT, {
        ...styles.DISTANCE_LABEL,
        text: 'distance'
      })

      const stepCountChangeCallback = () => {
        stepCount.setProperty(prop.TEXT, {
          text: step.getCurrent() - this.state.initialSteps
        });
      };
      step.onChange(stepCountChangeCallback)

      const distanceCountChangeCallback = () => {
        distanceCount.setProperty(prop.TEXT, {
          text: distance.getCurrent() - this.state.initialDistance
        });
      };
      distance.onChange(distanceCountChangeCallback)
    }


    const calorieText = createWidget(widget.TEXT, {
      ...styles.CALORIE_TEXT,
      text: calorie.getCurrent() - this.state.initialCalorie
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
        text: heartRate.getCurrent(),
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
        sessionStorage.setItem('totalDistance', distance.getCurrent() - this.state.initialDistance)
        sessionStorage.setItem('totalSteps', step.getCurrent() - this.state.initialSteps)
        replace({ url: 'page/resume', params: '' })
      }
    })

    createWidget(widget.BUTTON, {
      ...styles.GO_BUTTON,
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

    const restTime = sessionStorage.getItem('rest', 60)
    const result = setPageBrightTime({
      brightTime: 1000 * restTime,
    })
    setTimeout(() => {
      const vibrator = new Vibrator()

      // set scene
      vibrator.start({ mode: VIBRATOR_SCENE_STRONG_REMINDER })
      setTimeout(() => {
        vibrator.stop()
        back()
      }, 1000 * 3)
    }, 1000 * (restTime - 3))
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

