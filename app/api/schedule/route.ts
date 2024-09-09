import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import ProgressBar from "progress";
import scheduleFetcher from '../../../components/ews/lib/ADEFetcher';
import { scheduleIDs, scheduleList } from "./scheduleTree";
import readline from 'readline';
import testICal from '../../../tests/testICal';

import type { ClassSchedule, Course, ScheduleSet } from '../../types/Schedule';

export const testEnvironement = false;

export type ScheduleFetcher = {
  fetchClassSchedule: (schedule: ClassSchedule, classeID: string, progressBar: ProgressBar) => Promise<ClassSchedule>;
};

const REFRESH_DURATION = testEnvironement ? 1 * 1000 : 5 * 60 * 1000; // 5min or 1s (test)

export async function GET(request: NextRequest) {
  if (!request.headers.get('classe')) {
    return NextResponse.json({ status: 400, message: "Unsupported headers" }, { status: 400 });
  }
  const classe = request.headers.get('classe') as string;
  if (classe) {
    await refreshSchedules(classe, REFRESH_DURATION);
    const schedules: ScheduleSet = JSON.parse(String(fs.readFileSync(path.join(process.cwd(), '/private/schedules.json'))), reviver);
    return NextResponse.json({ totalSchedule: JSON.stringify(schedules.get(classe), replacer) });
  } else {
    return NextResponse.json({ status: 404, message: 'No classe schedule found for this classe ' + classe }, { status: 404 });
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ status: 401, data: "Data not successfully loaded because it's automatic now" }, { status: 401 });
}

const scheduleJSONpath = path.join(process.cwd() + "/private/schedules.json"); // Path of the schedule json to save the all thing

async function refreshSchedules(classeID: string, refreshDuration: number): Promise<ClassSchedule | undefined> {
  const progressBar = new ProgressBar("Updating from ADE - :percent (:bar) :schedule.", {
    total: Array.from(scheduleIDs.keys()).length,
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
      console.log(
        "last update of %s is older than 5min. Updating...",
        classeID,
        schedule.lastUpdate ? new Date(schedule.lastUpdate).toLocaleString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }) : "never"
      );
      if (testEnvironement) {
        schedule = await testICal.fetchClassSchedule(schedule, classeID, progressBar);
        listenToConsole();
      } else {
        schedule = await scheduleFetcher.fetchClassSchedule(schedule, classeID, progressBar);
      }
      scheduleSet.set(classeID, schedule);
      saveScheduleSet(scheduleSet);
      console.log("Schedule of class %s was successfully updated in %d ms", classeID, new Date().getTime() - beginTime.getTime());
    } else {
      console.log(
        "%s's schedule is up to date (%s)",
        classeID,
        new Date(schedule.lastUpdate).toLocaleString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })
      );
    }
    resolve(scheduleSet.get(classeID));
  });
}

async function listenToConsole() {
  const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  terminal.question("", (command) => {
    console.log('test');
    if (command == "r") {  // refresh
    }
    terminal.close();
    listenToConsole();
  });
}

function loadOrCreateScheduleSet(): ScheduleSet {
  let scheduleSet: ScheduleSet;
  if (fs.existsSync(scheduleJSONpath))
    scheduleSet = JSON.parse(String(fs.readFileSync(scheduleJSONpath)), reviver);
  else
    scheduleSet = new Map();
  return scheduleSet;
}

function saveScheduleSet(scheduleSet: ScheduleSet) {
  fs.writeFileSync(scheduleJSONpath, JSON.stringify(scheduleSet, replacer)); // Saved in 33ms
}

export function replacer(key: any, value: any) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

export function reviver(key: any, value: any) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
  }
  return value;
}

