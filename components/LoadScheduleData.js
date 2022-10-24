import { collection, doc, addDoc, getDocs } from 'firebase/firestore';
import { app, database } from './firebaseConfig';

const SCHEDULES = 'schedules'
const dbInstance = collection(database, 'schedules');

export const saveDB = async (data) => {
  const docRef = doc(dbInstance, "collection", "document")
  return setDoc(docRef, {
    schedule: data,
  })
}

export const loadSchedule = async () => {
  await getDocs(docRef)
    .then((data) => {
      return data;
    })
}

const schedule = []

export default function getSchedule(shceduleName) {
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
  return str.slice(begin, str.length - end)
}

function loadScheduleDataFromString(data) {
  const headlength = "2['uwu-ade-weekly-shcedule// ".length // Replace char ' with char "
  const taillength = "']".length // removing the bracket at the end
  data = data.slice(headlength, data.length - taillength)
  const weeksData = data.split('/-/')
  const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  let weekID; let dayID; let courseID;
  for (let parseWeekIndex = 0; i < weeksData.length; i++) {  // Weeks
    if (parseWeekIndex % 2 === 0) {
      weekID = Number(weeksData[parseWeekIndex])
    } else {
      const daysData = weeksData[parseWeekIndex].split(';-;')
      for (let parseDayIndex = 0; i < daysData.length; i++) {  // Days
        if (parseDayIndex % 2 === 0) {
          dayID = Number(daysData[parseDayIndex])
        } else {
          const coursesData = daysData[parseDayIndex].split(';;')
          const dayData = [];
          for (let parseCourseIndex = 0; i < coursesData.length; i++) {  // Courses
            if (parseDayIndex % 2 === 0) {
              courseID = removeSpaces(coursesData[parseCourseIndex])
            } else {
              const data = coursesData[parseCourseIndex].split(',,')
              const courseData = [];
              for (let dataIndex = 0; i < data.length-1; i++) {  // Courses
                if (data.length > 0) {
                  courseData.push(data[dataIndex])
                }
              }
              const hours = datat[data.length -1].split(' - ')  // Last element : 8h00 - 12h00
              const docRef = doc(dbInstance, SCHEDULES, courseID, weekID+1, dayID)
              const course = {
                courseID: courseID,
                begin: hours[0],
                end: hours[1],
                courseData: courseData,
              }
              console.log("adding to %s this course %s", docRef, course)
              setDoc(docRef, course)
            }
          }
          const day = {
            name: week[parseDayIndex],
            courses: dayData,
          }
        }
      }
    }
  }
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
