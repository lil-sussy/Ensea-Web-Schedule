import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // New import
import { signInWithCustomToken } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyAH1WvRPNDwIOwuS7fRodexNiJW6k-uvPs",
	authDomain: "ensea-web-schedule.firebaseapp.com",
	projectId: "ensea-web-schedule",
	storageBucket: "ensea-web-schedule.appspot.com",
	messagingSenderId: "199059616108",
	appId: "1:199059616108:web:02eab45e13ac597e638349",
	measurementId: "G-DFMX68CNV4",
};

export const firebase = initializeApp(firebaseConfig);
export const database = getFirestore(firebase);
export const auth = getAuth(firebase);

export function handleLogin(router: any) {
	const urlParams = new URLSearchParams(window.location.search);
	const ticket = urlParams.get("ticket");
	const host = window.location.href;

	if (auth.currentUser) {
		auth.currentUser.getIdToken(true).then((userToken) => {
			fetch("/api/auth", {
				method: "POST",
				body: JSON.stringify({ tokenID: userToken }),
			})
				.then((res) => res.json())
				.then((apiRes) => {
					const user = apiRes.user;
				})
				.catch((error) => console.log("error", error));
		});
	} else if (ticket) {
		fetch("/api/auth", {
			method: "GET",
			headers: { ticket: ticket },
		})
			.then((res) => {
				if (res.status === 400) {
          const newUrl = new URL(host);
          newUrl.searchParams.delete("ticket");
					router.push(`https://identites.ensea.fr/cas/login?service=${encodeURIComponent(newUrl.toString())}`);
				} else {
					return res.json();
				}
			})
			.then((apiRes) => {
				const { userToken } = apiRes;
				if (userToken) {
					signInWithCustomToken(auth, userToken).catch((error) => console.log("error", error));
				}
			});
	} else {
		router.push(`https://identites.ensea.fr/cas/login?service=${encodeURIComponent(host)}`);
	}
}


export const fetchSchedule = async (classID: string) => {
	try {
		const response = await fetch(`/api/schedule?classID=${classID}`);
		const data = await response.json();
    return data.totalSchedule;
	} catch (error) {
		console.error("Error fetching schedule:", error);
	}
};