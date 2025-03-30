import { getText } from '@zos/i18n'
import { Time } from '@zos/sensor'
import { sessionStorage } from '@zos/storage'
import { createWidget, widget } from '@zos/ui'
import * as styles from './resume.styles'


Page({
    build() {
        createWidget(widget.TEXT, {
            ...styles.CALORIE_LABEL,
            text: getText('cal')
        })

        createWidget(widget.TEXT, {
            ...styles.TOTAL_TIME_LABEL,
            text: "Total Time"
        })

        const calorieText = createWidget(widget.TEXT, {
            ...styles.CALORIE_TEXT,
            text: sessionStorage.getItem('totalCalorie')
        })

        const totalTime = sessionStorage.getItem('endTime') - sessionStorage.getItem('startTime')

        //format totalTime to 00:00:00.0
        const totalTimeHours = Math.floor(totalTime/1000/60/60)
        const totalTimeMinutes = Math.floor((totalTime/1000/60)%60)
        const totalTimeSeconds = Math.floor((totalTime/1000)%60)
        const totalTimeMilliseconds = Math.floor((totalTime%1000)/100)
        const totalTimeText = `${totalTimeHours.toString().padStart(2, '0')}:${totalTimeMinutes.toString().padStart(2, '0')}:${totalTimeSeconds.toString().padStart(2, '0')}.${totalTimeMilliseconds}`

        const totalTimeTimer = createWidget(widget.TEXT, {
            ...styles.TOTAL_TIME,
            text: totalTimeText
        })

        console.log('startTime', this.state.startTime)
        this.state.intervalTime = new Time().getTime()
        this.buildGraph()
    },
    buildGraph() {
        createWidget(widget.FILL_RECT, {
            ...styles.RESTING_HR_ZONE,
        })
        createWidget(widget.FILL_RECT, {
            ...styles.WARMING_UP_HR_ZONE,
        })
        createWidget(widget.FILL_RECT, {
            ...styles.FAT_BURNING_HR_ZONE,
        })
        createWidget(widget.FILL_RECT, {
            ...styles.AEROBIC_HR_ZONE,
        })
        createWidget(widget.FILL_RECT, {
            ...styles.ANAEROBIC_HR_ZONE,
        })
        createWidget(widget.FILL_RECT, {
            ...styles.MAX_VO2_HR_ZONE,
        })
        createWidget(widget.FILL_RECT, {
            ...styles.MAX_HR_ZONE,
        })
        const data = JSON.parse(sessionStorage.getItem('hrData'))
        // const data = [
        //     { time: 0, hr: 72 },
        //     { time: 1000, hr: 75 },
        //     { time: 2000, hr: 80 },
        //     { time: 3000, hr: 85 },
        //     { time: 4000, hr: 175 },
        //     { time: 5000, hr: 172 },
        //     { time: 6000, hr: 100 },
        //     { time: 7000, hr: 150 },
        //     { time: 8000, hr: 110 },
        //     { time: 9000, hr: 115 },
        // ]

        if (!data) {
            return
        }
        const maxHR = 190
        const minHR = 72
        const graphWidth = styles.HEART_RATE_GRAPHIC.w
        const graphHeight = styles.HEART_RATE_GRAPHIC.h
        const graphX = 0
        const graphData = data.map((point) => {
            return {
                x: ((point.time - data[0].time) / (data[data.length - 1].time - data[0].time)) * graphWidth + graphX,
                y: graphHeight - ((point.hr - minHR) / (maxHR - minHR)) * graphHeight // Flip the Y-axis
            }
        })

        const polyline = createWidget(widget.GRADKIENT_POLYLINE, {
            ...styles.HEART_RATE_GRAPHIC,
        })
        polyline.clear()
        polyline.addLine({
            data: graphData,
            count: graphData.length,
        })
    }
})
