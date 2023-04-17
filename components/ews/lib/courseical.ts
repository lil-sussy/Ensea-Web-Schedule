import type { Course } from '../../../pages/api/schedules'
import { scheduleIDs, scheduleList } from "../../../private/classesTree"
import { getWeekID } from "../../../components/ews/lib/schoolYear"

function removeSpaces(str: String) {
	let begin = 0
	let end = 0
	while (String(str).charAt(begin) === " ") {
		begin++
	}
	while (str.charAt(str.length - 1 - end) === " ") {
		end++
	}
	return str.slice(begin, str.length - end)
}

function isClasseName(information: any) {
	return scheduleList.includes(information)
}

export default function parseCourseFromCalEvent(event: any): Course {
	const SCHOOL_YEAR = 2022
	const name = event.summary

	const teachers = [],
		classes = []
	const places = event.location.split(",")
	const informations = event.description.split("\n")
	let exportDate: string
	for (let i = 1; i < informations.length - 1; i++) {
		// Ignoring first and last element
		const information = removeSpaces(informations[i])
		if (isClasseName(information)) {
			classes.push(information)
		} else if (information.startsWith("(Exported :")) {
			// Weird data stuff inside the summary completly useless
			exportDate = information
		} else {
			teachers.push(information)
		}
	}
	const week = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]
	const beginDate = event.start as Date
	const endDate = event.end as Date
	const creationDate = event.created as Date
	const modifiedDate = event.lastmodified as Date
	const weekID = getWeekID(beginDate)
	if (name != undefined) {
		const dayOfYear = (weekID - 1) * 7 + 1
		const date = new Date(SCHOOL_YEAR, 0, dayOfYear)
		const ID = event.uid
		const courseData = {
			name: name as string,
			dayOfWeek: week[beginDate.getDay() - 1] as string,
			date: beginDate.toLocaleString("fr-FR", { year: "numeric", month: "2-digit", day: "2-digit" }) as string,
			week: weekID as number,
      beginDate: JSON.parse(JSON.stringify(beginDate)),
      endDate: JSON.parse(JSON.stringify(endDate)),
      beginHour: '',
      endHour: '',
			teachers: teachers as string[],
			locations: places as string[],
			creationDate: creationDate as Date,
			modificationDate: modifiedDate as Date,
			exported: exportDate as string,
		}
		// if (courseData.week == 22 && courseData.dayOfWeek == "Vendredi") {
		//   console.log(event)
		//   console.log(courseData)
		// }
		for (let i = 0; i < classes.length; i++) {
			const classe = classes[i]
		}
		return { id: ID, courseData: courseData }
	}
}
