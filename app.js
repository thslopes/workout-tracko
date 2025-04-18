import { getPackageInfo } from '@zos/app'
import * as ble from '@zos/ble'
import { setWakeUpRelaunch } from '@zos/display'
import { log as Logger } from '@zos/utils'
import './shared/device-polyfill'
import { MessageBuilder } from './shared/message'

const logger = Logger.getLogger('todo-list-app')

App({
  globalData: {
    messageBuilder: null
  },
  onCreate() {
    logger.log('app onCreate invoked')
    const { appId } = getPackageInfo()
    const messageBuilder = new MessageBuilder({ appId, appDevicePort: 20, appSidePort: 0, ble })
    this.globalData.messageBuilder = messageBuilder
    messageBuilder.connect()
    setWakeUpRelaunch({
      relaunch: true,
    })
  },

  onDestroy() {
    logger.log('app onDestroy invoked')
    this.globalData.messageBuilder && this.globalData.messageBuilder.disConnect()
  }
})
