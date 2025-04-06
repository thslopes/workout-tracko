import { setPageBrightTime } from '@zos/display'
import { back } from '@zos/router'
import { Vibrator, VIBRATOR_SCENE_STRONG_REMINDER } from '@zos/sensor'
import { sessionStorage } from '@zos/storage'
import { createWidget, widget } from '@zos/ui'
import * as styles from './workout.styles'
import WorkoutBase from './workoutBase'

const workoutBase = new WorkoutBase()

Page({
  state: workoutBase.state,
  loadState: workoutBase.loadState,
  build() {
    workoutBase.baseBuild()

    const restTime = sessionStorage.getItem('rest', 60)

    createWidget(widget.BUTTON, {
      ...styles.GO_BUTTON,
      text: 'GO',
      click_func: () => {
        back()
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
        back()
      }, 1000 * 3)
    }, 1000 * (restTime - 3))
  }
})
