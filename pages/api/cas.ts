import { NextApiRequest, NextApiResponse } from "next";
import CAS from "../../cas-client-node/src/index";

type User = {
  mail: String,
  firstName: String,
  lastName: String,
  uname: String,
}

let authed = false
export default async function Handler(req: NextApiRequest, res: NextApiResponse) {
  const cas_host = 'https://identites.ensea.fr/cas'
  const service = process.env.casService ? process.env.casService : 'http://localhost:3000/api/cas'
  const ticket = req.query.ticket;
  console.log(req.query)
  if (ticket) {
    console.log('auhted');
    authed = true
    fetch((cas_host + '/serviceValidate?service=' + service + '&ticket=' + ticket)).then(async (data) => {
      let textData = await data.text()
      console.log(textData)
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
      res.status(200).json({ status: 200, user})
    })
  } else if (!authed) {
    res.redirect(307, '/sso')
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
