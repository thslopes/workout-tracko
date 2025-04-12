import { setPageBrightTime } from '@zos/display'
import { push } from '@zos/router'
import { Vibrator, VIBRATOR_SCENE_STRONG_REMINDER } from '@zos/sensor'
import { localStorage } from '@zos/storage'
import { createWidget, widget } from '@zos/ui'
import * as styles from './workout.styles'
import WorkoutBase from './workoutBase'

const workoutBase = new WorkoutBase()

Page({
  state: workoutBase.state,
  loadState: workoutBase.loadState,
  saveState: workoutBase.saveState,
  build() {
    workoutBase.baseBuild()

    const restTime = localStorage.getItem('rest', 60)

    createWidget(widget.BUTTON, {
      ...styles.GO_BUTTON,
      text: 'GO',
      click_func: () => {
        this.saveState()
        push({ url: 'page/doing', params: '' })
      }
    })

    const result = setPageBrightTime({
      brightTime: 1000 * restTime,
    })
    setTimeout(() => {
      const vibrator = new Vibrator()

      // set scene
      vibrator.start({ mode: VIBRATOR_SCENE_STRONG_REMINDER })
      setTimeout(() => {
        vibrator.stop()
        push({ url: 'page/doing', params: '' })
      }, 1000 * 3)
    }, 1000 * (restTime - 3))
  }
})
