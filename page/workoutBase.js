import { getText } from '@zos/i18n'
import { replace } from '@zos/router'
import { Calorie, Geolocation, HeartRate, Step, Time } from '@zos/sensor'
import { sessionStorage } from '@zos/storage'
import { createWidget, prop, widget } from '@zos/ui'
import * as styles from './workout.styles'


export default class WorkoutBase {
    constructor() {
        this.state = {
            startTime: 0,
            intervalTime: 0,
            timerId: null,
            initialCalorie: 0,
            lastGeolocation: null,
            totalDistance: 0,
            initialSteps: 0,
            actualSet: 1,
            actualExercise: 0,
            actualRest: 0
        }
    }

    loadState() {
        this.state.workout = JSON.parse(sessionStorage.getItem('workout'))
        this.state.startTime = sessionStorage.getItem('startTime', 0)
        if (!this.state.startTime) {
            this.state.startTime = new Time().getTime()
            sessionStorage.setItem('startTime', this.state.startTime)
        }

        this.state.initialCalorie = sessionStorage.getItem('initialCalorie')
        this.state.lastGeolocation = JSON.parse(sessionStorage.getItem('lastGeolocation', "{}"))
        this.state.totalDistance = sessionStorage.getItem('totalDistance', 0)
        this.state.initialSteps = sessionStorage.getItem('initialSteps')

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
    }

    saveState() {
        sessionStorage.setItem('actualSet', this.state.actualSet)
        sessionStorage.setItem('actualExercise', this.state.actualExercise)
        sessionStorage.setItem('startTime', this.state.startTime)
        sessionStorage.setItem('initialCalorie', this.state.initialCalorie)
        sessionStorage.setItem('initialSteps', this.state.initialSteps)
        sessionStorage.setItem('lastGeolocation', JSON.stringify(this.state.lastGeolocation))
        sessionStorage.setItem('totalDistance', this.state.totalDistance)
    }

