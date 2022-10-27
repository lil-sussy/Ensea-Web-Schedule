import { collection, setDoc, doc, addDoc, getDocs, query, where } from 'firebase/firestore';
import { app, database } from './firebaseConfig';
import scheduleTree from '../private/classesTree'

const saveDB = async (data) => {
  const docRef = doc(schedulesCloud, "collection", "document")
  return setDoc(docRef, {
    schedule: data,
  })
}

const loadSchedule = async (classe) => {
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
  return weekSchedules;  // Returns every schedule of the year for this classe
}

export default loadSchedule