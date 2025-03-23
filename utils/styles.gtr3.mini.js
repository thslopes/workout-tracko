import zdevice from '@zos/device';
import zui from '@zos/ui';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = zdevice.getDeviceInfo();

const startButtonWidth = 200;
const startButtonHeight = 100;
const startButtonX = DEVICE_WIDTH / 2 - startButtonWidth / 2;

export const START_BUTTON = {
    x: startButtonX,
    y: 0,
    w: startButtonWidth,
    h: startButtonHeight,
    radius: 12,
    text_size: 36,
    color: 0xffffff,
    align_h: zui.align.CENTER_H,
    align_v: zui.align.CENTER_V,
    normal_color: 0x00dd00,
    press_color: 0xff0000
}

const { width: maxHRTextWidth, height: maxHRTextHeight } = zui.getTextLayout('0000', {
    text_size: 36,
    text_width: 200
})

const heartRateTextX = DEVICE_WIDTH / 2 + 5;
const heartRateTextY = startButtonHeight + 20;

export const HEART_RATE_TEXT = {
    x: heartRateTextX,
    y: heartRateTextY,
    w: maxHRTextWidth,
    h: maxHRTextHeight,
    color: 0xffffff,
    text_size: 36,
    align_h: zui.align.LEFT,
    align_v: zui.align.CENTER_V,
    text_style: zui.text_style.NONE
}

export const HR_LABEL = {
    x: 0,
    y: heartRateTextY,
    w: DEVICE_WIDTH / 2 - 5,
    h: maxHRTextHeight,
    color: 0xffffff,
    text_size: 36,
    align_h: zui.align.RIGHT,
    align_v: zui.align.CENTER_V,
    text_style: zui.text_style.NONE
}


const { height: calorieLabelHeight } = zui.getTextLayout('cal', {
    text_size: 36,
    text_width: 200
})

const { width: maxCalTextWidth, height: maxCalTextHeight } = zui.getTextLayout('0000', {
    text_size: 36,
    text_width: 200
})

const calorieLabelY = heartRateTextY + maxHRTextHeight;

export const CALORIE_LABEL = {
    x: 0,
    y: calorieLabelY,
    w: DEVICE_WIDTH / 2 - 5,
    h: calorieLabelHeight,
    color: 0xffffff,
    text_size: 36,
    align_h: zui.align.RIGHT,
    align_v: zui.align.CENTER_V,
    text_style: zui.text_style.NONE
}

const calorieTextX = DEVICE_WIDTH / 2 + 5;
const calorieTextY = calorieLabelY;

export const CALORIE_TEXT = {
    x: calorieTextX,
    y: calorieTextY,
    w: maxCalTextWidth,
    h: maxCalTextHeight,
    color: 0xffffff,
    text_size: 36,
    align_h: zui.align.LEFT,
    align_v: zui.align.CENTER_V,
    text_style: zui.text_style.NONE
}
