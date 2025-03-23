import { getText } from '@zos/i18n'
import { Calorie, HeartRate } from '@zos/sensor'
import { createWidget, prop, widget } from '@zos/ui'
import { CALORIE_LABEL, CALORIE_TEXT, HEART_RATE_TEXT, START_BUTTON, HR_LABEL } from '../utils/styles.gtr3.mini'
import { Time } from '@zos/sensor'


Page({
  state: {
    startTime: new Time().getTime(),
  },
  build() {
    const heartRate = new HeartRate()
    const calorie = new Calorie()

    createWidget(widget.TEXT, {
      ...HR_LABEL,
      text: getText('hr')
    })

    const hrText = createWidget(widget.TEXT, {
      ...HEART_RATE_TEXT,
      text: heartRate.getCurrent()
    })

    createWidget(widget.TEXT, {
      ...CALORIE_LABEL,
      text: getText('cal')
    })

    const calorieText = createWidget(widget.TEXT, {
      ...CALORIE_TEXT,
      text: calorie.getCurrent()
    })

    const calorieChangeCallback = () => {
      calorieText.setProperty(prop.TEXT, {
        text: calorie.getCurrent(),
      });
    };

    calorie.onChange(calorieChangeCallback)

    const hrChangeCallback = () => {
      hrText.setProperty(prop.TEXT, {
        text: heartRate.getCurrent(),
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

