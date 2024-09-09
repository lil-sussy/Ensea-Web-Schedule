import { NextRequest, NextResponse } from "next/server"
import firebaseAdmin from "firebase-admin"
import { DecodedIdToken, getAuth } from "firebase-admin/auth"
import { initializeApp } from "firebase-admin/app"

import type { ServiceAccount } from "firebase-admin"

type User = {
	email: string
	fullName: string
	password: string
}

export type CasResponse =
	| {
			userToken: string
			user: User
	  }
	| {
      userToken: string
			user: DecodedIdToken
	  }

//Firebase admin
export const GOOGLE_APPLICATION_CREDENTIALS = process.cwd() + "/private/firebaseAdminPrivateKey.json"

if (firebaseAdmin.apps.length == 0) {
	const test: ServiceAccount = {
		projectId: process.env["PROJECT_ID"],
		privateKey: process.env["PRIVATE_KEY"],
		clientEmail: process.env["CLIENT_EMAIL"],
	}

	initializeApp({
		credential: firebaseAdmin.credential.cert(test),
	})
}

export async function GET(request: NextRequest) {
	const cas_host = "https://identites.ensea.fr/cas"
	const service = request.headers.get("host") || ""
	const ticket = request.headers.get("ticket")
	const tokenID = request.headers.get("tokenid")

	if (tokenID) {
		try {
			const userRecord = await getAuth().verifyIdToken(tokenID)
			return NextResponse.json({ user: userRecord } as CasResponse, { status: 200 })
		} catch (error) {
			return NextResponse.json({ status: 400, message: "TokenID is not valid" }, { status: 400 })
		}
	} else if (ticket) {
		const data = await fetch(cas_host + "/serviceValidate?service=http://" + service + "&ticket=" + ticket)
		let textData = await data.text()
		if (textData.includes('<cas:authenticationFailure code="INVALID_TICKET">')) {
			return NextResponse.json({ status: 400, message: "Cas authentication failed" }, { status: 400 })
		} else {
			const user = parseUserFromData(textData)
			const userId = user.email + "" // Custom userID
			const customToken = await getAuth().createCustomToken(userId)
			return NextResponse.json({ userToken: customToken, user: user } as CasResponse, { status: 200 })
		}
	} else {
		return NextResponse.json({
			status: 400,
			message: "This API is used to validate CAS ticket, please provide a ticket or tokenID",
		}, { status: 400 })
	}
}

export async function POST(request: NextRequest) {
	// Handle POST request here if needed
	return NextResponse.json({ status: 405, message: "Method Not Allowed" }, { status: 405 })
}

function parseUserFromData(textData: string): User {
	let list_user = textData.match(/(<cas:user>)(.+?)(<\/cas:user>)/i)
	if (!list_user) throw new Error("User not found in CAS response")
	let uname = list_user[0].replace("<cas:user>", "").replace("</cas:user>", "")
	let listEmail = textData.match(/(<cas:mail>)(.+?)(<\/cas:mail>)/i)
	if (!listEmail) throw new Error("Email not found in CAS response")
	let email = listEmail[0].replace("<cas:mail>", "").replace("</cas:mail>", "")
	return {
		email: email,
		fullName: email.split("@")[0].replace(".", " "), // Yeah this is cringe, use : regex
		password: uname, // The password field is used to save the auth cas name of the user
	}
}


