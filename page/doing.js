import { setPageBrightTime } from '@zos/display'
import { push } from '@zos/router'
import { Vibrator, VIBRATOR_SCENE_STRONG_REMINDER } from '@zos/sensor'
import { createWidget, widget } from '@zos/ui'
import { getActualSet } from '../utils/exercise'
import * as styles from './workout.styles'
import WorkoutBase from './workoutBase'

const workoutBase = new WorkoutBase()

Page({
  state: workoutBase.state,
  loadState: workoutBase.loadState,
  saveState: workoutBase.saveState,
  build() {
    workoutBase.baseBuild()

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

    if (this.state.workout[this.state.actualExercise].duration) {
      const result = setPageBrightTime({
        brightTime: this.state.workout[this.state.actualExercise].duration,
      })

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
