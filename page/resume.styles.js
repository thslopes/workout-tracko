import zdevice from '@zos/device';
import zui from '@zos/ui';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = zdevice.getDeviceInfo();

const startButtonHeight = 20;

const { height: hrCalorieLabelHeight } = zui.getTextLayout('cal', {
  text_size: 23,
  text_width: 200
})

const hrCaloriesLabelY = startButtonHeight + 5;

export const CALORIE_LABEL = {
  x: 0,
  y: hrCaloriesLabelY,
  w: DEVICE_WIDTH,
  h: hrCalorieLabelHeight,
  color: 0xffffff,
  text_size: 23,
  align_h: zui.align.CENTER_H,
  align_v: zui.align.CENTER_V,
  text_style: zui.text_style.NONE
}

const { height: maxHRCalorieTextHeight } = zui.getTextLayout('0000', {
  text_size: 36,
  text_width: 200
})

const hrCaloriesTextY = hrCaloriesLabelY + hrCalorieLabelHeight;

export const HEART_RATE_GRAPHIC = {
  x: 10,
  y: DEVICE_HEIGHT/2 - 45,
  w: DEVICE_WIDTH-20,
  h: 90,
  line_color: 0xff0000,
  line_width: 6
}

export const GREEN_HR_ZONE = {
  x: 0,
  y: DEVICE_HEIGHT/2 + 15,
  w: DEVICE_WIDTH,
  h: 30,
  // soft green
  color: 0xa0ffa0,
}

export const YELLOW_HR_ZONE = {
  x: 0,
  y: DEVICE_HEIGHT/2 - 15,
  w: DEVICE_WIDTH,
  h: 30,
  // soft yellow
  color: 0xffff00,
}
export const RED_HR_ZONE = {
  x: 0,
  y: DEVICE_HEIGHT/2 - 45,
  w: DEVICE_WIDTH,
  h: 30,
  // soft red
  color: 0xff7070,
}


export const CALORIE_TEXT = {
  x: 0,
  y: hrCaloriesTextY,
  w: DEVICE_WIDTH,
  h: maxHRCalorieTextHeight,
  color: 0xffffff,
  text_size: 36,
  align_h: zui.align.CENTER_H,
  align_v: zui.align.CENTER_V,
  text_style: zui.text_style.NONE
}

const { height: timeTextHeight } = zui.getTextLayout('00:00:00.0', {
  text_size: 36,
  text_width: 200
})

const totalTimeTextY = DEVICE_HEIGHT - timeTextHeight - 20;

export const TOTAL_TIME = {
  x: 0,
  y: totalTimeTextY,
  w: DEVICE_WIDTH,
  h: timeTextHeight,
  color: 0xffffff,
  text_size: 36,
  align_h: zui.align.CENTER_H,
  align_v: zui.align.CENTER_V,
  text_style: zui.text_style.NONE
}

const totalTimeLabelY = totalTimeTextY - hrCalorieLabelHeight;

export const TOTAL_TIME_LABEL = {
  x: 0,
  y: totalTimeLabelY,
  w: DEVICE_WIDTH,
  h: hrCalorieLabelHeight,
  color: 0xffffff,
  text_size: 23,
  align_h: zui.align.CENTER_H,
  align_v: zui.align.CENTER_V,
  text_style: zui.text_style.NONE
}
