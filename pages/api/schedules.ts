import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import path from 'path';
import ProgressBar from "progress"
import scheduleFetcher from '../../components/ews/lib/ADEFetcher'
import { scheduleIDs, scheduleList } from "../../private/classesTree"
//test
import readline from 'readline'
import testICal from '../../tests/testICal'

export const testEnvironement = false

export type ScheduleFetcher = {
	fetchClassSchedule: (schedule: ClassSchedule, classeID: string, progressBar: ProgressBar) => Promise<ClassSchedule>
}

export type CourseData = {
  name: string
  dayOfWeek: string
  date: string
  week: number
  beginDate: string  // Cuz we cant json stringify a Date
  endDate: string
  beginHour: string
  endHour: string
  teachers: string[]
  locations: string[]
  creationDate: Date
  modificationDate: Date
  exported: string
}

export type Course = {
	id: string
	courseData: CourseData
}

export type ClassSchedule = { lastUpdate: Date; weeks: Map<number, Map<String, Course[]>> }  // One year of a classe schedule

export type ScheduleSet = Map<String, ClassSchedule>  // What is saved, the database structure

const REFRESH_DURATION = testEnvironement ? 1 * 1000 : 5 * 60 * 1000 // 5min or 1s (test)

//Api Handler
export default async function Handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == 'POST') {  // No posts
    res.status(200).json({status: 401, data: "Data not succesfully loaded cuz it's automatique now mf :3"})
  } else if (req.method == 'GET') {
    if (req.headers['classe'] == undefined) {
      res.status(400).json({ status: 400, message: "Unsupported headers"});
      return
    }
    const classe = req.headers['classe'] as string
    if (classe) {
      refreshSchedules(classe, REFRESH_DURATION)
      const schedules:ScheduleSet = JSON.parse(String(fs.readFileSync(path.join(process.cwd(), '/private/schedules.json'))), reviver)
      res.status(200).json({totalSchedule: JSON.stringify(schedules.get(classe), replacer)})
    } else {
      res.status(404).json({ status: 404, message:'No classe schedule found for this classe '+classe })
    }
  } else {
    res.status(400).json({ status: 400, message:'Only get and post request are handled' })
  }
}  // Get request of the entire shcedule of 1 year for every classe

const scheduleJSONpath = path.join(process.cwd() + "/private/schedules.json") // Path of the schedule json to save the all thing

async function refreshSchedules(classeID: string, refreshDuration: number) {
  const progressBar = new ProgressBar("Updating from ADE - :percent (:bar) :schedule.", {
		total: Array.from(scheduleIDs.keys()).length,
		complete: "#",
		incomplete: " ",
		width: 30,
		clear: true,
	})
	return new Promise(async (resolve) => {
		const beginTime = new Date() // Begining time of process
		let scheduleSet: ScheduleSet = loadOrCreateScheduleSet()
		// Getting or Creating a class schedule to add it and save
		let schedule = scheduleSet.get(classeID) ? scheduleSet.get(classeID) : { lastUpdate: null, weeks: new Map<number, Map<string, Course[]>>() }
		if (!schedule.lastUpdate || new Date().getTime() - new Date(schedule.lastUpdate).getTime() > refreshDuration) {
			// If last update is older than 5min
			console.log("Starting new update for %s's schedule from ADE servers...", classeID)
			console.log(
				"last update of %s is older than 5min. Updating...",
				classeID,
				new Date(schedule.lastUpdate).toLocaleString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })
			)
      if (testEnvironement) {
        schedule = await testICal.fetchClassSchedule(schedule, classeID, progressBar)
        listenToConsole()
      }
      else
        schedule = await scheduleFetcher.fetchClassSchedule(schedule, classeID, progressBar)
			// schedule = await scheduleFetcher.fetchClassSchedule(schedule, classeID, progressBar)
      scheduleSet.set(classeID, schedule)
			saveScheduleSet(scheduleSet)
			console.log("Schedule of class %s was succesfully updated in %d ms", classeID, new Date().getTime() - beginTime.getTime())
		} else {
			console.log(
				"%s's schedule is up to date (%s)",
				classeID,
				new Date(schedule.lastUpdate).toLocaleString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })
			)
		}
		resolve(scheduleSet.get(classeID))
	})
}

async function listenToConsole() {
  const terminal = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	})

	terminal.question("", (command) => {
    console.log('test')
    if (command == "r") {  // refresh
    }
		terminal.close()
    listenToConsole()
	})
}

function loadOrCreateScheduleSet(): ScheduleSet {
	let scheduleSet: ScheduleSet;
  if (fs.existsSync(scheduleJSONpath))
    scheduleSet = JSON.parse(String(fs.readFileSync(scheduleJSONpath)), reviver)
	else
    scheduleSet = new Map()
	return scheduleSet
}

function saveScheduleSet(scheduleSet: ScheduleSet) {
	fs.writeFileSync(scheduleJSONpath, JSON.stringify(scheduleSet, replacer)) // Saved in 33ms
}

export function replacer(key, value) {
	if (value instanceof Map) {
		return {
			dataType: "Map",
			value: Array.from(value.entries()), // or with spread: value: [...value]
		}
	} else {
		return value
	}
}

export function reviver(key, value) {
	if (typeof value === "object" && value !== null) {
		if (value.dataType === "Map") {
			return new Map(value.value)
		}
	}
	return value
}