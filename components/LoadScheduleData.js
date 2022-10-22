import { collection, addDoc, getDocs } from 'firebase/firestore';
import { app, database } from './firebaseConfig';


const dbInstance = collection(database, 'notes');
// const saveNote = () => {
//   addDoc(dbInstance, {
//       noteTitle: noteTitle,
//       noteDesc: noteDesc
//   })
//       .then(() => {
//           setNoteTitle('')
//           setNoteDesc('')
//       })
// }

// const getNotes = () => {
//   getDocs(dbInstance)
//       .then((data) => {
//           console.log(data);
//       })
// }

const schedule = []

export default function loadSchedule(shceduleName) {
    return schedule
}

function removeSpaces(str) {
    let begin = 0
    let end = 0
    while (String(str).charAt(begin) === ' ') {
        begin++
    }
    while (str.charAt(str.length - 1 - end) === " ") {
        end++
    }
    return str.slice(begin, str.length - 1 - end)
}

function loadScheduleDataFromString(data) {
    const headlength = "2['uwu-ade-weekly-shcedule// ".length // Replace char ' with char "
    const taillength = "']".length // removing the bracket at the end
    data = data.slice(headlength, data.length - taillength)
    const daysData = data.split(';-;')
    const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    let currentDay = ''
    for (let count = 0; count < daysData.length; count++) {
        if (!Number.isNaN(Number(daysData[count]))) { // Then it's the dayIndex
            currentDay = week[Number(daysData[count])]
        } else {
            const courses = data.split(';;') // ;; is the course splitter
            for (let i = 0; i < courses.length; i++) {
                const courseDataSplitted = courses[i].split(',,') // ,, is the information splitter
                let informations = "" // Other informations of the course such as concerned clases and teachers name
                for (let j = 1; j < courseDataSplitted.length - 1; j++) { informations += courseDataSplitted[j] }
                let course = { name: courseDataSplitted[0], time: courseDataSplitted[courseDataSplitted.length - 1], informations: informations }
                console.log(course)
                schedule.push(currentDay, course) // adding course data to schedule
            }
        }
    }
}
