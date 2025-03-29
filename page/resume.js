import { getText } from '@zos/i18n'
import { Time } from '@zos/sensor'
import { sessionStorage } from '@zos/storage'
import { createWidget, widget } from '@zos/ui'
import * as styles from './resume.styles'


Page({
    state: {
        startTime: 0,
        intervalTime: 0,
        timerId: null,
        initialCalorie: 0,
        actualSet: 1,
        actualExercise: 0,
        workout: [
            {
                'name': "Graviton",
                'sets': 4,
            },
            {
                'name': "Remada Articulada 20kg",
                'sets': 3,
            },
            {
                'name': "Serrote 12kg",
                'sets': 3,
            },
            {
                'name': "Rosca Martelo 9kg",
                'sets': 3,
            },
            {
                'name': "Rosca Scott 10kg",
                'sets': 3,
            }
        ]
    },
    loadState() {
        this.state.startTime = sessionStorage.getItem('startTime', 0)
        if (!this.state.startTime) {
            this.state.startTime = new Time().getTime()
        }

        this.state.initialCalorie = sessionStorage.getItem('initialCalorie')

        this.state.actualSet = sessionStorage.getItem('actualSet')
        if (!this.state.actualSet) {
            this.state.actualSet = 1
        }

        this.state.actualExercise = sessionStorage.getItem('actualExercise')
        if (!this.state.actualExercise) {
            this.state.actualExercise = 0
        }

        console.log('startTime', this.state.startTime)
        console.log('initialCalorie', this.state.initialCalorie)
        console.log('actualSet', this.state.actualSet)
        console.log('actualExercise', this.state.actualExercise)
    },
    build() {
        this.loadState()

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
            text: 0
        })

        const totalTimeTimer = createWidget(widget.TEXT, {
            ...styles.TOTAL_TIME,
            text: '00:00:00.0'
        })

        console.log('startTime', this.state.startTime)
        this.state.intervalTime = new Time().getTime()
        this.buildGraph()
    },
    buildGraph() {
        createWidget(widget.FILL_RECT, {
            ...styles.GREEN_HR_ZONE,
        })
        createWidget(widget.FILL_RECT, {
            ...styles.YELLOW_HR_ZONE,
        })
        createWidget(widget.FILL_RECT, {
            ...styles.RED_HR_ZONE,
        })
        const data = [
            {
                'time': 0,
                'heartRate': 80,
            },
            {
                'time': 25,
                'heartRate': 85,
            },
            {
                'time': 40,
                'heartRate': 90,
            },
            {
                'time': 80,
                'heartRate': 95,
            },
            {
                'time': 85,
                'heartRate': 110,
            },
            {
                'time': 90,
                'heartRate': 145,
            },
            {
                'time': 100,
                'heartRate': 110,
            },
            {
                'time': 140,
                'heartRate': 115,
            },
            {
                'time': 150,
                'heartRate': 120,
            },
            {
                'time': 160,
                'heartRate': 105,
            },
            {
                'time': 190,
                'heartRate': 110,
            },
            {
                'time': 220,
                'heartRate': 135,
            },
        ]
        const maxHR = 190
        const minHR = 80
        const graphWidth = styles.HEART_RATE_GRAPHIC.w
        const graphHeight = styles.HEART_RATE_GRAPHIC.h
        const graphX = 0
        const graphData = data.map((point) => {
            return {
                x: ((point.time - data[0].time) / (data[data.length - 1].time - data[0].time)) * graphWidth + graphX,
                y: graphHeight - ((point.heartRate - minHR) / (maxHR - minHR)) * graphHeight // Flip the Y-axis
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
