import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // New import
import { signInWithCustomToken } from "firebase/auth";
import Cookies from "js-cookie";

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

function casLogin(router: any) {
	const urlParams = new URLSearchParams(window.location.search);
	const ticket = urlParams.get("ticket");
	const host = window.location.href;

	if (ticket) {
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
					Cookies.set("accessToken", userToken, { expires: 7, secure: true });
					signInWithCustomToken(auth, userToken)
						.then((userCredential) => {
							return userCredential.user.getIdToken();
						}).then((idToken) => {
              Cookies.set("idToken", idToken, { expires: 7, secure: true });
            })
						.catch((error) => console.log("error", error));
				}
			});
	} else {
		router.push(`https://identites.ensea.fr/cas/login?service=${encodeURIComponent(host)}`);
	}
}

export function handleLogin(router: any) {
	if (Cookies.get("accessToken")) {
		const userToken = Cookies.get("accessToken");
		signInWithCustomToken(auth, userToken!)
			.then((userCredential) => {
				return userCredential.user.getIdToken();
			})
			.then((idToken) => {
				Cookies.set("idToken", idToken, { expires: 7, secure: true });
			})
			.catch((error) => {
				casLogin(router);
			});
	} else {
		casLogin(router);
	}
}

export const fetchSchedule = async (classID: string) => {
	const userToken = Cookies.get("idToken");
	try {
		const response = await fetch(`/api/schedule?classID=${classID}`, {
			headers: {
				Authorization: `Bearer ${userToken}`,
			},
		});
		const data = await response.json();
		return data.totalSchedule;
	} catch (error) {
		console.error("Error fetching schedule:", error);
	}
};

export const postUserScheduleSetting = async (classID: string) => {
  const userToken = Cookies.get("idToken");
  try {
    await fetch("/api/user", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${userToken}`,
			},
			body: JSON.stringify({ classID }),
		});
  } catch (error) {
    console.error("Error posting user schedule setting:", error);
  }
};

export const getUserScheduleSetting = async () => {
  const userToken = Cookies.get("idToken");
  try {
    const response = await fetch("/api/user", {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    const data = await response.json();
    return data.classID;
  } catch (error) {
    console.error("Error fetching user schedule setting:", error);
  }
}
