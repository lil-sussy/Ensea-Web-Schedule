import type ProgressBar from "progress"
import type { DecodedIdToken } from "firebase-admin/auth"


export type User = {
	email: string;
	fullName: string;
	password: string;
};

export type CasResponse =
	| {
			userToken: string;
			user: User;
	  }
	| {
			userToken: string;
			user: DecodedIdToken;
	  };

export interface Schedule {
  lastUpdate: string;
  weeks: Map<number, Map<string, Course[]>>;
}


export type CourseData = {
	name: string;
	dayOfWeek: string;
	date: string;
	week: number;
	beginDate: string; // Cuz we cant json stringify a Date
	endDate: string;
	teachers: string[];
	locations: string[];
	creationDate: Date;
	modificationDate: Date;
	exported: string;
};

export type Course = {
	id: string;
	courseData: CourseData;
};

export type ClassSchedule = { lastUpdate: Date | null; weeks: Map<number, Map<string, Course[]>> }; // One year of a classe schedule

export type ScheduleSet = Map<string, ClassSchedule>; // What is saved, the database structure


export type CalendarEvent = {
	created: Date;
	description: string;
	dtstamp: Date;
	end: Date;
	lastModified: Date;
	location: string;
	sequence: string;
	start: Date;
	summary: string;
	uid: string;
	type: string;
	params: any[];
};

export type Calendar = {
	[key: string]: CalendarEvent;
};

export type ScheduleFetcher = {
	fetchClassSchedule: (schedule: ClassSchedule, classeID: string, progressBar: ProgressBar) => Promise<ClassSchedule>;
};