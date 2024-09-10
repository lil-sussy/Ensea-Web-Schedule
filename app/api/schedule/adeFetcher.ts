import fs from "fs";
import type { Calendar } from "../../types/types";
import ical from "ical";
import { classesID, classList } from "../../types/onlineAdeObjects";
import axios from "axios";
import { getWeekID } from "../../utils";

import type { ScheduleFetcher, Course, ClassSchedule, ScheduleSet, CalendarEvent } from "../../types/types";
import type ProgressBar from "progress";
import type { CalendarComponent } from "ical";


// export function testParseADE() {
// 	const file = fs.readFileSync("./tests/ADECal.ics");
// 	const lines = file.toString();
// 	const parsedCalendar = ical.parseICS(lines);
//   const calendar = { ...(parsedCalendar as { [uid: string]: CalendarComponent }) };
// 	for (const [key, value] of Object.entries(calendar)) {
// 		const test: string = "";
// 		const test2 = test.search("TP");
// 		if (value.description!.search("TP") != -1) console.log(new Date(value.start!).getHours());
// 	}
// }


export const scheduleFetcher: ScheduleFetcher = {
	fetchClassSchedule: async (schedule: ClassSchedule, classeID: string, progressBar: ProgressBar) => {
		const res = await fetchADE(classeID); // Fetching data from ADE, return ical calendar
		const data = ADEisCringe(res.data); // lol
		const calendar = ical.parseICS(data) as unknown as Calendar; // data is not iterable :)
		return parseCalendar(calendar, schedule, classeID, progressBar);
	},
};

export function parseCalendar(calendar: Calendar, schedule: ClassSchedule, classeID: string, progressBar: ProgressBar): ClassSchedule {
	//Emptying schedule
	schedule = { lastUpdate: new Date(), weeks: new Map() }; // Emptying schedule
	for (let [key, value] of Object.entries(calendar)) {
		value = ADE_IS_OMEGA_FUCKING_CRINGE(value); // lol
		const course = parseCourseFromCalEvent(value);
		schedule.lastUpdate = new Date();
		if (!course) {
			console.error("Error: course is undefined");
			return schedule;
		}
		const week = schedule.weeks.get(course.courseData.week) ? schedule.weeks.get(course.courseData.week)! : new Map<string, Course[]>();
		const day = week.get(course.courseData.dayOfWeek) ? week.get(course.courseData.dayOfWeek)! : [];
		let includes = false;
		for (const otherCourse of day) {
			// Check if this course already exists in this schedule (happens with multiclasses courses)
			if (otherCourse.id == course.id) {
				includes = true;
				break;
			} else if (otherCourse.courseData.beginDate == course.courseData.beginDate) {
				if (otherCourse.courseData.name == course.courseData.name) {
					includes = true;
					break;
				}
			}
		}
		if (!includes) day.push(course);
		week.set(course.courseData.dayOfWeek, day);
		schedule.weeks.set(course.courseData.week, week);
		progressBar.tick(1, {
			week: course.courseData.week,
		});
	}
	return schedule;
}

export async function fetchADE(classeID: string) {
	const scheduleADEID = classeID;
	const begin = "2024-09-01",
		end = "2025-08-09";
	const URL = "https://ade.ensea.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?" + "resources=" + scheduleADEID + "&projectId=15&calType=ical&firstDate=" + begin + "&lastDate=" + end;
	const res = await axios.get(URL); // Get request of the entire shcedule of 1 year for every classe
	return res;
}

function ADE_IS_OMEGA_FUCKING_CRINGE(calCourse: CalendarEvent): CalendarEvent {
	// Iterate through every courses of the year
	// if (value.start.getUTCHours() != 8)
	// if (value.start.getUTCHours() != 10)
	// if (value.start.getUTCHours() != 13)
	// if (value.start.getUTCHours() != 15)
	// console.log(value.start.getUTCHours())
	const HOURDIFF = new Date().getTimezoneOffset() / 60;
	calCourse.start.setHours(calCourse.start.getHours());
	calCourse.end.setHours(calCourse.end.getHours());
	// calCourse.start.setUTCHours(9)
	// calCourse.end.setUTCHours(11)
	return calCourse; // Apparently the problem has been handle on ADE side, I dont trust them this function stays there
}

