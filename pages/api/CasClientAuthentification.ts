import { NextApiRequest, NextApiResponse } from "next";
import CAS from "../../cas-client-node/src/index";

export default async function Handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cas_host = "https://identites.ensea.fr/cas";
  const service = process.env.casService;
  let ticket = req.query.ticket;
  if (ticket) {
    let re = await fetch(
      cas_host + "/serviceValidate?service=" + service + "&ticket=" + ticket
    );
    let data = await re.text();
    let list_user = data.match(/(<cas:user>)(.+?)(<\/cas:user>)/i);
    let user = list_user[0];
    user = user.replace("<cas:user>", "");
    user = user.replace("</cas:user>", "");
    console.log(user);
  }
  // const cas = new CAS({
  //   base_url         : 'https://identites.ensea.fr/cas/login',
  //   service     : 'https://ews.ensea.jsp.fr',
  //   version     : '3.0',
  //   renew           : false,
  //   is_dev_mode     : true,
  //   dev_mode_user   : '',
  //   dev_mode_info   : {},
  //   session_name    : 'cas_user',
  //   session_info    : 'cas_userinfo',
  //   destroy_session : false,
  //   return_to       : 'http://localhost:3000/'
  // })
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
