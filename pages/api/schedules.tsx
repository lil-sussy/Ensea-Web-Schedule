import { collection, setDoc, doc, addDoc, getDocs, query, where } from 'firebase/firestore';
import { firebase, database } from '../../components/firebaseConfig';
import { NextApiRequest, NextApiResponse } from 'next'
import scheduleTree from '../../private/classesTree'
import fs from 'fs';
import path from 'path';
import loadSchedules from '../../components/ScheduleExport'

const parseString = require('xml2js').parseString

const loadScheduleXML = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == 'POST') {
    WriteXMLSchedule(req, res)
  } else if (req.method == 'GET') {
    if (req.headers['classe'] == undefined || req.headers['week'] == undefined) {
      res.status(400).json({ status: 400, message: "Unsupported headers"});
      return
    }
    const week = Number(req.headers['week'])
    const classe = req.headers['classe']
    const classes = scheduleTree.get(classe)
    classes.push(classe)
    res.status(200).json({totalSchedule: loadSchedules(week, classes)})
  } else {
    res.status(400).json({ status: 400, message:'Only requests of type Get and Post are accpeted' })
  }
}

let allWeeks = []
const LAST_WEEK_ID = 47
function WriteXMLSchedule(req: NextApiRequest, res: NextApiResponse) {
  const filepathJSON = path.join(process.cwd(), '/private/schedules.json')
  
  const weirdObjectWtfPleaseHelpMe = JSON.stringify(req.body)
  const dearGodWhyTheFuckIsThisAtTheBeginning = '{"'
  const dearGodWhyTheFuckIsThisAtTheEnd = '":""}'
  const actualStringifyObject = weirdObjectWtfPleaseHelpMe.slice(dearGodWhyTheFuckIsThisAtTheBeginning.length
    , weirdObjectWtfPleaseHelpMe.length - dearGodWhyTheFuckIsThisAtTheEnd.length)  // Please send help
  
  const week = JSON.parse(actualStringifyObject.replaceAll('\\', ''));  // Dear god what the fuck
  if (week.weekID == 1) {  // If this is the first week being sent
    allWeeks = []
    fs.writeFileSync(filepathJSON, '')  // Clear file (useless)
  }
  console.log(allWeeks);
  
  allWeeks.push(week)
  if (week.weekID == LAST_WEEK_ID) {
    fs.writeFileSync(filepathJSON, JSON.stringify(allWeeks))
  }
  console.log(req.headers['origin']);  // https://ade.ensea.fr
  res.status(200).json({status: 200, data: "Data succesfully loaded :3"})
}

function ReadXMlScheduleOUTDATED(req: NextApiRequest, res: NextApiResponse) {
  const filepath = path.join(process.cwd(), '/private/schedules.xml')
  const data = fs.readFileSync(filepath)
  const totalSchedule = []
  parseString(data, (err, result) => {
    const week = req.headers['week']
    const classe = req.headers['classe']
    const classes = scheduleTree.get(classe)
    classes.push(classe)
    for (let i = 0; i < result.root.classeSchedule.length; i++) {
      const schedule = result.root.classeSchedule[i]
      if (classes.includes(schedule.name[0])) {  // Wtf XML PARSER WTF WHY DID THIS BECAME AN ARRAY
        totalSchedule.push(schedule)
      }
    }
      if (totalSchedule.length > 0)
      res.status(200).json({totalSchedule: totalSchedule})
    else
      res.status(400).json({ status: 400, message: "No schedule with that name "+classe });
  })
}
const loadScheduleFireBase = async (req, res) => {
  const weekSchedules = []
  // const classeSchedules = scheduleTree.get(classe)
  // classeSchedules.push(classe)
  // for (let i = 0; i < classeSchedules.length; i++) {
  //   const classe = classeSchedules[i]
  //   const cloud = collection(database, 'schedules/trainees/' + classe)
  //   const finalSchedule = []
  //   for (let weekIndex = 1; weekIndex < 100; weekIndex++) {  // Week iteration
  //     const weekID = weekIndex
  //     console.log(weekIndex)
  //     const dayData = []
  //     const q = query(cloud, where("week", "array-contains", weekID))
  //     const querySnapshot = await getDocs(q);
  //     querySnapshot.forEach((course) => {
  //       dayData.push(course.data())
  //     })
  //   }
  //   finalSchedule.push(dayData)
  //   weekSchedules.push(finalSchedule)
  // }
  // res.status(200).json({ weekSchedules });  // Returns every schedule of the year for this classe
}

export default loadScheduleXML