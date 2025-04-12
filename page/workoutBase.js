import { pauseDropWristScreenOff } from '@zos/display'
import { getText } from '@zos/i18n'
import { replace } from '@zos/router'
import { Calorie, Geolocation, HeartRate, Step, Time } from '@zos/sensor'
import { localStorage } from '@zos/storage'
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
            actualRest: 0,
            locations: [],
        }
    }

    loadState() {
        this.state.workout = JSON.parse(localStorage.getItem('workout'))
        this.state.startTime = localStorage.getItem('startTime', 0)
        if (!this.state.startTime) {
            this.state.startTime = new Time().getTime()
            localStorage.setItem('startTime', this.state.startTime)
        }

        this.state.initialCalorie = localStorage.getItem('initialCalorie')
        this.state.lastGeolocation = JSON.parse(localStorage.getItem('lastGeolocation', "{}"))
        this.state.totalDistance = localStorage.getItem('totalDistance', 0)
        this.state.initialSteps = localStorage.getItem('initialSteps')

        this.state.actualSet = localStorage.getItem('actualSet')
        if (!this.state.actualSet) {
            this.state.actualSet = 1
        }

        this.state.actualExercise = localStorage.getItem('actualExercise')
        if (!this.state.actualExercise) {
            this.state.actualExercise = 0
        }

        this.state.locations = JSON.parse(localStorage.getItem('locations', "[]"))

        console.log('startTime', this.state.startTime)
        console.log('initialCalorie', this.state.initialCalorie)
        console.log('actualSet', this.state.actualSet)
        console.log('actualExercise', this.state.actualExercise)
    }

    saveState() {
        localStorage.setItem('actualSet', this.state.actualSet)
        localStorage.setItem('actualExercise', this.state.actualExercise)
        localStorage.setItem('startTime', this.state.startTime)
        localStorage.setItem('initialCalorie', this.state.initialCalorie)
        localStorage.setItem('initialSteps', this.state.initialSteps)
        localStorage.setItem('lastGeolocation', JSON.stringify(this.state.lastGeolocation))
        localStorage.setItem('totalDistance', this.state.totalDistance)
        localStorage.setItem('locations', JSON.stringify(this.state.locations))
    }

    baseBuild() {
        pauseDropWristScreenOff({
            duration: 0,
        })
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

        if (localStorage.getItem('external', 0)) {
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

            let ignoredLocation = 0
            const ignoredLocationLimit = 5

            setInterval(() => {
                if (geolocation.getStatus() !== 'A') {
                    return
                }
                if (ignoredLocation < ignoredLocationLimit) {
                    ignoredLocation++
                    return
                }

                this.state.locations.push({
                    latitude: geolocation.getLatitude(),
                    longitude: geolocation.getLongitude()
                })
                this.state.totalDistance = calculateTotalDistance(this.state.locations)
                if (this.state.totalDistance < 1) {
                    return
                }
                const floorDistance = Math.floor(this.state.totalDistance)
                // format as km if greater than 1000
                const formattedDistance = floorDistance > 1000 ? (floorDistance / 1000).toFixed(2) + ' km' : floorDistance + ' m'
                distanceCount.setProperty(prop.TEXT, {
                    text: formattedDistance
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
            if (!localStorage.getItem('hrData')) {
                localStorage.setItem('hrData', JSON.stringify([]))
            }
            const hrData = JSON.parse(localStorage.getItem('hrData'))
            const currentTime = new Time().getTime()
            const currentHr = heartRate.getCurrent()

            hrData.push({
                time: currentTime,
                hr: currentHr
            })

            localStorage.setItem('hrData', JSON.stringify(hrData))

            hrText.setProperty(prop.TEXT, {
                text: currentHr,
            });
        };

        heartRate.onCurrentChange(hrChangeCallback)

        createWidget(widget.BUTTON, {
            ...styles.FINISH_BUTTON,
            text: 'FINISH',
            click_func: () => {
                localStorage.setItem('endTime', new Time().getTime())
                localStorage.setItem('startTime', this.state.startTime)
                localStorage.setItem('totalCalorie', calorie.getCurrent() - this.state.initialCalorie)
                localStorage.setItem('totalDistance', this.state.totalDistance)
                localStorage.setItem('totalSteps', step.getCurrent() - this.state.initialSteps)
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

/**
 * Calculates the distance between two geographical points in meters using the Haversine formula.
 * 
 * @param {Object} pointA - The first geolocation point with latitude and longitude.
 * @param {Object} pointB - The second geolocation point with latitude and longitude.
 * @returns {number} The distance in meters.
 */
const calculateDistance = ({ latitude: lat1, longitude: lon1 }, { latitude: lat2, longitude: lon2 }) => {
    const R = 6371e3; // Earth's radius in meters
    const toRadians = (degrees) => degrees * Math.PI / 180;

    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a = Math.sin(Δφ / 2) ** 2 +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const calculateTotalDistance = (locations) => {
    let totalDistance = 0
    let lastLocation = null

    for (let i = 0; i < locations.length; i++) {
        if (!lastLocation) {
            lastLocation = locations[i]
            continue
        }
        const distance = calculateDistance(lastLocation, locations[i])
        if (distance > 1) {
            totalDistance += distance
            lastLocation = locations[i]
        }
    }

    return totalDistance
}