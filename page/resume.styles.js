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

const graphicY = DEVICE_HEIGHT/2 - 70;
const graphicHeight = 140;

const defaultHRZoneHeight = graphicHeight/7;
const maxHRY = graphicY;
const vo2MaxHRY = maxHRY + defaultHRZoneHeight;
const anaerobicHRY = vo2MaxHRY + defaultHRZoneHeight;
const aerobicHRY = anaerobicHRY + defaultHRZoneHeight;
const fatBurningHRY = aerobicHRY + defaultHRZoneHeight;
const warmingUpHRY = fatBurningHRY + defaultHRZoneHeight;
const restingHRY = warmingUpHRY + defaultHRZoneHeight;

export const HEART_RATE_GRAPHIC = {
  x: 10,
  y: graphicY,
  w: DEVICE_WIDTH-20,
  h: graphicHeight,
  line_color: 0x000000,
  line_width: 4
}

export const RESTING_HR_ZONE = {
  x: 0,
  y: restingHRY,
  w: DEVICE_WIDTH,
  h: defaultHRZoneHeight,
  color: 0xA0D8FF, // Soft Blue
}

export const WARMING_UP_HR_ZONE = {
  x: 0,
  y: warmingUpHRY,
  w: DEVICE_WIDTH,
  h: defaultHRZoneHeight,
  color: 0xa0ffa0, // Light Green
}

export const FAT_BURNING_HR_ZONE = {
  x: 0,
  y: fatBurningHRY,
  w: DEVICE_WIDTH,
  h: defaultHRZoneHeight,
  color: 0x00ff00, // Vibrant Green
}

export const AEROBIC_HR_ZONE = {
  x: 0,
  y: aerobicHRY,
  w: DEVICE_WIDTH,
  h: defaultHRZoneHeight,
  color: 0xffffa0, // Yellow
}

export const ANAEROBIC_HR_ZONE = {
  x: 0,
  y: anaerobicHRY,
  w: DEVICE_WIDTH,
  h: defaultHRZoneHeight,
  color: 0xffa0a0, // Orange
}

export const MAX_VO2_HR_ZONE = {
  x: 0,
  y: vo2MaxHRY,
  w: DEVICE_WIDTH,
  h: defaultHRZoneHeight,
  color: 0xff7070, // Bright Orange-Red
}

export const MAX_HR_ZONE = {
  x: 0,
  y: maxHRY,
  w: DEVICE_WIDTH,
  h: defaultHRZoneHeight,
  color: 0xff4040, // Bright Red
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
