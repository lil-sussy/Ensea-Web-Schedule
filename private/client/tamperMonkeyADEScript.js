// ==UserScript==
// @name         ADE Scraper UwU
// @version      0.3
// @description  ADE onlinhe schedule data scrapper
// @author       Nya UwU
// @grant        GM_addStyle
// @require      https://cdn.socket.io/3.1.3/socket.io.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @match         https://ade.ensea.fr/direct/index.jsp*
//
// ==/UserScript==

// const socket = io('https://enseawebschedule.herokuapp.com', { secure: true, extraHeaders: { 'Access-Control-Allow-Origin': 'https://enseawebschedule.herokuapp.com/' } })


const SIDE_BAR_SIZE = 1 + 45 // Size of the hour displaying sidebar wich is constant and used in absolute position calculs

function getCourseData(number) { // return the data of the {number} courses of the week
  let xpath = document.evaluate('//*[@id="inner' + String(number) + '"]', document).iterateNext() // selecting the first element (course) in the displayed schedule
  if (xpath == undefined || xpath == null || xpath.getAttribute('aria-label') == undefined) {
    return
  }
  let weekPosition = xpath.parentNode.parentNode.style.left // absolute position in the schedule tab from the left
  let data = xpath.getAttribute('aria-label').split(' null '); // the arialabel of the div containing schedule lesson info contains the informations of its children (everything to know about this course)
  let err = data.length == 0
  data = xpath.getAttribute('aria-label') // We only needed to see if the data was in the correct format but the entire string is sent as data
  if (err)
    return null;
  else
    return data;
}

function createSocketInstance() {
  // const socket = io('http://localhost:3000', {  // https://enseawebschedule.herokuapp.com
  //   transports: ['websocket', 'polling', 'flashsocket'],
  //   secure: false,
  //   query: "tampermonkey extension",
  //   autoConnect: false,
  //   extraHeaders: {
  //     'Access-Control-Allow-Origin': 'https://ade.ensea.fr/direct/index.jsp',
  //   }
  // })
  const socket = io('https://enseawebschedule.herokuapp.com', {  // https://enseawebschedule.herokuapp.com
    transports: ['websocket', 'polling', 'flashsocket'],
    secure: true,
    query: "tampermonkey extension",
    autoConnect: false,
    extraHeaders: {
      'Access-Control-Allow-Origin': 'https://ade.ensea.fr/direct/index.jsp',
    },
    enabledTransports: ['ws', 'wss'],
  })
  
  socket.on('connect_error', (err) => {
    console.log(err)
  })
  
  socket.on('packet', (data) => {
    console.log('succesfully emited data')
  })
  
  socket.on("disconnect", () => {
    console.log("disconnected from socket");
  });
  return socket;
}

function delay(time, callback) {
  setTimeout(callback, time);
}

function init() {  // Initial navigation through ADE
  $('#x-auto-16').ready(() => {  // The on('load') and .load(()=>) functions doenst work as well
    const yearSelection = $('#x-auto-16')
    yearSelection.click();
    let okYearButton = document.evaluate('/html/body/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr/td[1]/table/tbody/tr/td[2]/table/tbody/tr[2]/td[2]/em/button', document).iterateNext()
    okYearButton.click();
    console.log('1G1 TP6', $('#x-auto-230 .x-tree3-node-joint'))
    delay(1000, () => {  // Wait 1s
      week11.click();
      // $('#x-auto-230 .x-tree3-node-joint').ready(() => {
      //     const arrowTrainee = $('#x-auto-230 .x-tree3-node-joint');
      //     console.log("dom ready, currently navigating through schedules, clicking :", arrowTrainee)
      //     arrowTrainee.click()
      //     let arrowFirstYear = document.evaluate('/html/body/div[1]/div[1]/div[2]/div[2]/div[2]/div[1]/div/div[1]/div/div[2]/div[1]/div[2]/div/div[1]/table/tbody/tr/td[2]/div/div/div/img[2]', document).iterateNext()
      //     arrowFirstYear.click();
      //     let TD3 = document.evaluate('/html/body/div[1]/div[1]/div[2]/div[2]/div[2]/div[1]/div/div[1]/div/div[2]/div[1]/div[2]/div/div[5]/table/tbody/tr/td[2]/div/div/div', document).iterateNext();
      //     TD3.click();
      // })
    })
  })
}

