import { collection, setDoc, doc, addDoc, getDocs, query, where } from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next'
import { scheduleList, scheduleTree } from '../../private/classesTree'
import fs from 'fs';
import path from 'path';
import loadSchedules from '../../components/ScheduleExport'


const loadSchedule = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == 'POST') {
    WriteJsonSchedule(req, res)
  } else if (req.method == 'GET') {
    if (req.headers['classe'] == undefined || req.headers['week'] == undefined) {
      res.status(400).json({ status: 400, message: "Unsupported headers"});
      return
    }
    const week = Number(req.headers['week'])
    const classe = req.headers['classe']
    const classes = scheduleTree.get(classe)
    if (classes) {
      classes.push(classe)
      res.status(200).json({totalSchedule: loadSchedules(week, classes)})
    } else {
      res.status(404).json({ status: 404, message:'No classe schedule found for this classe '+classe })
    }
  } else {
    res.status(400).json({ status: 400, message:'Only get and post request are handled' })
  }
}

let allWeeks = []
const LAST_WEEK_ID = 47
function WriteJsonSchedule(req: NextApiRequest, res: NextApiResponse) {
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

export default loadSchedule