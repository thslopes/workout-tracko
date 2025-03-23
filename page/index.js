import { Calorie, HeartRate } from '@zos/sensor'
import { createWidget, prop, widget } from '@zos/ui'
import { CALORIE_TEXT, HEART_RATE_TEXT, START_BUTTON } from '../utils/styles.gtr3.mini'


Page({
  build() {
    const heartRate = new HeartRate()
    const calorie = new Calorie()

    const hrText = createWidget(widget.TEXT, {
      ...HEART_RATE_TEXT,
      text: 'HR: ' + heartRate.getCurrent()
    })

    const calorieText = createWidget(widget.TEXT, {
      ...CALORIE_TEXT,
      text: 'CAL: ' + calorie.getCurrent()
    })

    const calorieChangeCallback = () => {
      calorieText.setProperty(prop.TEXT, {
        text: `New CAL: ${calorie.getCurrent()}`,
      });
    };

    calorie.onChange(calorieChangeCallback)

    const hrChangeCallback = () => {
      hrText.setProperty(prop.TEXT, {
        text: `New HR: ${heartRate.getCurrent()}`,
      });
    };

    heartRate.onCurrentChange(hrChangeCallback)

    const bbtn = createWidget(widget.BUTTON, {
      ...START_BUTTON,
      text: 'Start',
      click_func: (btn) => {
        console.log('Button clicked')
        btn.setProperty(prop.TEXT, { text: 'Clicou' })
      }
    })
  }
})

