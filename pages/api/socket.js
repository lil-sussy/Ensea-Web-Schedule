import { Server } from 'socket.io'
import saveDB from '../../components/LoadScheduleData'

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
    
      console.log('Client connected to socket %s', socket.id); // x8WIv7-mJelg7on_ALbx
    
      socket.conn.once("upgrade", () => {
          // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
      });

      socket.on('connect_error', (err) => {
        console.log(err)
      })
    
      socket.conn.on("packet", ({ type, data }) => {
          // called for each packet received
          console.log('packet recieved of type: %s, data: %s', type, data)
          if (data.includes('uwu-ade-weekly-shcedule')) {
            saveDB(data)
            socket.conn.emit('data was loaded correctly. %s', msg);
          } else {
            socket.conn.emit('Handshake failed, disconnection')
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