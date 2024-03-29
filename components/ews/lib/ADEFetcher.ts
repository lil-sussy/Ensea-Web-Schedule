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

export type CalendarEvent = {
  created: Date,
  description: string,
  dtstamp: Date,
  end: Date,
  lastModified: Date,
  location: string,
  sequence: string,
  start: Date,
  summary: string,
  uid: string,
  type: string,
  params: any[]
}

export type Calendar = {
  [key: string]: CalendarEvent
}

export function parseCalendar(calendar: Calendar, schedule: ClassSchedule, classeID: string, progressBar: ProgressBar): ClassSchedule {
	//Emptying schedule
	schedule = { lastUpdate: new Date(), weeks: new Map() } // Emptying schedule
	for (let [key, value] of Object.entries(calendar)) {
		value = ADE_IS_OMEGA_FUCKING_CRINGE(value) // lol
    const course = parseCourseFromCalEvent(value)
		schedule.lastUpdate = new Date()
		const week = schedule.weeks.get(course.courseData.week) ? schedule.weeks.get(course.courseData.week) : new Map<String, Course[]>()
		const day = week.get(course.courseData.dayOfWeek) ? week.get(course.courseData.dayOfWeek) : []
		let includes = false
		for (const otherCourse of day) {
			// Check if this course already exists in this schedule (happens with multiclasses courses)
			if (otherCourse.id == course.id) {
				includes = true
				break
			} else if (otherCourse.courseData.beginDate == course.courseData.beginDate) {
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

function ADE_IS_OMEGA_FUCKING_CRINGE(calCourse: CalendarEvent): CalendarEvent {
	// Iterate through every courses of the year
	// if (value.start.getUTCHours() != 8)
	// if (value.start.getUTCHours() != 10)
	// if (value.start.getUTCHours() != 13)
	// if (value.start.getUTCHours() != 15)
	// console.log(value.start.getUTCHours())
	const HOURDIFF = new Date().getTimezoneOffset()/60
	calCourse.start.setHours(calCourse.start.getHours() )
	calCourse.end.setHours(calCourse.end.getHours() )
	// calCourse.start.setUTCHours(9)
	// calCourse.end.setUTCHours(11)
	return calCourse // Apparently the problem has been handle on ADE side, I dont trust them this function stays there
}

export function ADEisCringe(ADEdata: string) {
  return ADEdata
	const timezoneID = "TZID=France/Paris"
	let data = ""
	const lines = ADEdata.split("\n") as string[]
	for (let line of lines) {
		// Example "DTSTAMP:20230406T105014Z"
    //                    year    T
		if (line.startsWith("DTSTAMP") || line.startsWith("DTSTART") || line.startsWith("DTEND") || line.startsWith("LAST-MODIFIED")) {
			const ICSKey = line.split(":")[0]
			const ICSValue = line.split(":")[1]
			const ADEHour = Number(/T+\d{2}/.exec(ICSValue)[0].slice(1))
			const hourIndex = /T+\d{2}/.exec(ICSValue)[1]
			let realHour = ADEHour + (new Date().getHours() - new Date().getUTCHours()) // Ade is substracting 1 hour to every damn courses
			let realHourstr = realHour < 10 ? "0" + String(realHour) : "" + String(realHour)
			// line = ICSKey + ';' + timezoneID + ':' + ICSValue.replace('T'+ADEHour, 'T'+realHour) + '\n'
			line = ICSKey + ":" + ICSValue.replace("T" + ADEHour, "T" + realHourstr) + "\n"
			data += line
		} else {
			data += line + "\n"
		}
	}
	return data
}