const _1G1_TP1 = $("#Direct\\ Planning\\ Tree_430 > div > span.x-tree3-node-text")
const _1G1_TP2 = $("#Direct\\ Planning\\ Tree_431 > div > span.x-tree3-node-text")
const _1G2_TP6 = $("#Direct\\ Planning\\ Tree_642 > div > span.x-tree3-node-text")
const _1G3_TP1 = $("#Direct\\ Planning\\ Tree_454 > div > span.x-tree3-node-text")
const _1G3_TP5 = $("#Direct\\ Planning\\ Tree_573 > div > span.x-tree3-node-text")

const SP_GP2 = $("#Direct\\ Planning\\ Tree_544 > div > span.x-tree3-node-text")
document.querySelector("#Direct\\ Planning\\ Tree_404")


(function scrapingScheduleData() {
  delay(1000, () => {  // Wait 1s instead of waiting for jquery.load()
    init()
    $('document').ready(() => {  // Doesn't really work, elements are not loaded at this point
      document.addEventListener('close', (event) => {
      })
      const week1_ = $("#x-auto-174 > tbody > tr:nth-child(2) > td.x-btn-mc > em > button")
      const week11 = $("#x-auto-184 > tbody > tr:nth-child(2) > td.x-btn-mc > em > button")
      const week12 = $("#x-auto-185 > tbody > tr:nth-child(2) > td.x-btn-mc > em > button")
      const week47 = $("#x-auto-220 > tbody > tr:nth-child(2) > td.x-btn-mc > em > button")  // Hope that makes it clear, this is the plan :)

      //must wait for user to be ready on a schedule
      let coursesData = "";
      for (let i = 174; i <= 220; i++) {  // yep !
        const weekButton = $("#x-auto-"+i+" > tbody > tr:nth-child(2) > td.x-btn-mc > em > button")
        weekButton.click()
        const weekID = i - 174;  // The weekIDth week of the year
        const monday = $("#x-auto-162 > tbody > tr:nth-child(2) > td.x-btn-mc > em > button")
        const friday = $("#x-auto-166 > tbody > tr:nth-child(2) > td.x-btn-mc > em > button")
        let weekCoursesData = "";
        for (let j = 162; i <= 166; i++) {
          const dayButton = $('#x-auto-'+i+' > tbody > tr:nth-child(2) > td.x-btn-mc > em > button')
          dayButton.click()
          const dayID = i - 162;  // monday:0 friday:4
          let courseIndex = 0;
          let dayCoursesData = ""
          while (courseIndex != -1) {
            courseIndex++;
            courseData = getCourseData(courseIndex);  // Getting course data
            if (courseData != null) {
              courseData = courseData.replaceAll(' null ', ',,') // in aria label, <br> elements are null
              scheduleID = courseData.split(',,')[1]  // Id of the course (the course classe)
              dayCoursesData += ";; " + scheduleID + ";;" + courseData  // Separator of the courses of the same day
            } else {
              courseIndex = -1;
            }
          }
          weekCoursesData += ';-;' + dayIndex + ';-;' + dayCoursesData; // Separator for different days of the same week
        }
        coursesData += weekCoursesData;
      }

      document.body.addEventListener('click', (event) => {
        getCourseData(0, (initialPosition, firstCourseData, err) => { // Get the data of the first course displayed in the week (usually on monday)
          if (!err) { // Verifying if the scraped data are from the schedule page and not anything else
            // We do the rest (create an interface and send informations to the server)
            let data = [firstCourseData],
              courseIndex = 1 // index of xth lesson of the week
            let dayIndex = -1
            while (true) { // Get the rest of the course of the week
              getCourseData(courseIndex, (courseLeftPosition, ndata, err) => {
                if (!err) {  // It seems courses data are seperated with <br> html element which are 'null' inside the aria label prop
                  ndata = ndata.replaceAll(' null ', ',,') // Theses are parsers regex split :)
                  scheduleID = ndata.split(',,')[1]
                  console.log(courseLeftPosition, '/', DAY_SIZE)
                  if (courseLeftPosition % DAY_SIZE == 0) {  // If the lesson left pos is a multiple of tuesday left pos (should be the begining of another day)
                  } else {
                    
                  }
                }
              });
              if (courseIndex > data.length - 1) { // to avoid infinit loop when we got all the data
                data = 'uwu-ade-weekly-shcedule//' + String(data)
                console.log(data)
                console.log('data succesfully retrieved. sending...')
                socket.connect()
                socket.on("connect", () => {
                  console.log('connected to socket { %s }', socket.id); // x8WIv7-mJelg7on_ALbx
                  const engine = socket.io.engine;
                  engine.on("packet", (packet) => {
                    console.log('packet received/sent : ', packet)
                  })
                  socket.emit(data)
                  socket.disconnect()
                });
                return;
              }
              courseIndex++
            }
          }
        })
      }, true);
    })
  })
})();
/* 
uwu-ade-weekly-shcedule// TD BE Physique null 1G1 TD1 null DUPREY Quentin null A204 null 08h00 - 10h00,;-;NaN/1G1 TD1;-; TD BE Physique,,1G1 TD1,,DUPREY Quentin,,A204,,10h00 - 12h00,;-;NaN/1G1 TP1;-; TP Electronique Numérique,,1G1 TP1,,JOSSE Christian,,C303,,13h30 - 17h30,;-;NaN/1G1 TP2;-; TP Electronique Numérique,,1G1 TP2,,GERALDO Frédéric,,C304,,13h30 - 17h30,;-;NaN/1G1 TD2;-; TD BE Physique,,1G1 TD2,,FAYE Christian,,A201,,08h00 - 10h00,;-;NaN/1G1 TD2;-; TD BE Physique,,1G1 TD2,,FAYE Christian,,A201,,10h00 - 12h00,;-;NaN/1G1 TP4;-; TP Systèmes Electroniques,,1G1 TP4,,LAROCHE Christian,,C203,,13h30 - 17h30,;-;NaN/1G1 TD3;-; TD BE Physique,,1G1 TD3,,BOURDEL Emmanuelle,,A212,,08h00 - 10h00,;-;NaN/1G1 TD3;-; TD BE Physique,,1G1 TD3,,BOURDEL Emmanuelle,,A212,,10h00 - 12h00,;-;NaN/1G1 TP5;-; TP Systèmes Electroniques,,1G1 TP5,,QUINTANEL Sébastien,,C204,,13h30 - 17h30,;-;NaN/1G1 TP6;-; TP Systèmes Electroniques,,1G1 TP6,,DUPERRIER Cédric,,C205,,13h30 - 17h30,;-;NaN/1G2 TP1;-; TP Electronique Numérique,,1G2 TP1,,LAROCHE Christian,,C303,,08h00 - 12h00,;-;NaN/1G2 TD1;-; TD Probabilité 1A,,1G2 TD1,,AUGIER Adeline,,A201,,13h30 - 15h30,;-;NaN/1G2 TP2;-; TP Electronique Numérique,,1G2 TP2,,FIACK Laurent,,C304,,08h00 - 12h00,;-;NaN/1G2 TP3;-; TP Electronique Numérique,,1G2 TP3,,GERALDO Frédéric,,C305,,08h00 - 12h00,;-;NaN/1G2 TP3;-; TP Mathématiques 1A,,1G2 TP3,,HOUAS Heykel,,D065,,13h30 - 17h30,;-;NaN/1G2 TP4;-; TP Systèmes Electroniques,,1G2 TP4,,SABOURAUD-MULLER Carine,,C106,,08h00 - 12h00,;-;NaN/1G2 TP5;-; TP Systèmes Electroniques,,1G2 TP5,,DUPERRIER Cédric,,C204,,08h00 - 12h00,;-;NaN/1G2 TP6;-; TP Systèmes Electroniques,,1G2 TP6,,JOSSE Christian,,C205,,08h00 - 12h00,;-;NaN/1G1 TP3;-; TP Electronique Numérique,,1G1 TP3,,KARABERNOU Si Mahmoud,,C305,,13h30 - 17h30,;-;NaN/1G1 TD3;-; TD Probabilité 1A,,1G1 TD3,,AGGOUNE Woihida,,A110,,13h30 - 15h30,;-;NaN/1G1 TD3;-; TD Electromagnétisme,,1G1 TD3,,FAYE Christian,,A05,,15h30 - 17h30,;-;NaN/1G1 TP6;-; TP Conversion d'énergie en alternatif,,1G1 TP6,,DEL FRANCO Giovanni,,D267,,08h00 - 12h00,;-;NaN/1G2 TD1;-; TD Anglais 1A,,1G2 TD1,,1G2 TD2,,1G2 TD3,,BEDIRA Sami,,FEARON Mel,,TOPCZYNSKI Magalie,,ROMON Emmanuelle,,A206,,A207,,A208,,A209,,08h00 - 10h00,;-;NaN/1G2 TD1;-; TD Analyse complexe,,1G2 TD1,,DUPREY Quentin,,A304,,10h00 - 12h00,;-;NaN/1G2 TD1;-; TD Probabilité 1A,,1G2 TD1,,AUGIER Adeline,,A201,,13h30 - 15h30,;-;NaN/1G2 TD2;-; TD Probabilité 1A,,1G2 TD2,,AGGOUNE Woihida,,A211,,10h00 - 12h00,;-;NaN/1G2 TD2;-; TD Systèmes électroniques,,1G2 TD2,,DUPERRIER Cédric,,A211,,13h30 - 15h30,;-;NaN/1G2 TD2;-; TD Probabilité 1A,,1G2 TD2,,AGGOUNE Woihida,,A110,,15h30 - 17h30,;-;NaN/1G2 TD3;-; TD Systèmes électroniques,,1G2 TD3,,QUINTANEL Sébastien,,A203,,13h30 - 15h30,;-;NaN/1G1 TD1;-; TD Anglais 1A,,1G1 TD1,,1G1 TD2,,1G1 TD3,,BEDIRA Sami,,FEARON Mel,,TOPCZYNSKI Magalie,,ROMON Emmanuelle,,A206,,A207,,A208,,A210,,08h00 - 10h00,;-;NaN/1ère A ENSEA;-; CM Electromagnétisme 1A,,1ère A ENSEA,,TEMCAMANI Farid,,Amphi Watteau,,10h00 - 12h00,;-;NaN/1G1 TD1;-; TD Systèmes électroniques,,1G1 TD1,,DELACRESSONNIÈRE Bruno,,A108,,13h30 - 15h30,;-;NaN/1G1 TD2;-; TD Analyse complexe,,1G1 TD2,,DUPREY Quentin,,A304,,15h30 - 17h30,;-;NaN/1G1 TD3;-; TD Systèmes électroniques,,1G1 TD3,,DUPERRIER Cédric,,A211,,13h30 - 15h30,;-;NaN/1G1 TD3;-; TD Analyse complexe,,1G1 TD3,,SALIBA Charbel,,A112,,15h30 - 17h30,;-;NaN/1G2 TD1;-; TD BE Physique,,1G2 TD1,,BOURDEL Emmanuelle,,A204,,08h00 - 10h00,;-;NaN/1G2 TD1;-; TD BE Physique,,1G2 TD1,,BOURDEL Emmanuelle,,A204,,15h30 - 17h30,;-;NaN/1G2 TD2;-; TD BE Physique,,1G2 TD2,,FAYE Christian,,A205,,08h00 - 10h00,;-;NaN/1G2 TD2;-; TD BE Physique,,1G2 TD2,,FAYE Christian,,A205,,15h30 - 17h30,;-;NaN/1G2 TD3;-; TD BE Physique,,1G2 TD3,,TEMCAMANI Farid,,A201,,08h00 - 10h00,;-;NaN/1G2 TD3;-; TD Analyse complexe,,1G2 TD3,,DUPREY Quentin,,A109,,13h30 - 15h30,;-;NaN/1G2 TD3;-; TD BE Physique,,1G2 TD3,,TEMCAMANI Farid,,A210,,15h30 - 17h30,;-;NaN/1ère A ENSEA;-; CM Analyse complexe,,1ère A ENSEA,,DUPREY Quentin,,Amphi Watteau,,08h00 - 10h00,;-;NaN/1G1 TD1;-; TD Analyse complexe,,1G1 TD1,,DUPREY Quentin,,A108,,10h00 - 12h00,;-;NaN/1ère A ENSEA;-; CM Quantique 1A,,1ère A ENSEA,,DUPREY Quentin,,Amphi Watteau,,08h00 - 10h00,;-;NaN/1G1 TD1;-; TD Systèmes électroniques,,1G1 TD1,,DELACRESSONNIÈRE Bruno,,A108,,10h00 - 12h00,;-;NaN/1G1 TD1;-; TD Allemand / Espagnol 1A,,1G1 TD1,,1G1 TD2,,1G1 TD3,,PAAPE Iris,,FLINT LUH Stéphanie,,CHIPI Eneko,,GALDEANO Jean-François,,MARINAS Ruth,,A105,,A107,,A106,,A208,,A209,,13h30 - 15h30,;-;NaN/1G1 TD2;-; TD Systèmes électroniques,,1G1 TD2,,LAROCHE Christian,,A212,,10h00 - 12h00,;-;NaN/1G1 TD2;-; TD Systèmes électroniques,,1G1 TD2,,LAROCHE Christian,,A08,,15h30 - 17h30,;-;NaN/1G1 TD3;-; TD Systèmes électroniques,,1G1 TD3,,DUPERRIER Cédric,,A111,,10h00 - 12h00,;-;NaN/1G2 TD1;-; TD Systèmes électroniques,,1G2 TD1,,SABOURAUD-MULLER Carine,,A07,,10h00 - 12h00,;-;NaN/1G2 TD1;-; TD Systèmes électroniques,,1G2 TD1,,SABOURAUD-MULLER Carine,,A08,,13h30 - 15h30,;-;NaN/1G2 TD1;-; TD Allemand / Espagnol 1A,,1G2 TD1,,1G2 TD2,,1G2 TD3,,PAAPE Iris,,FLINT LUH Stéphanie,,CHIPI Eneko,,GALDEANO Jean-François,,MARINAS Ruth,,A105,,A107,,A106,,A208,,A209,,15h30 - 17h30,;-;NaN/1G2 TD3;-; TD Systèmes électroniques,,1G2 TD3,,QUINTANEL Sébastien,,A112,,10h00 - 12h00,;-;NaN/1G2 TD3;-; TD Probabilité 1A,,1G2 TD3,,AGGOUNE Woihida,,A201,,13h30 - 15h30
*/
// (function(window) {
//     var last = +new Date();
//     var delay = 100; // default delay

