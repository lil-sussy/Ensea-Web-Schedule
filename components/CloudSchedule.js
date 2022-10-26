import { collection, setDoc, doc, addDoc, getDocs, query, where } from 'firebase/firestore';
import { app, database } from './firebaseConfig';
import schedules from '../private/classesTree'

const FB_COLLECTION = 'schedules'
const schedulesCloud = collection(database, FB_COLLECTION);

const saveDB = async (data) => {
  const docRef = doc(schedulesCloud, "collection", "document")
  return setDoc(docRef, {
    schedule: data,
  })
}

const loadSchedule = async (classe) => {
  const scheduleData = []
  const classeSchedules = schedules.get(classe)
  await classeSchedules.forEach(async (classeSchedule) => {
    const docRef = doc(schedulesCloud, classeSchedule)
    console.log(classeSchedule);
    const q = query(schedulesCloud, where("classes", "==", classeSchedule))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((course) => {
      console.log(course);
      scheduleData.push(...course.data())
    })
  })
  return scheduleData;
}

export default loadSchedule