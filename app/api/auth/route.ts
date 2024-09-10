import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import type { CasResponse, User } from "../../types/types";
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

export async function GET(request: NextRequest) {
	const cas_host = "https://identites.ensea.fr/cas";
	const ticket = request.headers.get("ticket");

	if (!ticket) {
		return NextResponse.json(
			{
				status: 400,
				message: "This API is used to validate CAS ticket, please provide a ticket or tokenID",
			},
			{ status: 400 }
		);
	}
  
  const service = request.headers.get("referer")?.split("?ticket")[0] || "";
	const data = await fetch(`${cas_host}/serviceValidate?service=${encodeURIComponent(service)}&ticket=${encodeURIComponent(ticket)}`);
	let textData = await data.text();
	if (textData.includes('<cas:authenticationFailure code="INVALID_TICKET">')) {
		return NextResponse.json({ status: 400, message: "Cas authentication failed" }, { status: 400 });
	} else {
		const user = parseUserFromData(textData);
		const userId = user.email + ""; // Custom userID
		const customToken = await getAuth().createCustomToken(userId);
		return NextResponse.json({ userToken: customToken, user: user } as CasResponse, { status: 200 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const tokenID = body.tokenID;
		const userRecord = await getAuth().verifyIdToken(tokenID);
		return NextResponse.json({ user: userRecord } as CasResponse, { status: 200 });
	} catch (error) {
		return NextResponse.json({ status: 400, message: "TokenID is not valid" }, { status: 400 });
	}
}

function parseUserFromData(textData: string): User {
	let list_user = textData.match(/(<cas:user>)(.+?)(<\/cas:user>)/i);
	if (!list_user) throw new Error("User not found in CAS response");
	let uname = list_user[0].replace("<cas:user>", "").replace("</cas:user>", "");
	let listEmail = textData.match(/(<cas:mail>)(.+?)(<\/cas:mail>)/i);
	if (!listEmail) throw new Error("Email not found in CAS response");
	let email = listEmail[0].replace("<cas:mail>", "").replace("</cas:mail>", "");
	return {
		email: email,
		fullName: email.split("@")[0].replace(".", " "), // Yeah this is cringe, use : regex
		password: uname, // The password field is used to save the auth cas name of the user
	};
}