    baseBuild() {
        this.loadState()
        const heartRate = new HeartRate()
        const calorie = new Calorie()
        const geolocation = new Geolocation()
        const step = new Step()

        if (!this.state.initialCalorie) {
            this.state.initialCalorie = calorie.getCurrent()
        }

        createWidget(widget.TEXT, {
            ...styles.HR_LABEL,
            text: getText('hr')
        })

        const hrText = createWidget(widget.TEXT, {
            ...styles.HEART_RATE_TEXT,
            text: heartRate.getCurrent()
        })

        createWidget(widget.TEXT, {
            ...styles.CALORIE_LABEL,
            text: getText('cal')
        })

        if (sessionStorage.getItem('external', 0)) {
            if (!this.state.initialSteps) {
                this.state.initialSteps = step.getCurrent()
            }

            const stepCount = createWidget(widget.TEXT, {
                ...styles.STEPS_TEXT,
                text: step.getCurrent() - this.state.initialSteps
            })
            const distanceCount = createWidget(widget.TEXT, {
                ...styles.DISTANCE_TEXT,
                text: this.state.totalDistance == 0 ? '--' : this.state.totalDistance
            })

            createWidget(widget.TEXT, {
                ...styles.STEPS_LABEL,
                text: 'steps'
            })
            createWidget(widget.TEXT, {
                ...styles.DISTANCE_LABEL,
                text: 'distance'
            })

            const stepCountChangeCallback = () => {
                stepCount.setProperty(prop.TEXT, {
                    text: step.getCurrent() - this.state.initialSteps
                });
            };
            step.onChange(stepCountChangeCallback)

            geolocation.start()

            setInterval(() => {
                console.log('\na\n')
                if (geolocation.getStatus() !== 'A') {
                    console.log('\nb\n')
                    return
                }
                if (!this.state.lastGeolocation.latitude || !this.state.lastGeolocation.longitude) {
                    console.log('\nc\n')
                    this.state.lastGeolocation = {
                        latitude: geolocation.getLatitude(),
                        longitude: geolocation.getLongitude()
                    }
                    distanceCount.setProperty(prop.TEXT, {
                        text: 0
                    });
                    return
                }
                console.log('\nd\n')
                const actualGeolocation = {
                    latitude: geolocation.getLatitude(),
                    longitude: geolocation.getLongitude()
                }
                console.log(`\nactual:${JSON.stringify(actualGeolocation)}\nlast:${JSON.stringify(this.state.lastGeolocation)}`)
                const distance = calculateDistance(this.state.lastGeolocation, actualGeolocation)
                this.state.totalDistance = this.state.totalDistance ? this.state.totalDistance : 0
                console.log(`\ndistance:${distance}\ntotalDistance:${this.state.totalDistance}`)
                this.state.totalDistance = this.state.totalDistance + distance
                this.state.lastGeolocation = actualGeolocation

                distanceCount.setProperty(prop.TEXT, {
                    text: this.state.totalDistance
                });
            }, 2000)
        }

        const calorieText = createWidget(widget.TEXT, {
            ...styles.CALORIE_TEXT,
            text: calorie.getCurrent() - this.state.initialCalorie
        })

        if (this.state.workout[this.state.actualExercise].sets > 0) {
            const setText = createWidget(widget.TEXT, {
                ...styles.SET_TEXT,
                text: `${this.state.actualSet} / ${this.state.workout[this.state.actualExercise].sets}`
            })
        }

        const exerciseText = createWidget(widget.TEXT, {
            ...styles.EXERCISE_TEXT,
            text: this.state.workout[this.state.actualExercise].name
        })

        const calorieChangeCallback = () => {
            calorieText.setProperty(prop.TEXT, {
                text: calorie.getCurrent() - this.state.initialCalorie,
            });
        };

        calorie.onChange(calorieChangeCallback)

        const hrChangeCallback = () => {
            if (!sessionStorage.getItem('hrData')) {
                sessionStorage.setItem('hrData', JSON.stringify([]))
            }
            const hrData = JSON.parse(sessionStorage.getItem('hrData'))
            const currentTime = new Time().getTime()
            const currentHr = heartRate.getCurrent()

            hrData.push({
                time: currentTime,
                hr: currentHr
            })

            sessionStorage.setItem('hrData', JSON.stringify(hrData))

            hrText.setProperty(prop.TEXT, {
                text: currentHr,
            });
        };

        heartRate.onCurrentChange(hrChangeCallback)

        createWidget(widget.BUTTON, {
            ...styles.FINISH_BUTTON,
            text: 'FINISH',
            click_func: () => {
                sessionStorage.setItem('endTime', new Time().getTime())
                sessionStorage.setItem('startTime', this.state.startTime)
                sessionStorage.setItem('totalCalorie', calorie.getCurrent() - this.state.initialCalorie)
                sessionStorage.setItem('totalDistance', this.state.totalDistance)
                sessionStorage.setItem('totalSteps', step.getCurrent() - this.state.initialSteps)
                replace({ url: 'page/resume', params: '' })
            }
        })

        const intervalTimer = createWidget(widget.TEXT, {
            ...styles.TIME_TEXT,
            text: '00:00:00.0'
        })

        const totalTimeTimer = createWidget(widget.TEXT, {
            ...styles.TOTAL_TIME,
            text: '00:00:00.0'
        })

        this.state.intervalTime = new Time().getTime()
        setInterval(setIntervalTime(this.state.startTime, totalTimeTimer), 100)
        this.state.timerId = setInterval(setIntervalTime(this.state.intervalTime, intervalTimer), 100)
    }
}

const setIntervalTime = (startTime, component) => {
    return () => {
        const currentTime = new Time().getTime()
        const elapsedTime = currentTime - startTime
        const elapsedHours = Math.floor(elapsedTime / 1000 / 60 / 60)
        const elapsedMinutes = Math.floor(elapsedTime / 1000 / 60) % 60
        const elapsedSeconds = Math.floor(elapsedTime / 1000) % 60
        const elapsedMilliseconds = Math.floor(elapsedTime / 100) % 10
        let formattedTime = `${String(elapsedMinutes).padStart(2, '0')}:${String(elapsedSeconds).padStart(2, '0')}.${elapsedMilliseconds}`
        if (elapsedHours > 0) {
            formattedTime = `${String(elapsedHours).padStart(2, '0')}:${formattedTime}`
        }
        component.setProperty(prop.TEXT, {
            text: formattedTime
        })
    }
}

const calculateDistance = (lastGeolocation, actualGeolocaltion) => {
    const lat1 = lastGeolocation.latitude
    const lon1 = lastGeolocation.longitude
    const lat2 = actualGeolocaltion.latitude
    const lon2 = actualGeolocaltion.longitude

    const R = 6371e3 // metres
    const φ1 = lat1 * Math.PI / 180 // φ in radians
    const φ2 = lat2 * Math.PI / 180 // φ in radians
    const Δφ = (lat2 - lat1) * Math.PI / 180 // difference in latitude in radians
    const Δλ = (lon2 - lon1) * Math.PI / 180 // difference in longitude in radians

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // in metres
}
