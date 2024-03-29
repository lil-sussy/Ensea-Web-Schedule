import fs from 'fs'
import ical from "ical"

import type { Calendar } from '../components/ews/lib/ADEFetcher'

export function testParseADE() {
  const file = fs.readFileSync("./tests/ADECal.ics")
  const lines = file.toString()
  const calendar: Calendar = ical.parseICS(lines)
  for (const [key, value] of Object.entries(calendar)) {
    const test: string =""
    const test2 = test.search("TP")
    if (value.description.search("TP") != -1) 
      console.log(new Date(value.start).getHours())
	}
}