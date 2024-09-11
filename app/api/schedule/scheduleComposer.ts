import { scheduleFetcher } from "../../adeFetcher";
import { classesID, classList } from "../../types/onlineAdeObjects";
import readline from "readline";
import ProgressBar from "progress";
import testICal from "../../testIcal";
import fs from "fs";
import path from "path";
import { replacer, reviver } from "../../utils";

export const testEnvironement = false;

import type { ClassSchedule, Course, ScheduleSet } from "../../types/types";


const scheduleJSONpath = path.join(process.cwd() + "/app/data/schedules.json"); // Path of the schedule json to save the all thing


export async function refreshSchedules(classeID: string, refreshDuration: number): Promise<ClassSchedule | undefined> {
	const progressBar = new ProgressBar("Updating from ADE - :percent (:bar) :schedule.", {
		total: Array.from(classesID.keys()).length,
		complete: "#",
		incomplete: " ",
		width: 30,
		clear: true,
	});
	return new Promise(async (resolve) => {
		const beginTime = new Date(); // Beginning time of process
		let scheduleSet: ScheduleSet = loadOrCreateScheduleSet();
		// Getting or Creating a class schedule to add it and save
		let schedule = scheduleSet.get(classeID) || { lastUpdate: null, weeks: new Map<number, Map<string, Course[]>>() };
		if (!schedule.lastUpdate || new Date().getTime() - new Date(schedule.lastUpdate).getTime() > refreshDuration) {
			// If last update is older than 5min
			console.log("Starting new update for %s's schedule from ADE servers...", classeID);
			console.log("last update of %s is older than 5min. Updating...", classeID, schedule.lastUpdate ? new Date(schedule.lastUpdate).toLocaleString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }) : "never");
			if (testEnvironement) {
				schedule = await testICal.fetchClassSchedule(schedule, classeID, progressBar);
				// listenToConsole();
			} else {
				schedule = await scheduleFetcher.fetchClassSchedule(schedule, classeID, progressBar);
			}
			scheduleSet.set(classeID, schedule);
			saveScheduleSet(scheduleSet);
			console.log("Schedule of class %s was successfully updated in %d ms", classeID, new Date().getTime() - beginTime.getTime());
		} else {
			console.log("%s's schedule is up to date (%s)", classeID, new Date(schedule.lastUpdate).toLocaleString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }));
		}
		resolve(scheduleSet.get(classeID));
	});
}

// async function listenToConsole() {
//   const terminal = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });

//   terminal.question("", (command) => {
//     console.log('test');
//     if (command == "r") {  // refresh
//     }
//     terminal.close();
//     listenToConsole();
//   });
// }

function loadOrCreateScheduleSet(): ScheduleSet {
	let scheduleSet: ScheduleSet;
	if (fs.existsSync(scheduleJSONpath)) scheduleSet = JSON.parse(String(fs.readFileSync(scheduleJSONpath)), reviver);
	else scheduleSet = new Map();
	return scheduleSet;
}

function saveScheduleSet(scheduleSet: ScheduleSet) {
	fs.writeFileSync(scheduleJSONpath, JSON.stringify(scheduleSet, replacer)); // Saved in 33ms
}