//     // Manage event queue
//     var stack = [];

//     function callback() {
//         var now = +new Date();
//         if (now - last > delay) {
//             for (var i = 0; i < stack.length; i++) {
//                 stack[i]();
//             }
//             last = now;
//         }
//     }

//     // Public interface
//     var onDomChange = function(fn, newdelay) {
//         if (newdelay) delay = newdelay;
//         stack.push(fn);
//     };

//     // Naive approach for compatibility
//     function naive() {

//         var last = document.getElementsByTagName('*');
//         var lastlen = last.length;
//         var timer = setTimeout(function check() {

//             // get current state of the document
//             var current = document.getElementsByTagName('*');
//             var len = current.length;

//             // if the length is different
//             // it's fairly obvious
//             if (len != lastlen) {
//                 // just make sure the loop finishes early
//                 last = [];
//             }

//             // go check every element in order
//             for (var i = 0; i < len; i++) {
//                 if (current[i] !== last[i]) {
//                     callback();
//                     last = current;
//                     lastlen = len;
//                     break;
//                 }
//             }

//             // over, and over, and over again
//             setTimeout(check, delay);

//         }, delay);
//     }

//     //
//     //  Check for mutation events support
//     //

//     var support = {};

//     var el = document.documentElement;
//     var remain = 3;

