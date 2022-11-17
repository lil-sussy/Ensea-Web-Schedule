import { NextApiRequest, NextApiResponse } from "next";
import CAS from "../../cas-client-node/src/index";


let authed = false
export default async function Handler(req: NextApiRequest, res: NextApiResponse) {
  const cas_host = 'https://identites.ensea.fr/cas'
  const service = process.env.casService ? process.env.casService : 'http://localhost:3000/api/cas'
  const ticket = req.query.ticket;
  console.log(req.query)
  if (ticket) {
    console.log('auhted');
    authed = true
    fetch((cas_host + '/serviceValidate?service=' + service + '&ticket=' + ticket)).then(async (res) => {
      const data = await res.text()
      console.log(data)
      const body = res.body as any
      console.log(body)
      // let list_user = data.match(/(<cas:user>)(.+?)(<\/cas:user>)/i);
      // let user = list_user[0];
      // user = user.replace('<cas:user>', '');
      // user = user.replace('<\/cas:user>', '');
    })
    res.status(200)
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
