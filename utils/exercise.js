export const getActualSet = (actualSet, actualExercise, workout) => {
    console.log('actualSet', actualSet)
    console.log('actualExercise', actualExercise)
    let currentExercise = workout[actualExercise]
    console.log('currentExercise', currentExercise.name)
    if (currentExercise.sets === actualSet) {
        actualExercise++
        actualSet = 1
        currentExercise = workout[actualExercise]
    } else {
        actualSet++
    }
    return { actualSet, actualExercise, currentExercise }
}
