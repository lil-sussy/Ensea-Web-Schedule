import ical from "ical"
import { scheduleIDs, scheduleList } from "../../../private/classesTree"
import axios from "axios"
import type { ScheduleFetcher, Course, ClassSchedule, ScheduleSet } from "../../../pages/api/schedules"
import type { ProgressBar } from "progress"
import parseCourseFromCalEvent from './courseical'

const scheduleFetcher: ScheduleFetcher = {
	fetchClassSchedule: async (schedule: ClassSchedule, classeID: string, progressBar: ProgressBar) => {
		const res = await fetchADE(classeID) // Fetching data from ADE, return ical calendar
		const data = ADEisCringe(res.data) // lol
		const calendar = ical.parseICS(data) // data is not iterable :)
		return parseCalendar(calendar, schedule, classeID, progressBar)
	},
}

export function  parseCalendar(calendar, schedule: ClassSchedule, classeID: string, progressBar: ProgressBar): ClassSchedule {
	//Emptying schedule
	schedule = { lastUpdate: new Date(), weeks: new Map() } // Emptying schedule
	for (const [key, value] of Object.entries(calendar)) {
		// Iterate through every courses of the year
		const course = ADE_IS_OMEGA_FUCKING_CRINGE(parseCourseFromCalEvent(value)) // lol
		schedule.lastUpdate = new Date()
		const week = schedule.weeks.get(course.courseData.week) ? schedule.weeks.get(course.courseData.week) : new Map<String, Course[]>()
		const day = week.get(course.courseData.dayOfWeek) ? week.get(course.courseData.dayOfWeek) : []
		let includes = false
		for (const otherCourse of day) {
			// Check if this course already exists in this schedule (happens with multiclasses courses)
			if (otherCourse.id == course.id) {
				includes = true
				break
			} else if (otherCourse.courseData.begin == course.courseData.begin) {
        if (otherCourse.courseData.name == course.courseData.name) {
          includes = true
          break
        }
      }
		}
		if (!includes) day.push(course)
		week.set(course.courseData.dayOfWeek, day)
		schedule.weeks.set(course.courseData.week, week)
		progressBar.tick(1, {
			week: course.courseData.week,
		})
	}
	return schedule
}

export default scheduleFetcher

export async function fetchADE(classeID: string) {
	const scheduleADEID = scheduleIDs.get(classeID)
  const begin = "2022-09-01",
		end = "2023-08-09"
  const URL =
		"https://ade.ensea.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?" +
		"resources=" +
		scheduleADEID +
		"&projectId=1&calType=ical&firstDate=" +
		begin +
		"&lastDate=" +
		end
	const res = await axios.get(URL) // Get request of the entire shcedule of 1 year for every classe
  return res
}

function ADE_IS_OMEGA_FUCKING_CRINGE(course: Course): Course {
	// You might wonder : what is going on ?
	// Well this is simple, see aparently for every course dated before today are MODIFIED by ADE
	// I attended to some of those courses and I can confirm that every courses's hours are MODIFIED.
	// But this is not the case for the courses of the current week and the courses of every weeks after :)))
	// At this point I just wanna die I dont even want to continue typing this function this is just too CRINGE.

	// const currentWeekID = getWeekID(new Date())  // WeekID of this week
	// if (course.courseData.week < currentWeekID) {
	//   const begin = course.courseData.begin
	//   course.courseData.begin = ('0' + (Number(begin.slice(0, 2)) + 1)).slice(-2)  // I'm having so much fun right now. Btw this slice(-2) jutsu is from here https://www.folkstalk.com/2022/09/add-leading-zeros-to-number-javascript-with-code-examples.html#:~:text=JavaScript%20doesn't%20keep%20insignificant,padded%20with%20leading%20zeros%20string.
	//   course.courseData.begin += begin.slice(2, 5)
	//   const end = course.courseData.end
	//   course.courseData.end = ('0' + (Number(end.slice(0, 2)) + 1)).slice(-2)  // I'm having so much fun right now. Btw this slice(-2) jutsu is from here https://www.folkstalk.com/2022/09/add-leading-zeros-to-number-javascript-with-code-examples.html#:~:text=JavaScript%20doesn't%20keep%20insignificant,padded%20with%20leading%20zeros%20string.
	//   course.courseData.end += end.slice(2, 5)
	// }

	// pls send help.
	return course // Apparently the problem has been handle on ADE side, I dont trust them this function stays there
}

export function ADEisCringe(ADEdata: string) {
	const timezoneID = "TZID=France/Paris"
	let data = ""
	const lines = ADEdata.split("\n") as string[]
	for (let line of lines) {
		if (line.startsWith("DTSTAMP") || line.startsWith("DTSTART") || line.startsWith("DTEND") || line.startsWith("LAST-MODIFIED")) {
			const ICSKey = line.split(":")[0]
			const ICSValue = line.split(":")[1]
			const ADEHour = Number(/T+\d{2}/.exec(ICSValue)[0].slice(1))
			const hourIndex = /T+\d{2}/.exec(ICSValue)[1]
			let realHour = String(ADEHour + (new Date().getHours() - new Date().getUTCHours()) + 2) // Ade is substracting 1 hour to every damn courses
			realHour = Number(realHour) < 10 ? "0" + realHour : "" + realHour
			// line = ICSKey + ';' + timezoneID + ':' + ICSValue.replace('T'+ADEHour, 'T'+realHour) + '\n'
			line = ICSKey + ":" + ICSValue.replace("T" + ADEHour, "T" + realHour) + "\n"
			data += line
		} else {
			data += line + "\n"
		}
	}
	return ADEdata
}