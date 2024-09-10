import icalgen from "ical-generator";
import http from "http";
import { faker } from "@faker-js/faker";
import { classesID, classList } from "../../types/onlineAdeObjects";
import { parseCalendar, ADEisCringe } from "./adeFetcher";
import ProgressBar from "progress";
import ical from "ical";
import { testParseADE } from "./adeFetcher";
import type { ScheduleFetcher, Calendar } from "../../types/Schedule";

import type { Course, ClassSchedule, ScheduleSet } from "../../types/Schedule";


function createCalendar(classeID: string) {
	// Creation of the schedule set in ical format
	const calendar = icalgen({ name: "schedule" });
	for (let dayOfMonth = 1; dayOfMonth < 14; dayOfMonth++) {
		for (let hour = 8; hour < 18; hour += 2) {
			const startTime = new Date();
			startTime.setHours(hour);
			startTime.setMinutes(0);
			startTime.setDate(dayOfMonth);
			const endTime = new Date();
			endTime.setDate(dayOfMonth);
			endTime.setMinutes(0);
			endTime.setHours(startTime.getHours() + 2);
			const name = faker.vehicle.vehicle();
			calendar.createEvent({
				start: startTime,
				end: endTime,
				summary: name,
				description: classeID + "\n" + faker.name.firstName() + "\n" + "(Exported : " + faker.date.past() + "\n",
				location: faker.address.streetAddress() + ",C203",
			});
			calendar.createEvent({
				start: startTime,
				end: endTime,
				summary: name,
				description: classeID + "\n" + faker.name.firstName() + "\n" + "(Exported : " + faker.date.past() + "\n",
				location: faker.address.streetAddress() + ",C203",
			});
		}
	}
	const calendarString = calendar.toString();
	return calendarString;
}

const scheduleFetcher: ScheduleFetcher = {
	fetchClassSchedule: async (schedule: ClassSchedule, classeID: string, progressBar: ProgressBar) => {
		const res = createCalendar(classeID); // Fetching data from ADE, return ical calendar
		testParseADE();
		const data = ADEisCringe(res); // lol
		const calendar = ical.parseICS(data) as unknown as Calendar; // data is not iterable :)
		return parseCalendar(calendar, schedule, classeID, progressBar);
	},
};
// http
// 	.createServer((req, res) => calendar.serve(res))
// 	.listen(3000, "127.0.0.1", () => {
// 		console.log("Server running at http://127.0.0.1:3000/")
// 	})

export default scheduleFetcher;
