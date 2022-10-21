// server.js
const { parse } = require('url')
const next = require('next')
const data = require("./LocalDataHandler")
const http = require("http");
const io = require("socket.io");


const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

let schedule = [];

app.prepare().then(() => {

  const server = http.createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl

      if (pathname === '/a') {
        await app.render(req, res, '/a', query)
      } else if (pathname === '/b') {
        await app.render(req, res, '/b', query)
      } else {
        await handle(req, res, parsedUrl)
      }
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
  // io.listen(server)
  // io.on('connection', function (socket) {
  
  //   console.log('Client connected to socket { %s }', socket.id); // x8WIv7-mJelg7on_ALbx
  
  //   socket.conn.once("upgrade", () => {
  //     // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
  //   });
  
  //   socket.conn.on("packet", ({ type, data }) => {
  //     // called for each packet received
  //     console.log('packet recieved type: %s, data: %s', type, data)
  //     if (data.includes('uwu-ade-weekly-shcedule')) {
  //       schedule = data.loadScheduleDataFromString(data)
  //     }
  //     io.emit('data was loaded correctly. %s', data);
  //   });
  //   socket.on('disconnect', () => {
  //     console.log('Client disconnected');
  //   });
  
  //   socket.on('chat message', function (msg) {
  //     console.log("Received a chat message");
  //     console.log(msg)
  //     io.emit(msg);
  //   });
  // })
})
