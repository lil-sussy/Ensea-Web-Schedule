import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import admin from "firebase-admin";
import type { ServiceAccount } from "firebase-admin";

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

export async function POST(request: NextRequest) {
	try {
		const { classID } = await request.json();
		const authHeader = request.headers.get('Authorization');

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return NextResponse.json({ status: 401, message: "Missing or invalid Authorization header" }, { status: 401 });
		}

		const userToken = authHeader.split(' ')[1];
		const decodedToken = await admin.auth().verifyIdToken(userToken);
		const uid = decodedToken.uid;

		await admin.firestore().collection("users").doc(uid).set(
			{
				lastSchedule: classID,
			},
			{ merge: true }
		);

		return NextResponse.json({ status: 200, message: "User schedule setting updated successfully" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ status: 500, message: "Internal Server Error", error: (error as Error).message }, { status: 500 });
	}
}

export async function GET(request: NextRequest) {
	try {
		const authHeader = request.headers.get('Authorization');

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return NextResponse.json({ status: 401, message: "Missing or invalid Authorization header" }, { status: 401 });
		}

		const userToken = authHeader.split(' ')[1];
		const decodedToken = await admin.auth().verifyIdToken(userToken);
		const uid = decodedToken.uid;

		const userDoc = await admin.firestore().collection('users').doc(uid).get();

		if (!userDoc.exists) {
			return NextResponse.json({ status: 404, message: "User not found" }, { status: 404 });
		}

		const userData = userDoc.data();

		return NextResponse.json({ status: 200, userScheduleSetting: userData?.lastSchedule }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ status: 500, message: "Internal Server Error", error: (error as Error).message }, { status: 500 });
	}
}