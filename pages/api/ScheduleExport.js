import { collection, setDoc, doc, addDoc, getDocs } from 'firebase/firestore';
import { app, database } from '../../components/firebaseConfig';
import scheduleTree from '../../private/classesTree';

const FB_COLLECTION = 'schedules'
const dbInstance = collection(database, FB_COLLECTION);

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

function removeSlashes(str) {
  str.slice()
}

const AMPHI_WATTEAU = "Amphi Watteau"
function isPlace(myString) {  // Place like C203 or amphitheater :3
  return /([A-Z])\d*/.test(myString) || myString === AMPHI_WATTEAU;
}

function isClasseName(information) {
  return scheduleTree.has(information)
}

function saveCourse(dayID, weekID, courseData) {
  if (courseData.length  == 0) {
    return
  }
  const hours = courseData[courseData.length - 1].split(' - ')  // Last element : 8h00 - 12h00
  const name = courseData[0]

  const teachers = [], places = [], classes = []
  for (let i = 1; i < courseData.length -1; i++) {  // Ignoring first and last element
    const information = removeSpaces(courseData[i])
    if (isClasseName(information)) {
      classes.push(information)
    } else if (isPlace(information)) {
      places.push(information)
    } else {
      teachers.push(information)
    }
  }
  const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  if(name != undefined && !name.includes('/')) { // Then it's a propper name and it will crash firebase
    console.log('Cloud saving new course data at %s / %s / %s', ("week " + (weekID + 1)), week[dayID], name)
    weekID += 1
    const docRef = doc(dbInstance, "week"+weekID + "/"+week[dayID] + "/" + name)
    const course = {
      classes: classes,
      day: week[dayID],
      week: weekID,
      lesson: name,
      begin: hours[0],
      end: hours[1],
      teachers: teachers,
      place: places,
    }
    setDoc(docRef, course)
  }
}

export default function loadScheduleDataFromString(data) {
  console.log("Saving newly received schedules data on the cloud ...")
  const headlength = "2['uwu-ade-weekly-shcedule//".length // Replace char ' with char "
  const taillength = "']".length // removing the bracket at the end
  data = data.slice(headlength, data.length - taillength)
  const weeksData = data.split('/-/')
  let weekID; let dayID; let courseID;
  for (let parseWeekIndex = 0; parseWeekIndex < weeksData.length; parseWeekIndex++) {  // Weeks
    if (parseWeekIndex % 2 === 1) {  // First element is "" the second is the weekID third is data and so on...
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
              if (coursesData[parseCourseIndex].length > 0) {  // First element being ''
                const data = coursesData[parseCourseIndex].split(',,')
                saveCourse(dayID, weekID, data)
              }
            }
          }
        }
      }
    }
  }
  console.log("Data succesfully saved")
}
