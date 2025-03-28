import { push } from '@zos/router'
import { createWidget, widget } from '@zos/ui'
import * as styles from './index.styles'


Page({
  state: {
  },
  build() {
    createWidget(widget.BUTTON, {
      ...styles.START_BUTTON,
      text: 'Start',
      click_func: () => {
        push({url: 'page/doing', params:{}})
      }
    })
  }
})
