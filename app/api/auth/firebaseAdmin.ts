import admin from "firebase-admin";
import type { ServiceAccount } from "firebase-admin";

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

export default admin;