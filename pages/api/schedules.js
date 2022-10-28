import { collection, setDoc, doc, addDoc, getDocs, query, where } from 'firebase/firestore';
import { app, database } from '../../components/firebaseConfig';
import scheduleTree from '../../private/classesTree'
const fs = require('fs')
const path = require('path')
const parseString = require('xml2js').parseString

const saveDB = async (data) => {
  const docRef = doc(schedulesCloud, "collection", "document")
  return setDoc(docRef, {
    schedule: data,
  })
}

const loadScheduleXML = (req, res) => {
  const filepath = path.join(process.cwd(), '/public/schedules.xml')
  const data = fs.readFileSync(filepath)
  parseString(data, (err, result) => {
    console.log(result)
    res.status(200).json({ result });
  })
}

const loadScheduleFireBase = async (req, res) => {
  const weekSchedules = []
  const classeSchedules = scheduleTree.get(classe)
  classeSchedules.push(classe)
  for (let i = 0; i < classeSchedules.length; i++) {
    const classe = classeSchedules[i]
    const cloud = collection(database, 'schedules/trainees/' + classe)
    const finalSchedule = []
    for (let weekIndex = 1; weekIndex < 100; weekIndex++) {  // Week iteration
      const weekID = weekIndex
      console.log(weekIndex)
      const dayData = []
      const q = query(cloud, where("week", "array-contains", weekID))
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((course) => {
        dayData.push(course.data())
      })
    }
    finalSchedule.push(dayData)
    weekSchedules.push(finalSchedule)
  }
  res.status(200).json({ weekSchedules });  // Returns every schedule of the year for this classe
}

export default loadScheduleXML