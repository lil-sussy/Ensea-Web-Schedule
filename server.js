// server.js
const { parse } = require('url')
const next = require('next')
const http = require("http");
const io = require("socket.io");
const { handleClientScriptLoad } = require('next/script');


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

      handleClientScriptLoad(req, res)  // Session infos

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


function getSchedule(shceduleName) {

}

function removeSpaces(str) {
    let begin = 0
    let end = 0
    while (String(str).charAt(begin) === ' ') {
        begin++
    }
    while (str.charAt(str.length - 1 - end) === " ") {
        end++
    }
    return str.slice(begin, str.length - 1 - end)
}

function loadScheduleDataFromString(data) {
    const headlength = "2['uwu-ade-weekly-shcedule// ".length // Replace char ' with char "
    const taillength = "']".length // removing the bracket at the end
    data = data.slice(headlength, data.length - taillength)
    const daysData = data.split(';-;')
    const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    let currentDay = ''
    const schedule = []
    for (let count = 0; count < daysData.length; count++) {
        if (!Number.isNaN(Number(daysData[count]))) { // Then it's the dayIndex
            currentDay = week[Number(daysData[count])]
        } else {
            const courses = data.split(';;') // ;; is the course splitter
            for (let i = 0; i < courses.length; i++) {
                const courseDataSplitted = courses[i].split(',,') // ,, is the information splitter
                let informations = "" // Other informations of the course such as concerned clases and teachers name
                for (let j = 1; j < courseDataSplitted.length - 1; j++) { informations += courseDataSplitted[j] }
                let course = { name: courseDataSplitted[0], time: courseDataSplitted[courseDataSplitted.length - 1], informations: informations }
                console.log(course)
                schedule.push(currentDay, course) // adding course data to schedule
            }
        }
    }
    return schedule
}
