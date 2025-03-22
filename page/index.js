import { FatBurning } from '@zos/sensor'
import { align, createWidget, text_style, widget } from '@zos/ui'


Page({
  state: {
    fatBurning: new FatBurning(),
    text: null
  },
  onInit() {
    this.state.fatBurning.onChange(() => {
      console.log('onChange', this.state.fatBurning.getCurrent())
      this.state.text.text = `${this.state.fatBurning.getCurrent()}`
    })
    // set screen alweys on
    this.setScreenOn(true)
  },
  build() {
    const text = createWidget(widget.TEXT, {
      x: 0,
      y: 100,
      w: 288,
      h: 46,
      color: 0xffffff,
      text_size: 36,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text_style: text_style.NONE,
      text: `${this.state.fatBurning.getCurrent()}`
    })
    this.state.text = text
  }
})

