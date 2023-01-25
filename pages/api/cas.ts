import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "firebase-admin";
import { getAuth, UserRecord } from "firebase-admin/auth";
import { initializeApp, App, applicationDefault } from "firebase-admin/app";

import type { ServiceAccount } from "firebase-admin"

type User = {
  email: string;
  displayName: string;
  password: string;
};

export type CasResponse = {
  userToken: string;
  user: User;
};

//Firebase admin
export const GOOGLE_APPLICATION_CREDENTIALS =
  process.cwd() + "/private/firebaseAdminPrivateKey.json";

if (firebaseAdmin.apps.length == 0) {
  const test: ServiceAccount = {
    projectId: process.env['PROJECT_ID'],
    privateKey: process.env['PRIVATE_KEY'],
    clientEmail: process.env['CLIENT_EMAIL'],
  };
  initializeApp({
    credential: firebaseAdmin.credential.cert(test),
  });
}

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cas_host = "https://identites.ensea.fr/cas";
  const service = req.headers.host + "/ews";
  const ticket = req.headers.ticket;
  if (ticket) {
    const data = await fetch(
      cas_host +
        "/serviceValidate?service=http://" +
        service +
        "&ticket=" +
        ticket
    );
    let textData = await data.text();
    if (
      textData.includes('<cas:authenticationFailure code="INVALID_TICKET">')
    ) {
      res
        .status(400)
        .json({ status: 400, message: "Cas auhtentification failed" });
    } else {
      let list_user = textData.match(/(<cas:user>)(.+?)(<\/cas:user>)/i);
      let uname = list_user[0];
      uname = uname.replace("<cas:user>", "");
      uname = uname.replace("</cas:user>", "");
      let listEmail = textData.match(/(<cas:mail>)(.+?)(<\/cas:mail>)/i);
      let email = listEmail[0];
      email = email.replace("<cas:mail>", "");
      email = email.replace("</cas:mail>", "");
      const user: User = {
        email: email,
        displayName: email.split("@")[0].replace(".", " "), // Yeah this is cringe, use : regex
        password: uname, // The password field is used to save the auth cas name of the user
      };
      const userId = ticket + ""; // Custom userID
      const customToken = await getAuth().createCustomToken(userId);
      res
        .status(200)
        .json({ userToken: customToken, user: user } as CasResponse);
    }
  } else {
    res
      .status(400)
      .json({
        status: 400,
        message:
          "This api is used to validate cas ticket, please provide a ticket",
      });
  }
}