export function ADEisCringe(ADEdata: string) {
	return ADEdata;
	const timezoneID = "TZID=France/Paris";
	let data = "";
	const lines = ADEdata.split("\n") as string[];
	for (let line of lines) {
		// Example "DTSTAMP:20230406T105014Z"
		//                    year    T
		if (line.startsWith("DTSTAMP") || line.startsWith("DTSTART") || line.startsWith("DTEND") || line.startsWith("LAST-MODIFIED")) {
			const ICSKey = line.split(":")[0];
			const ICSValue = line.split(":")[1];
			const ADEHour = Number(/T+\d{2}/.exec(ICSValue)[0].slice(1));
			const hourIndex = /T+\d{2}/.exec(ICSValue)[1];
			let realHour = ADEHour + (new Date().getHours() - new Date().getUTCHours()); // Ade is substracting 1 hour to every damn courses
			let realHourstr = realHour < 10 ? "0" + String(realHour) : "" + String(realHour);
			// line = ICSKey + ';' + timezoneID + ':' + ICSValue.replace('T'+ADEHour, 'T'+realHour) + '\n'
			line = ICSKey + ":" + ICSValue.replace("T" + ADEHour, "T" + realHourstr) + "\n";
			data += line;
		} else {
			data += line + "\n";
		}
	}
	return data;
}

function removeSpaces(str: String) {
	let begin = 0;
	let end = 0;
	while (String(str).charAt(begin) === " ") {
		begin++;
	}
	while (str.charAt(str.length - 1 - end) === " ") {
		end++;
	}
	return str.slice(begin, str.length - end);
}

function isClasseName(information: any) {
	return classList.includes(information);
}

export function parseCourseFromCalEvent(event: any): Course|undefined {
	const SCHOOL_YEAR = 2022;
	const name = event.summary;

	const teachers = [],
		classes = [];
	const places = event.location.split(",");
	const informations = event.description.split("\n");
	let exportDate: string;
	for (let i = 1; i < informations.length - 1; i++) {
		// Ignoring first and last element
		const information = removeSpaces(informations[i]);
		if (isClasseName(information)) {
			classes.push(information);
		} else if (information.startsWith("(Exported :")) {
			// Weird data stuff inside the summary completly useless
			exportDate = information;
		} else {
			teachers.push(information);
		}
	}
	const week = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
	const beginDate = event.start as Date;
	const endDate = event.end as Date;
	const creationDate = event.created as Date;
	const modifiedDate = event.lastmodified as Date;
	const weekID = getWeekID(beginDate);
	if (name != undefined) {
		const dayOfYear = (weekID - 1) * 7 + 1;
		const date = new Date(SCHOOL_YEAR, 0, dayOfYear);
		const ID = event.uid;
		const courseData = {
			name: name as string,
			dayOfWeek: week[beginDate.getDay() - 1] as string,
			date: beginDate.toLocaleString("fr-FR", { year: "numeric", month: "2-digit", day: "2-digit" }) as string,
			week: weekID as number,
			beginDate: JSON.parse(JSON.stringify(beginDate)),
			endDate: JSON.parse(JSON.stringify(endDate)),
			teachers: teachers as string[],
			locations: places as string[],
			creationDate: creationDate as Date,
			modificationDate: modifiedDate as Date,
			exported: exportDate! as string,
		};
		// if (courseData.week == 22 && courseData.dayOfWeek == "Vendredi") {
		//   console.log(event)
		//   console.log(courseData)
		// }
		for (let i = 0; i < classes.length; i++) {
			const classe = classes[i];
		}
		return { id: ID, courseData: courseData };
	}
}