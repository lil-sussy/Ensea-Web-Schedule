import { Server } from 'socket.io'
import loadScheduleDataFromString from './ScheduleExport'

const SocketHandler = (req, res) => {  // Socket io of the server
  if (res.socket.server.io) {  // Not used
    console.log('Socket is already running')  // There is a lot of socket that are connected to socket io when a client is simply opening a page on a browser, this is ignored
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server, {
      // pingTimeout: 30000,
      secure: true,
    })
    // res.socket.server.io = io
    io.on('packet', (packet) => {
      console.log('received packet:', packet)
    })
    io.on('connect_error', (err) => {
      console.log(err)
    })
    io.on('connection', function(socket) {
      const testData = "2[\"uwu-ade-weekly-shcedule///-/0/-/;-;0;-;;-;1;-;;-;2;-;;; 1ère A ENSEA;; Rattrapage FISE 1A et 2A,,1ère A ENSEA,,1ère B ENSEA,,2ème ENSEA,,A01,,A02,,A103,,13h30 - 17h30;-;3;-;;; 1ère A ENSEA;; Rattrapage FISE 1A et 2A,,1ère A ENSEA,,1ère B ENSEA,,2ème ENSEA,,A01,,A02,,A103,,13h30 - 17h30;-;4;-;/-/1/-/;-;0;-;;-;1;-;;-;2;-;;-;3;-;;-;4;-;/-/2/-/;-;0;-;;-;1;-;;-;2;-;;-;3;-;;-;4;-;;; 1ère A ENSEA;; Connective day,,1ère A ENSEA,,1ère B ENSEA,,1ère DA,,1ère DC,,Amphi Watteau,,13h30 - 17h30/-/3/-/;-;0;-;;-;1;-;;; 1ère A ENSEA;; CM Conversion d'énergie en alternatif,,1ère A ENSEA,,1ère B ENSEA,,GERALDO Frédéric,,Amphi Watteau,,13h30 - 15h30;; 1ère A ENSEA;; CM Systèmes linéaires,,1ère A ENSEA,,1ère B ENSEA,,GIANNINI Frédérique,,Amphi Watteau,,15h30 - 17h30;; 1G2 TD1;; TD Anglais 1A,,1G2 TD1,,1G2 TD2,,1G2 TD3,,BEDIRA Sami,,FEARON Mel,,TOPCZYNSKI Magalie,,ROMON Emmanuelle,,A206,,A207,,A208,,A209,,08h00 - 10h00;-;2;-;;; 1ère A ENSEA;; CM Systèmes électroniques,,1ère A ENSEA,,DELACRESSONNIÈRE Bruno,,Amphi Watteau,,10h00 - 12h00;; 1G1 TD1;; TD Systèmes électroniques,,1G1 TD1,,DELACRESSONNIÈRE Bruno,,A108,,13h30 - 15h30;; 1G1 TD3;; TD Systèmes électroniques,,1G1 TD3,,DUPERRIER Cédric,,A112,,13h30 - 15h30;-;3;-;;; 1G2 TD1;; TD Analyse de Fourier 1A,,1G2 TD1,,AUGIER Adeline,,A201,,08h00 - 10h00;-;4;-;;; 1G1 TD1;; TD Allemand / Espagnol 1A,,1G1 TD1,,1G1 TD2,,1G1 TD3,,PAAPE Iris,,FLINT LUH Stéphanie,,CHIPI Eneko,,GALDEANO Jean-François,,MARINAS Ruth,,A105,,A107,,A106,,A208,,A209,,13h30 - 15h30;; 1G1 TD2;; TD Systèmes électroniques,,1G1 TD2,,LAROCHE Christian,,A08,,15h30 - 17h30;; 1G1 TD3;; TD Analyse de Fourier 1A,,1G1 TD3,,AUGIER Adeline,,A212,,10h00 - 12h00;; 1G2 TD1;; TD Systèmes électroniques,,1G2 TD1,,SABOURAUD-MULLER Carine,,A08,,13h30 - 15h30;; 1G2 TD1;; TD Allemand / Espagnol 1A,,1G2 TD1,,1G2 TD2,,1G2 TD3,,PAAPE Iris,,FLINT LUH Stéphanie,,CHIPI Eneko,,GALDEANO Jean-François,,MARINAS Ruth,,A105,,A107,,A106,,A208,,A209,,15h30 - 17h30;; 1G2 TD2;; TD Analyse de Fourier 1A,,1G2 TD2,,EGLOFFE Anne-Claire,,A109,,10h00 - 12h00;; 1G2 TD2;; TD Systèmes électroniques,,1G2 TD2,,DUPERRIER Cédric,,A111,,13h30 - 15h30;; 1G2 TD3;; TD Systèmes linéaires,,1G2 TD3,,GIANNINI Frédérique,,A108,,10h00 - 12h00;; 1G2 TD3;; TD Systèmes électroniques,,1G2 TD3,,QUINTANEL Sébastien,,A112,,13h30 - 15h30/-/4/-/\"]"
      console.log('Client connected to socket %s', socket.id); // x8WIv7-mJelg7on_ALbx
    
      socket.conn.once("upgrade", () => {
        console.log("socket %s upgraded ", socket.id)
          // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
      });

      socket.on('connect_error', (err) => {
        console.log(err)
      })
    
      socket.conn.on("packet", ({ type, data }) => {
          // called for each packet received
          console.log('packet recieved from socket %s of type: %s, data: %s', socket.id, type, (data == undefined ? undefined : data.slice(0, 30)))
          if (data != undefined) {
            if (data.includes('uwu-ade-weekly-shcedule')) {
              loadScheduleDataFromString(data)
              socket.conn.emit('data was loaded correctly. %s', data);
            } else {
              socket.conn.emit('Handshake failed, disconnection')
            }
          }
      });
    
      socket.conn.on("packetCreate", ({ type, data }) => {
        console.log('packet sent of type : %s, data: ', type, data)
          // called for each packet sent
      });
    
      socket.conn.on("drain", () => {
          // called when the write buffer is drained
      });
    
      socket.conn.on("close", (reason) => {
        console.log("Connection closed %s", reason)
          // called when the underlying connection is closed
      });
      socket.on('disconnect', () => {
          console.log('Client disconnected');
      });
    
      socket.on('chat message', function(msg) {
          console.log("Received a chat message");
          console.log(msg)
          io.emit(msg);
      });
    })
  }
  res.end()
}

export default SocketHandler