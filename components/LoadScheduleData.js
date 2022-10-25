import { collection, setDoc, doc, addDoc, getDocs } from 'firebase/firestore';
import { app, database } from './firebaseConfig';
import schedules from '../private/classesTree'

const FB_COLLECTION = 'schedules'
const dbInstance = collection(database, 'schedules');

const saveDB = async (data) => {
  const docRef = doc(dbInstance, "collection", "document")
  return setDoc(docRef, {
    schedule: data,
  })
}

const loadSchedule = async (classe) => {
  const scheduleData = []
  const schedules = schedules.get(classe)
  await schedules.foreach(async (classeSchedule) => {
    const docRef = doc(dbInstance, "schedules", classeSchedule)
    const courses = await getDocs(docRef)
      .then((data) => {
        return data;
      })
      scheduleData.push(...courses)
  })
  return scheduleData;
}

const schedule = []

export default async function getSchedule(shceduleName) {
  return loadSchedule(shceduleName)
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

function hasNumber(myString) {
  return /\d/.test(myString);
}

function saveCourse(dayID, weekID, data) {
  const coursesIDs = [];
  const courseData = [];
  let dataBeginIndex = 0;
  while(hasNumber(data[dataBeginIndex])) {
    coursesIDs.push(removeSpaces(data[dataBeginIndex]))
    dataBeginIndex++;
  }
  for (let dataIndex = 0; dataIndex < data.length - 1; dataIndex++) {  // Courses
    if (data.length > 0) {
      courseData.push(data[dataIndex])
    }
  }
  const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const hours = datat[data.length - 1].split(' - ')  // Last element : 8h00 - 12h00
  const name = courseData[0]
  
  coursesIDs.forEach((courseID) => {
    const docRef = doc(dbInstance, FB_COLLECTION, courseID, "week " + (weekID + 1), week[dayID], name)
    const course = {
      courseName: name,
      courseID: courseID,
      begin: hours[0],
      end: hours[1],
      courseData: courseData,
    }
    console.log("adding to %s this course %s", docRef, course)
    setDoc(docRef, course)
  })
}

export function loadScheduleDataFromString(data) {
  const headlength = "2['uwu-ade-weekly-shcedule// ".length // Replace char ' with char "
  const taillength = "']".length // removing the bracket at the end
  data = data.slice(headlength, data.length - taillength)
  const weeksData = data.split('/-/')
  let weekID; let dayID; let courseID;
  for (let parseWeekIndex = 0; parseWeekIndex < weeksData.length; parseWeekIndex++) {  // Weeks
    if (parseWeekIndex % 2 === 1) {  // First element is "" the second is the weekID third is data and so on
      weekID = Number(weeksData[parseWeekIndex])
    } else {
      const daysData = weeksData[parseWeekIndex].split(';-;')
      for (let parseDayIndex = 0; parseDayIndex < daysData.length; parseDayIndex++) {  // Days
        if (parseDayIndex % 2 === 1) {
          dayID = Number(daysData[parseDayIndex])
        } else {
          const coursesData = daysData[parseDayIndex].split(';;')
          for (let parseCourseIndex = 0; parseCourseIndex < coursesData.length; parseCourseIndex++) {  // Courses
            if (parseCourseIndex % 2 === 1) {
              courseID = removeSpaces(coursesData[parseCourseIndex])  // Unused
            } else {
              const data = coursesData[parseCourseIndex].split(',,')
              saveCourse(dayID, weekID, data)
            }
          }
        }
      }
    }
  }
}
