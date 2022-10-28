import { collection, setDoc, doc, addDoc, getDocs } from 'firebase/firestore';
import { app, database } from '../../components/firebaseConfig';
import scheduleTree from '../../private/classesTree';
const xml2js = require('xml2js')
const fs = require('fs')
const path = require('path')

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


const AMPHI_WATTEAU = "Amphi Watteau"
function isPlace(myString) {  // Place like C203 or amphitheater :3
  return /([A-Z])\d*/.test(myString) || myString === AMPHI_WATTEAU;
}

function isClasseName(information) {
  return scheduleTree.has(information)
}

const SCHOOL_YEAR = 2022
function parseCourse(dayID, weekID, courseData) {
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
  const week = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
  if(name != undefined) { // Then it's a propper name and it will crash firebase
    weekID += 1  // Week 0 being Week 1
    const dayOfYear = (weekID - 1)*7 +1
    const date = new Date(SCHOOL_YEAR, 0, dayOfYear)
    console.log(classes)
    const course = {
        name: name,
        classes: classes,
        dayOfWeek: week[dayID],
        date: date.toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit'}),
        week: weekID,
        begin: hours[0],
        end: hours[1],
        teachers: teachers,
        place: places,
    }
    for (let i = 0; i < classes.length; i++){
      const classe = classes[i]
    }
    return { classes, course }
  }
}

export default function loadScheduleDataFromString(data) {
  console.log("Saving newly received schedules data on the cloud ...")
  const headlength = "2['uwu-ade-weekly-shcedule//".length
  const taillength = "']".length // removing the bracket at the end
  data = data.slice(headlength, data.length - taillength)
  const weeksData = data.split('/-/')
  let weekID; let dayID; let courseID;
  const classesSchedule = new Map()
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
                const { classes, course } = parseCourse(dayID, weekID, data)
                for (let i = 0; i < classes.length; i++) {
                  const classe = classes[i]  // One schedule per classes
                  const schedule = classesSchedule.get(classe) ? classesSchedule.get(classe) : []
                  schedule.push(course)
                  classesSchedule.set(classe, schedule)
                }
              }
            }
          }
        }
      }
    }
  }
  const builder = new xml2js.Builder()
  const schedules = []
  classesSchedule.forEach((schedule, classe) => {
    // String(classe).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    // const courses = 
    // for (let i = 0; i < schedule.length; i++) {
    //   const course = 
    // }
    console.log(schedule)
    const classeSchedule = {
        classeSchedule: {
          name: classe,
          schedule: { course: schedule }  // It's weird but every element of the list will have the name "course"
        }
      }
    schedules.push(classeSchedule)  // Removing weird french accents
  })
  const xmldata = builder.buildObject(schedules)
  const filepath = path.join(process.cwd(), '/public/schedules.xml')
  fs.writeFileSync(filepath, xmldata)
  console.log("Data succesfully saved")
}

function saveCourseFireBase(dayID, weekID, courseData) {
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
  const week = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
  if(name != undefined && !name.includes('/')) { // Then it's a propper name and it will crash firebase
    weekID += 1
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
    for (let i = 0; i < classes.length; i++){
      const classe = classes[i]
      console.log('Cloud saving new course data at %s / %s / %s', ("week " + (weekID + 1)), week[dayID], name)
      const docRef = doc(dbInstance, "trainees" + "/" + classe + "/" + name)
      setDoc(docRef, course)
    }
    return course
  }
}