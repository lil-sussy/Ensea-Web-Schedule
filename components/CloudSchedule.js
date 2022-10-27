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
  const clouds = [collection(database, 'schedules/week12/Monday'), collection(database, 'schedules/week12/Tuesday'),
  collection(database, 'schedules/week12/Wednesday'), collection(database, 'schedules/week12/Thursday'),
  collection(database, 'schedules/week12/Friday')]
  const finalSchedule = []
  const classeSchedules = scheduleTree.get(classe)
  classeSchedules.push(classe)
  for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
    const cloud = clouds[dayIndex]
    const dayData = []
    for (let i = 0; i < classeSchedules.length; i++) {
      const classe = classeSchedules[i]
      const q = query(cloud, where("classes", "array-contains", classe))
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((course) => {
        dayData.push(course.data())
      })
    }
    finalSchedule.push(dayData)
  }
  return finalSchedule;
}

export default loadSchedule