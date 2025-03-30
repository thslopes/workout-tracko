import zdevice from '@zos/device';
import zui from '@zos/ui';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = zdevice.getDeviceInfo();

const startButtonWidth = 200;
const startButtonHeight = 80;
const startButtonX = DEVICE_WIDTH / 2 - startButtonWidth / 2;

export const FINISH_BUTTON = {
    x: startButtonX,
    y: 0,
    w: startButtonWidth,
    h: startButtonHeight,
    radius: 12,
    text_size: 30,
    color: 0xffffff,
    align_h: zui.align.CENTER_H,
    align_v: zui.align.CENTER_V,
    normal_color: 0x808080,
    press_color: 0xff0000
}

const finishButtonWidth = 200;
const finishButtonHeight = 80;
const finishButtonX = DEVICE_WIDTH / 2 - finishButtonWidth / 2;
const finishButtonY = DEVICE_HEIGHT - finishButtonHeight;

export const REST_BUTTON = {
    x: finishButtonX,
    y: finishButtonY,
    w: finishButtonWidth,
    h: finishButtonHeight,
    radius: 12,
    text_size: 30,
    color: 0x000000,
    align_h: zui.align.CENTER_H,
    align_v: zui.align.CENTER_V,
    normal_color: 0xffffa0,
    press_color: 0xff0000
}

export const GO_BUTTON = {
    x: finishButtonX,
    y: finishButtonY,
    w: finishButtonWidth,
    h: finishButtonHeight,
    radius: 12,
    text_size: 30,
    color: 0x000000,
    align_h: zui.align.CENTER_H,
    align_v: zui.align.CENTER_V,
    normal_color: 0x00ff00,
    press_color: 0xff0000
}

const { height: hrCalorieLabelHeight } = zui.getTextLayout('cal', {
    text_size: 18,
    text_width: 200
})

const hrCaloriesLabelY = startButtonHeight + 5;

export const HR_LABEL = {
    x: DEVICE_WIDTH / 2 - 150,
    y: hrCaloriesLabelY,
    w: 150,
    h: hrCalorieLabelHeight,
    color: 0xffffff,
    text_size: 23,
    align_h: zui.align.CENTER_H,
    align_v: zui.align.CENTER_V,
    text_style: zui.text_style.NONE
}

export const CALORIE_LABEL = {
    x: DEVICE_WIDTH / 2,
    y: hrCaloriesLabelY,
    w: 150,
    h: hrCalorieLabelHeight,
    color: 0xffffff,
    text_size: 23,
    align_h: zui.align.CENTER_H,
    align_v: zui.align.CENTER_V,
    text_style: zui.text_style.NONE
}

const { height: maxHRCalorieTextHeight } = zui.getTextLayout('0000', {
    text_size: 30,
    text_width: 200
})

const hrCaloriesTextY = hrCaloriesLabelY + hrCalorieLabelHeight;

const heartRateTextX = DEVICE_WIDTH / 2 - 150;

export const HEART_RATE_TEXT = {
    x: heartRateTextX,
    y: hrCaloriesTextY,
    w: 100,
    h: maxHRCalorieTextHeight,
    color: 0xffffff,
    text_size: 30,
    align_h: zui.align.CENTER_H,
    align_v: zui.align.CENTER_V,
    text_style: zui.text_style.NONE
}

const calorieTextX = DEVICE_WIDTH / 2 + 50;

export const CALORIE_TEXT = {
    x: calorieTextX,
    y: hrCaloriesTextY,
    w: 100,
    h: maxHRCalorieTextHeight,
    color: 0xffffff,
    text_size: 30,
    align_h: zui.align.CENTER_H,
    align_v: zui.align.CENTER_V,
    text_style: zui.text_style.NONE
}

export const SET_TEXT = {
    x: 0,
    y: hrCaloriesTextY + 20,
    w: DEVICE_WIDTH,
    h: startButtonHeight,
    color: 0xffffff,
    text_size: 24,
    align_h: zui.align.CENTER_H,
    align_v: zui.align.CENTER_V,
    text_style: zui.text_style.NONE
}

export const EXERCISE_TEXT = {
    x: 0,
    y: DEVICE_HEIGHT / 2 - maxHRCalorieTextHeight / 2,
    w: DEVICE_WIDTH,
    h: startButtonHeight,
    color: 0xffffff,
    text_size: 30,
    align_h: zui.align.CENTER_H,
    align_v: zui.align.CENTER_V,
    text_style: zui.text_style.WRAP
}

const { width: timeTextWitdh, height: timeTextHeight } = zui.getTextLayout('00:00:00.0', {
    text_size: 30,
    text_width: 200
})

const { height: totalTimeTextHeight } = zui.getTextLayout('00:00:00.0', {
    text_size: 18,
    text_width: 200
})

const timeTextX = DEVICE_WIDTH / 2 - timeTextWitdh / 2;
const totalTimeTextY = DEVICE_HEIGHT - finishButtonHeight - totalTimeTextHeight - 20;
const timeTextY = totalTimeTextY - 30;

export const TIME_TEXT = {
    x: timeTextX,
    y: timeTextY,
    w: timeTextWitdh,
    h: timeTextHeight,
    color: 0xffffff,
    text_size: 30,
    align_h: zui.align.CENTER_H,
    align_v: zui.align.CENTER_V,
    text_style: zui.text_style.NONE
}

export const TOTAL_TIME = {
    x: timeTextX,
    y: totalTimeTextY,
    w: timeTextWitdh,
    h: timeTextHeight,
    color: 0xffffff,
    text_size: 18,
    align_h: zui.align.CENTER_H,
    align_v: zui.align.CENTER_V,
    text_style: zui.text_style.NONE
}