import { setStatusBarVisible, updateStatusBarTitle } from '@zos/ui'

App({
  onCreate(options) {
    console.log('app on create invoke')
    const title = 'Mini Program Title'

    updateStatusBarTitle(title)
    setStatusBarVisible(true)
  },

  onDestroy(options) {
    console.log('app on destroy invoke')
  }
})
