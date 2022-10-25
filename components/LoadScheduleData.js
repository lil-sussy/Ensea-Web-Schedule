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
  const classeSchedules = schedules.get(classe)
  await classeSchedules.foreach(async (classeSchedule) => {
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

export async function getSchedule(shceduleName) {
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
  console.log('after for')
  const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const hours = data[data.length - 1].split(' - ')  // Last element : 8h00 - 12h00
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

export default function loadScheduleDataFromString(fffffff) {
  console.log('ok')
  let data = "20[\"uwu-ade-weekly-shcedule///-/0/-/;-;0;-;;-;1;-;;-;2;-;;; 1ère A ENSEA;; Rattrapage FISE 1A et 2A,,1ère A ENSEA,,1ère B ENSEA,,2ème ENSEA,,A01,,A02,,A103,,13h30 - 17h30;-;3;-;;; 1ère A ENSEA;; Rattrapage FISE 1A et 2A,,1ère A ENSEA,,1ère B ENSEA,,2ème ENSEA,,A01,,A02,,A103,,13h30 - 17h30;-;4;-;/-/1/-/;-;0;-;;-;1;-;;-;2;-;;-;3;-;;-;4;-;/-/2/-/;-;0;-;;-;1;-;;-;2;-;;-;3;-;;-;4;-;;; 1ère A ENSEA;; Connective day,,1ère A ENSEA,,1ère B ENSEA,,1ère DA,,1ère DC,,Amphi Watteau,,13h30 - 17h30/-/3/-/;-;0;-;;-;1;-;;; 1ère A ENSEA;; CM Conversion d'énergie en alternatif,,1ère A ENSEA,,1ère B ENSEA,,GERALDO Frédéric,,Amphi Watteau,,13h30 - 15h30;; 1ère A ENSEA;; CM Systèmes linéaires,,1ère A ENSEA,,1ère B ENSEA,,GIANNINI Frédérique,,Amphi Watteau,,15h30 - 17h30;; 1G2 TD1;; TD Anglais 1A,,1G2 TD1,,1G2 TD2,,1G2 TD3,,BEDIRA Sami,,FEARON Mel,,TOPCZYNSKI Magalie,,ROMON Emmanuelle,,A206,,A207,,A208,,A209,,08h00 - 10h00;-;2;-;;; 1ère A ENSEA;; CM Systèmes électroniques,,1ère A ENSEA,,DELACRESSONNIÈRE Bruno,,Amphi Watteau,,10h00 - 12h00;; 1G1 TD1;; TD Systèmes électroniques,,1G1 TD1,,DELACRESSONNIÈRE Bruno,,A108,,13h30 - 15h30;; 1G1 TD3;; TD Systèmes électroniques,,1G1 TD3,,DUPERRIER Cédric,,A112,,13h30 - 15h30;-;3;-;;; 1G2 TD1;; TD Analyse de Fourier 1A,,1G2 TD1,,AUGIER Adeline,,A201,,08h00 - 10h00;-;4;-;;; 1G1 TD1;; TD Allemand / Espagnol 1A,,1G1 TD1,,1G1 TD2,,1G1 TD3,,PAAPE Iris,,FLINT LUH Stéphanie,,CHIPI Eneko,,GALDEANO Jean-François,,MARINAS Ruth,,A105,,A107,,A106,,A208,,A209,,13h30 - 15h30;; 1G1 TD2;; TD Systèmes électroniques,,1G1 TD2,,LAROCHE Christian,,A08,,15h30 - 17h30;; 1G1 TD3;; TD Analyse de Fourier 1A,,1G1 TD3,,AUGIER Adeline,,A212,,10h00 - 12h00;; 1G2 TD1;; TD Systèmes électroniques,,1G2 TD1,,SABOURAUD-MULLER Carine,,A08,,13h30 - 15h30;; 1G2 TD1;; TD Allemand / Espagnol 1A,,1G2 TD1,,1G2 TD2,,1G2 TD3,,PAAPE Iris,,FLINT LUH Stéphanie,,CHIPI Eneko,,GALDEANO Jean-François,,MARINAS Ruth,,A105,,A107,,A106,,A208,,A209,,15h30 - 17h30;; 1G2 TD2;; TD Analyse de Fourier 1A,,1G2 TD2,,EGLOFFE Anne-Claire,,A109,,10h00 - 12h00;; 1G2 TD2;; TD Systèmes électroniques,,1G2 TD2,,DUPERRIER Cédric,,A111,,13h30 - 15h30;; 1G2 TD3;; TD Systèmes linéaires,,1G2 TD3,,GIANNINI Frédérique,,A108,,10h00 - 12h00;; 1G2 TD3;; TD Systèmes électroniques,,1G2 TD3,,QUINTANEL Sébastien,,A112,,13h30 - 15h30/-/4/-/;-;0;-;;; 1G1 TD1;; TD Systèmes linéaires,,1G1 TD1,,ALALI Alaa,,A112,,13h30 - 15h30;; 1G1 TD1;; TD Analyse de Fourier 1A,,1G1 TD1,,COLIN DE VERDIERE Hugo,,A108,,15h30 - 17h30;; 1G1 TD2;; TDm Langage C,,1G1 TD2,,NGUYEN Xuan Son,,A204,,08h00 - 12h00;; 1G1 TD2;; TD Analyse de Fourier 1A,,1G1 TD2,,COLIN DE VERDIERE Hugo,,A301,,13h30 - 15h30;; 1G1 TD3;; TDm Langage C,,1G1 TD3,,SIMOND Nicolas,,A205,,08h00 - 12h00;; 1G2 TD1;; TD Systèmes linéaires,,1G2 TD1,,HECKEL Yves,,A108,,10h00 - 12h00;; 1G2 TD2;; TD Analyse de Fourier 1A,,1G2 TD2,,EGLOFFE Anne-Claire,,A109,,13h30 - 15h30;; 1G2 TD3;; TD Analyse de Fourier 1A,,1G2 TD3,,EGLOFFE Anne-Claire,,A08,,10h00 - 12h00;; 1G2 TD3;; TD Conversion d'énergie en alternatif,,1G2 TD3,,SEIGNEURBIEUX Julien,,15h30 - 17h30;-;1;-;;; 1ère A ENSEA;; CM Systèmes linéaires,,1ère A ENSEA,,1ère B ENSEA,,GIANNINI Frédérique,,Amphi Watteau,,13h30 - 15h30;; 1ère A ENSEA;; CM Conversion d'énergie en alternatif,,1ère A ENSEA,,1ère B ENSEA,,GERALDO Frédéric,,Amphi Watteau,,15h30 - 17h30;; 1G2 TD1;; TD Anglais 1A,,1G2 TD1,,1G2 TD2,,1G2 TD3,,BEDIRA Sami,,FEARON Mel,,TOPCZYNSKI Magalie,,ROMON Emmanuelle,,A206,,A207,,A208,,A209,,08h00 - 10h00;-;2;-;;; 1G1 TD1;; TD Conversion d'énergie en alternatif,,1G1 TD1,,ALALI Alaa,,A111,,10h00 - 12h00;; 1G1 TD1;; TD Systèmes électroniques,,1G1 TD1,,DELACRESSONNIÈRE Bruno,,A108,,13h30 - 15h30;; 1G1 TD3;; TD Conversion d'énergie en alternatif,,1G1 TD3,,GERALDO Frédéric,,A110,,10h00 - 12h00;; 1G2 TD1;; TD Conversion d'énergie en alternatif,,1G2 TD1,,GERALDO Frédéric,,A108,,08h00 - 10h00;; 1G2 TD1;; TDm Langage C,,1G2 TD1,,TAUVEL Antoine,,A212,,13h30 - 17h30;; 1G2 TD2;; TD Conversion d'énergie en alternatif,,1G2 TD2,,ALALI Alaa,,A111,,08h00 - 10h00;; 1G2 TD2;; TDm Langage C,,1G2 TD2,,MONCHAL Laurent,,A201,,13h30 - 17h30;; 1G2 TD3;; TDm Langage C,,1G2 TD3,,NGUYEN Xuan Son,,A204,,13h30 - 17h30;-;3;-;;; 1G1 TD2;; TD Systèmes linéaires,,1G1 TD2,,HECKEL Yves,,A109,,08h00 - 10h00;; 1G1 TD3;; TD Systèmes linéaires,,1G1 TD3,,GIANNINI Frédérique,,A111,,08h00 - 10h00;; 1G2 TD1;; TD Analyse de Fourier 1A,,1G2 TD1,,AUGIER Adeline,,A201,,08h00 - 10h00;; 1G2 TD2;; TD Systèmes linéaires,,1G2 TD2,,BENKALFATE Chemseddine,,A08,,08h00 - 10h00;-;4;-;;; 1G1 TD1;; TD Allemand / Espagnol 1A,,1G1 TD1,,1G1 TD2,,1G1 TD3,,PAAPE Iris,,FLINT LUH Stéphanie,,CHIPI Eneko,,GALDEANO Jean-François,,MARINAS Ruth,,A105,,A107,,A106,,A208,,A209,,13h30 - 15h30;; 1G1 TD2;; TD Conversion d'énergie en alternatif,,1G1 TD2,,GERALDO Frédéric,,A210,,10h00 - 12h00;; 1G1 TD2;; TD Systèmes électroniques,,1G1 TD2,,LAROCHE Christian,,A08,,15h30 - 17h30;; 1G1 TD3;; TD Analyse de Fourier 1A,,1G1 TD3,,AUGIER Adeline,,A212,,10h00 - 12h00;; 1G2 TD1;; TD Systèmes électroniques,,1G2 TD1,,SABOURAUD-MULLER Carine,,A08,,13h30 - 15h30;; 1G2 TD1;; TD Allemand / Espagnol 1A,,1G2 TD1,,1G2 TD2,,1G2 TD3,,PAAPE Iris,,FLINT LUH Stéphanie,,CHIPI Eneko,,GALDEANO Jean-François,,MARINAS Ruth,,A105,,A107,,A106,,A208,,A209,,15h30 - 17h30;; 1G2 TD2;; TD Analyse de Fourier 1A,,1G2 TD2,,EGLOFFE Anne-Claire,,A109,,10h00 - 12h00;; 1G2 TD2;; TD Systèmes électroniques,,1G2 TD2,,DUPERRIER Cédric,,A111,,13h30 - 15h30;; 1G2 TD3;; TD Systèmes linéaires,,1G2 TD3,,GIANNINI Frédérique,,A108,,10h00 - 12h00;; 1G2 TD3;; TD Systèmes électroniques,,1G2 TD3,,QUINTANEL Sébastien,,A112,,13h30 - 15h30/-/5/-/\"]"
  console.log("Loading data ...")
  const headlength = "2['uwu-ade-weekly-shcedule// ".length // Replace char ' with char "
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
              const data = coursesData[parseCourseIndex].split(',,')
              saveCourse(dayID, weekID, data)
            }
          }
        }
      }
    }
  }
  console.log("Data succesfully imported")
}
