import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from 'firebase-admin'
import { getAuth, UserRecord } from 'firebase-admin/auth';
import { initializeApp, App, applicationDefault } from 'firebase-admin/app';

type User = {
  mail: String,
  firstName: String,
  lastName: String,
  uname: String,
}

//Firebase admin
export const GOOGLE_APPLICATION_CREDENTIALS = process.cwd()+'/private/firebaseAdminPrivateKey.json'

if (firebaseAdmin.apps.length == 0) {
  initializeApp({
    credential: firebaseAdmin.credential.cert(GOOGLE_APPLICATION_CREDENTIALS),
  });
}

export default async function Handler(req: NextApiRequest, res: NextApiResponse) {
  const cas_host = 'https://identites.ensea.fr/cas'
  const service = req.headers.host+'/api/cas';
  const ticket = req.headers.ticket;
  if (ticket) {
    const data = await fetch((cas_host + '/serviceValidate?service=' + service + '&ticket=' + ticket[0]))
    let textData = await data.text()
    console.log(textData)
    if (textData.includes('<cas:authenticationFailure code="INVALID_TICKET">')) {
      res.status(400).json({ status: 400, message: 'Cas auhtentification failed' })
    } else {
      let list_user = textData.match(/(<cas:user>)(.+?)(<\/cas:user>)/i);
      let uname = list_user[0];
      uname = uname.replace('<cas:user>', '');
      uname = uname.replace('<\/cas:user>', '');
      let listMail = textData.match(/(<cas:mail>)(.+?)(<\/cas:mail>)/i);
      let mail = listMail[0];
      mail = mail.replace('<cas:mail>', '');
      mail = mail.replace('<\/cas:mail>', '');
      const user: User = {
        mail: mail,
        firstName: mail.split('.')[0],
        lastName: mail.split('.')[1].split('@')[0],  // Yeah this is cringe, use : regex
        uname: uname,
      }
      const userId = ticket+'';  // Custom userID
      const customToken = await getAuth().createCustomToken(userId, user)
      res.status(200).json({ userToken: customToken })
    }
  } else {
    res.status(400).json({ status: 400, message: 'This api is used to validate cas ticket, please provide a ticket' })
  }
}