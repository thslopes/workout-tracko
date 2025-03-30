import zdevice from '@zos/device';
import zui from '@zos/ui';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = zdevice.getDeviceInfo();

const startButtonWidth = 200;
const startButtonHeight = 80;
const startButtonX = DEVICE_WIDTH / 2 - startButtonWidth / 2;

export const START_BUTTON = {
    x: startButtonX,
    y: 30,
    w: startButtonWidth,
    h: startButtonHeight,
    radius: 12,
    text_size: 30,
    color: 0xffffff,
    align_h: zui.align.CENTER_H,
    align_v: zui.align.CENTER_V,
    normal_color: 0x00dd00,
    press_color: 0xff0000
}
