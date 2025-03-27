import { setWakeUpRelaunch } from '@zos/display'
import { setStatusBarVisible, updateStatusBarTitle } from '@zos/ui'

App({
  onCreate(options) {
    console.log('app on create invoke')
    const title = 'Tracko'

    updateStatusBarTitle(title)
    setStatusBarVisible(true)
    setWakeUpRelaunch({
      relaunch: true,
    })
  },

  onDestroy(options) {
    console.log('app on destroy invoke')
  }
})
