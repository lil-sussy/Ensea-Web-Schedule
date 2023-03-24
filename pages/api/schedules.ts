import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import path from 'path';
import scheduleFetcher from '../../components/ews/lib/ADEFetcher'

export type ScheduleFetcher = {
	fetchClassSchedule: (classeID: string, refreshDuration: number) => Promise<ClassSchedule>
}

export type Course = {
	id: string
	courseData: {
		name: string
		dayOfWeek: string
		date: string
		week: number
		begin: string
		end: string
		teachers: string[]
		locations: string[]
		creationDate: Date
		modificationDate: Date
		exported: string
	}
}

export type ClassSchedule = { lastUpdate: Date; weeks: Map<number, Map<String, Course[]>> }  // One year of a classe schedule

export type ScheduleSet = Map<String, ClassSchedule>  // What is saved, the database structure

const REFRESH_DURATION = 5 * 60 * 1000 // 5min

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
      scheduleFetcher.fetchClassSchedule(classe, REFRESH_DURATION)
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


export function loadOrCreateScheduleSet(): ScheduleSet {
	let scheduleSet: ScheduleSet
	if (fs.existsSync(scheduleJSONpath)) JSON.parse(String(fs.readFileSync(scheduleJSONpath)), reviver)
	else scheduleSet = new Map()
	return scheduleSet
}

export function saveScheduleSet(scheduleSet: ScheduleSet) {
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