//     // callback for the tests
//     function decide() {
//         if (support.DOMNodeInserted) {
//             window.addEventListener("DOMContentLoaded", function() {
//                 if (support.DOMSubtreeModified) { // for FF 3+, Chrome
//                     el.addEventListener('DOMSubtreeModified', callback, false);
//                 } else { // for FF 2, Safari, Opera 9.6+
//                     el.addEventListener('DOMNodeInserted', callback, false);
//                     el.addEventListener('DOMNodeRemoved', callback, false);
//                 }
//             }, false);
//         } else if (document.onpropertychange) { // for IE 5.5+
//             document.onpropertychange = callback;
//         } else { // fallback
//             naive();
//         }
//     }

//     // checks a particular event
//     function test(event) {
//         el.addEventListener(event, function fn() {
//             support[event] = true;
//             el.removeEventListener(event, fn, false);
//             if (--remain === 0) decide();
//         }, false);
//     }

//     // attach test events
//     if (window.addEventListener) {
//         test('DOMSubtreeModified');
//         test('DOMNodeInserted');
//         test('DOMNodeRemoved');
//     } else {
//         decide();
//     }

//     // do the dummy test
//     var dummy = document.createElement("div");
//     el.appendChild(dummy);
//     el.removeChild(dummy);

//     // expose
//     window.onDomChange = onDomChange;
// })(window);