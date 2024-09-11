import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import ProgressBar from "progress";
import admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import { replacer, reviver } from '../../utils';
import { refreshSchedules } from './scheduleComposer';
import { testEnvironement } from "./scheduleComposer";

import type { ClassSchedule, Course, ScheduleSet } from '../../types/types';

if (!admin.apps.length) {
	const firebaseConfig = {
		type: "service_account",
		project_id: "ensea-web-schedule",
		private_key_id: "a71aa00a3c5a5edd302d8f7e27b649eb9698b2e4",
		private_key: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
		client_email: "firebase-adminsdk-rj3fb@ensea-web-schedule.iam.gserviceaccount.com",
		client_id: "105461477154085530102",
		auth_uri: "https://accounts.google.com/o/oauth2/auth",
		token_uri: "https://oauth2.googleapis.com/token",
		auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
		client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-rj3fb%40ensea-web-schedule.iam.gserviceaccount.com",
		universe_domain: "googleapis.com",
	};

	admin.initializeApp({
		credential: admin.credential.cert(firebaseConfig as ServiceAccount),
	});
}

export type ScheduleFetcher = {
  fetchClassSchedule: (schedule: ClassSchedule, classeID: string, progressBar: ProgressBar) => Promise<ClassSchedule>;
};

const REFRESH_DURATION = testEnvironement ? 1 * 1000 : 5 * 60 * 1000; // 5min or 1s (test)
const scheduleJSONpath = path.join(process.cwd() + "/app/data/schedules.json"); // Path of the schedule json to save the all thing

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const classID = searchParams.get('classID');
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ status: 401, message: "Missing or invalid Authorization header" }, { status: 401 });
  }

  const userToken = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(userToken);
    const uid = decodedToken.uid;

    if (!classID) {
      return NextResponse.json({ status: 400, message: "Missing classID query parameter" }, { status: 400 });
    }

    await refreshSchedules(classID, REFRESH_DURATION);
    const schedules: ScheduleSet = JSON.parse(String(fs.readFileSync(scheduleJSONpath)), reviver);
    const classSchedule = schedules.get(classID);

    if (classSchedule) {
      return NextResponse.json({ totalSchedule: JSON.stringify(classSchedule, replacer) });
    } else {
      return NextResponse.json({ status: 404, message: 'No schedule found for classID ' + classID }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ status: 403, message: "Invalid user token" }, { status: 403 });
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ status: 401, data: "Data not successfully loaded because it's automatic now" }, { status: 401 });
}


