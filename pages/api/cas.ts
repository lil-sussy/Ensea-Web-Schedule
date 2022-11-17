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
export const GOOGLE_APPLICATION_CREDENTIALS = process.cwd()+'/private/googleprivatekey.json'

if (firebaseAdmin.apps.length == 0) {
  initializeApp({
    credential: firebaseAdmin.credential.cert(GOOGLE_APPLICATION_CREDENTIALS),
  });
}

export default async function Handler(req: NextApiRequest, res: NextApiResponse) {
  const cas_host = 'https://identites.ensea.fr/cas'
  const service = process.env.casService ? process.env.casService : 'http://localhost:3000/api/cas'
  const ticket = req.headers.ticket;
  const idToken = req.headers.idToken;
  if (ticket) {
    const data = await fetch((cas_host + '/serviceValidate?service=' + service + '&ticket=' + ticket[0]))
    // let textData = await data.text()
    // console.log(textData)
    // let list_user = textData.match(/(<cas:user>)(.+?)(<\/cas:user>)/i);
    // let uname = list_user[0];
    // uname = uname.replace('<cas:user>', '');
    // uname = uname.replace('<\/cas:user>', '');
    // let listMail = textData.match(/(<cas:mail>)(.+?)(<\/cas:mail>)/i);
    // let mail = listMail[0];
    // mail = mail.replace('<cas:mail>', '');
    // mail = mail.replace('<\/cas:mail>', '');
    const mail = 'ratio.uwu@cringe.diesofcringe'
    const uname = 'palu'
    const user: User = {
      mail: mail,
      firstName: mail.split('.')[0],
      lastName: mail.split('.')[1].split('@')[0],  // Yeah this is cringe, use : regex
      uname: uname,
    }
    // const bob: UserRecord = await getAuth().getUser('bob');
    const userId = ticket+uname;  // Custom userID
    const additionalClaims = {
      premiumAccount: true,
    };
    
    const customToken = await getAuth().createCustomToken(userId, additionalClaims)
    res.status(200).json({ status: 200, body: 'Authentification succes', userToken: customToken })
  } else if(idToken) {
    // idToken comes from the client app
    getAuth()
      .verifyIdToken(idToken[0])
      .then((decodedToken) => {
        const uid = decodedToken.uid;
        console.log('decoded token : ', decodedToken)
        res.status(200).json({ status: 200, userToken: decodedToken })
      })
      .catch((error) => {
        console.log(error)
        res.status(400).json({ status: 400, body: "I'm sorry but this user doesnt exist" })
      });
    } else {
      res.status(400).json({ status: 400, body: 'This api is used to validate cas ticket or idToken, please provide a ticket or tokenID' })
  }

  // const cas = new CAS({
  //   base_url         : 'https://identites.ensea.fr/cas/login',
  //   service     : 'https://ews.ensea.jsp.fr',
  // cas.authenticate(req, res, function(err, status, username, extended) {
  //   if (err) {
  //     // Handle the error
  //     res.send({error: err});
  //   } else {
  //     // Log the user in
  //     console.log(username);
  //     res.send({status: status, username: username, attributes: extended.attributes});
  //   }
  // });
}
