import { Calorie, HeartRate } from '@zos/sensor'
import { createWidget, prop, widget } from '@zos/ui'
import { CALORIE_TEXT, HEART_RATE_TEXT } from '../utils/styles.gtr3.mini'


Page({
  build() {
    const heartRate= new HeartRate()
    const calorie= new Calorie()

    const hrText = createWidget(widget.TEXT, {
      ...HEART_RATE_TEXT,
      text: 'HR: ' + heartRate.getCurrent()
    })

    const calorieText = createWidget(widget.TEXT, {
      ...CALORIE_TEXT,
      text: 'CAL: ' + calorie.getCurrent()
    })

    const calorieChangeCallback = () => {
      console.log(`EVENT-CHANGE: ${calorie.getCurrent()}`)
      calorieText.setProperty(prop.MORE, {
        text: `New CAL: ${calorie.getCurrent()}`,
      });
    };

    calorie.onChange(calorieChangeCallback)

    const hrChangeCallback = () => {
      hrText.setProperty(prop.MORE, {
        text: `New HR: ${heartRate.getCurrent()}`,
      });
    };

    heartRate.onCurrentChange(hrChangeCallback)
  }
})

