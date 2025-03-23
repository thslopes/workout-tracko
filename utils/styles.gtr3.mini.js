import { getDeviceInfo } from '@zos/device';
import { align, text_style } from '@zos/ui';

export const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = getDeviceInfo();


const calorieTextX = DEVICE_WIDTH / 2 - 144;
const calorieTextY = DEVICE_HEIGHT / 2 - 23;

export const CALORIE_TEXT = {
      x: calorieTextX,
      y: calorieTextY,
      w: 288,
      h: 46,
      color: 0xffffff,
      text_size: 36,
      align_h: align.CENTER_H,
      align_v: align.CENTER_V,
      text_style: text_style.NONE,
      text: 'TODO'
}


const heartRateTextX = DEVICE_WIDTH / 2 - 144;
const heartRateTextY = DEVICE_HEIGHT / 2 - 23 + 50;

export const HEART_RATE_TEXT = {
    x: heartRateTextX,
    y: heartRateTextY,
    w: 288,
    h: 46,
    color: 0xffffff,
    text_size: 36,
    align_h: align.CENTER_H,
    align_v: align.CENTER_V,
    text_style: text_style.NONE,
    text: 'TODO'
}