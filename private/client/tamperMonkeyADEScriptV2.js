// ==UserScript==
// @name         ADE Scraper UwU
// @version      0.3
// @description  ADE onlinhe schedule data scrapper
// @author       Nya UwU
// @grant        GM_addStyle
// @require      https://cdn.socket.io/4.5.3/socket.io.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.js
// @match         https://ade.ensea.fr/direct/index.jsp*
//
// ==/UserScript==

// const socket = io('https://enseawebschedule.herokuapp.com', { secure: true, extraHeaders: { 'Access-Control-Allow-Origin': 'https://enseawebschedule.herokuapp.com/' } })

/*
Known issues
  Do not use a small screen
  Do not have a slow internet connection
*/

const SIDE_BAR_SIZE = 1 + 45 // Size of the hour displaying sidebar wich is constant and used in absolute position calculs
const TIME_INTERVAL = 300

function delay(time, callback) {
  setTimeout(callback, time);
}

function init() {  // Initial navigation through ADE
  //Bellow script unusable since it's no longer possible to click on '2022/2023' button !!! Since end of october 2022 pls kill me

  // $('#x-auto-16').ready(() => {  // The on('load') and .load(()=>) functions doenst work as well
  //   yearSelection.click(); 
  //   const yearSelection = $('#x-auto-16')
  //   let okYearButton = document.evaluate('/html/body/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr/td[1]/table/tbody/tr/td[2]/table/tbody/tr[2]/td[2]/em/button', document).iterateNext()
  //   okYearButton.click();
  //   delay(1000, () => {  // Wait 1s
  //     const week11 = $("#x-auto-184 > tbody > tr:nth-child(2) > td.x-btn-mc > em > button")
  //     week11.click();
  //     // $('#x-auto-230 .x-tree3-node-joint').ready(() => {
  //     //     const arrowTrainee = $('#x-auto-230 .x-tree3-node-joint');
  //     //     console.log("dom ready, currently navigating through schedules, clicking :", arrowTrainee)
  //     //     arrowTrainee.click()
  //     //     let arrowFirstYear = document.evaluate('/html/body/div[1]/div[1]/div[2]/div[2]/div[2]/div[1]/div/div[1]/div/div[2]/div[1]/div[2]/div/div[1]/table/tbody/tr/td[2]/div/div/div/img[2]', document).iterateNext()
  //     //     arrowFirstYear.click();
  //     //     let TD3 = document.evaluate('/html/body/div[1]/div[1]/div[2]/div[2]/div[2]/div[1]/div/div[1]/div/div[2]/div[1]/div[2]/div/div[5]/table/tbody/tr/td[2]/div/div/div', document).iterateNext();
  //     //     TD3.click();
  //     // })
  //   })
  // })
}

function settingupInterface() {
  const htmlButton = '\
          <div id="scrapper-interface" class="button-back" style = "position: absolute; left:0px; top:0px; \
            width: 150px; height: 250px; border-radius: 20px; display: flex; border-radius: 10px; \
            flex-flow: column wrap; flex-direction: column; justify-content: center; \
            align-items: center; background: #61aaff; text-align: center; \
            codlor: #61dafb; z-index: 10;\
            color: white;"> \
            <button id="scrapper-start" class="start-button" style="margin-left: 0px; \
              color: black; \
              border: black; \
              background : #61dafb; \
              border-radius: 10px; \
              width: 100px; \
              height: 40px;"> \
              fetch data \
            </button> \
            <h3 id="scrapper-state" style="height: 10px; \
            flex-grow: 2; "> \
              To start, please select a schedule and hit fetch data. \
            </h3> \
          </div>'
  $('body').append(htmlButton);
}
/*
const _1G1_TP1 = $("#Direct\\ Planning\\ Tree_430 > div > span.x-tree3-node-text")
const _1G1_TP2 = $("#Direct\\ Planning\\ Tree_431 > div > span.x-tree3-node-text")
const _1G2_TP6 = $("#Direct\\ Planning\\ Tree_642 > div > span.x-tree3-node-text")
const _1G3_TP1 = $("#Direct\\ Planning\\ Tree_454 > div > span.x-tree3-node-text")
const _1G3_TP5 = $("#Direct\\ Planning\\ Tree_573 > div > span.x-tree3-node-text")
const SP_GP2 = $("#Direct\\ Planning\\ Tree_544 > div > span.x-tree3-node-text")
*/

function getCourseData(number) { // return the data of the {number} courses of the week
  const course = $('#inner' + number)[0] // the numberth element (course) in the displayed schedule
  if (course == undefined || course == null || course.getAttribute('aria-label') == undefined) {
    return null;
  }
  console.log('test')
  let data = course.getAttribute('aria-label').split(' null '); // the arialabel of the div containing schedule lesson info contains the informations of its children (everything to know about this course)
  if (data.length == 0)
    return null;
  data = course.getAttribute('aria-label').split(' null ') // We only needed to see if the data was in the correct format but the entire string is sent as data
  return data;
}

async function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

(function scrapingScheduleData() {
  delay(2000, () => {  // Wait 1s instead of waiting for jquery.load()
    $('document').ready(() => {  // Doesn't really work, elements are not loaded at this point
      init();
      document.addEventListener('close', (event) => {
      })
      //must wait for user to be ready on a schedule
      delay(1000, () => {
        settingupInterface()
        $('#scrapper-start').ready(() => {
          const div = $('#scrapper-interface')  // our div
          const scrapperStart = $('#scrapper-start')[0];  // our button
          const scrapperState = $('#scrapper-state')[0];  // For some reasons this time jquery retourns an array :)
          const week1_ = $("#x-auto-174 > tbody > tr:nth-child(2) > td.x-btn-mc > em > button")
          const week11 = $("#x-auto-184 > tbody > tr:nth-child(2) > td.x-btn-mc > em > button")
          const week12 = $("#x-auto-185 > tbody > tr:nth-child(2) > td.x-btn-mc > em > button")
          const week47 = $("#x-auto-220 > tbody > tr:nth-child(2) > td.x-btn-mc > em > button")  // Hope that makes it clear, this is the plan :)

          console.log(scrapperState)
          const coursesData = { weeks: [] };
          scrapperStart.addEventListener('click', async () => {
            console.log("fetching data...")
            scrapperState.innerHTML = "please wait...";
            for (let week = 174; week <= 220; week++) {  // yep !
              const weekButton = $("#x-auto-" + week + " > tbody > tr:nth-child(2) > td.x-btn-mc > em > button")
              weekButton.click()
              const weekID = week - 174;  // The weekIDth week of the year
              const monday = $("#x-auto-162 > tbody > tr:nth-child(2) > td.x-btn-mc > em > button")
              const friday = $("#x-auto-166 > tbody > tr:nth-child(2) > td.x-btn-mc > em > button")
              const weekCoursesData = { weekID: weekID + 1, days: [] };  // Index 0 being first week (week1)
              for (let day = 162; day <= 166; day++) {
                const dayButton = $('#x-auto-' + day + ' > tbody > tr:nth-child(2) > td.x-btn-mc > em > button')
                dayButton.click()
                const dayID = day - 162;  // monday:0 friday:4
                let courseIndex = 0;
                const test = await sleep(TIME_INTERVAL);
                const dayCoursesData = { dayID: dayID, courses: [] }
                while (courseIndex != -1) {  // Fetching until there is no course left
                  courseIndex++;
                  let courseData = getCourseData(courseIndex);  // Getting course data
                  if (courseData != null) {
                    const courseDataSaved = {
                      name: courseData[0],
                      weekID: weekID + 1,
                      dayID: dayID,
                      data: []
                    }
                    for (let i = 0; i < courseData.length; i++) {
                      courseDataSaved.data.push(courseData[i])
                    }
                    dayCoursesData.courses.push(courseDataSaved)
                  } else {
                    courseIndex = -1;
                  }
                }
                weekCoursesData.days.push(dayCoursesData)
              }
              console.log('>====================================<');
              console.log('Sending data of week %s ', weekID+1);
              $.post('http://localhost:3000/api/schedules', JSON.stringify(weekCoursesData), (data, status) => {
                console.log('Data of week %s succesfully sent', weekID+1);
                console.log('<====================================>');
              })
              coursesData.weeks.push(weekCoursesData)
            }
            scrapperState.innerHTML = "ready";
            console.log('Year data succesfully retrieved.')
            // $.ajax({
            //   type: "POST",
            //   url: 'http://localhost:3000/api/schedules',
            //   headers: { 'Access-Control-Allow-Origin': 'https://ade.ensea.fr/direct/index.jsp' },  // Required or it will be blocked by chrome
            //   data: coursesData,
            // });
          });
        });  // Delay 200ms
      })  // Wait 500ms
    })
  })
})();
/* 
uwu-ade-weekly-shcedule// TD BE Physique null 1G1 TD1 null DUPREY Quentin null A204 null 08h00 - 10h00,;-;NaN/1G1 TD1;-; TD BE Physique,,1G1 TD1,,DUPREY Quentin,,A204,,10h00 - 12h00,;-;NaN/1G1 TP1;-; TP Electronique Numérique,,1G1 TP1,,JOSSE Christian,,C303,,13h30 - 17h30,;-;NaN/1G1 TP2;-; TP Electronique Numérique,,1G1 TP2,,GERALDO Frédéric,,C304,,13h30 - 17h30,;-;NaN/1G1 TD2;-; TD BE Physique,,1G1 TD2,,FAYE Christian,,A201,,08h00 - 10h00,;-;NaN/1G1 TD2;-; TD BE Physique,,1G1 TD2,,FAYE Christian,,A201,,10h00 - 12h00,;-;NaN/1G1 TP4;-; TP Systèmes Electroniques,,1G1 TP4,,LAROCHE Christian,,C203,,13h30 - 17h30,;-;NaN/1G1 TD3;-; TD BE Physique,,1G1 TD3,,BOURDEL Emmanuelle,,A212,,08h00 - 10h00,;-;NaN/1G1 TD3;-; TD BE Physique,,1G1 TD3,,BOURDEL Emmanuelle,,A212,,10h00 - 12h00,;-;NaN/1G1 TP5;-; TP Systèmes Electroniques,,1G1 TP5,,QUINTANEL Sébastien,,C204,,13h30 - 17h30,;-;NaN/1G1 TP6;-; TP Systèmes Electroniques,,1G1 TP6,,DUPERRIER Cédric,,C205,,13h30 - 17h30,;-;NaN/1G2 TP1;-; TP Electronique Numérique,,1G2 TP1,,LAROCHE Christian,,C303,,08h00 - 12h00,;-;NaN/1G2 TD1;-; TD Probabilité 1A,,1G2 TD1,,AUGIER Adeline,,A201,,13h30 - 15h30,;-;NaN/1G2 TP2;-; TP Electronique Numérique,,1G2 TP2,,FIACK Laurent,,C304,,08h00 - 12h00,;-;NaN/1G2 TP3;-; TP Electronique Numérique,,1G2 TP3,,GERALDO Frédéric,,C305,,08h00 - 12h00,;-;NaN/1G2 TP3;-; TP Mathématiques 1A,,1G2 TP3,,HOUAS Heykel,,D065,,13h30 - 17h30,;-;NaN/1G2 TP4;-; TP Systèmes Electroniques,,1G2 TP4,,SABOURAUD-MULLER Carine,,C106,,08h00 - 12h00,;-;NaN/1G2 TP5;-; TP Systèmes Electroniques,,1G2 TP5,,DUPERRIER Cédric,,C204,,08h00 - 12h00,;-;NaN/1G2 TP6;-; TP Systèmes Electroniques,,1G2 TP6,,JOSSE Christian,,C205,,08h00 - 12h00,;-;NaN/1G1 TP3;-; TP Electronique Numérique,,1G1 TP3,,KARABERNOU Si Mahmoud,,C305,,13h30 - 17h30,;-;NaN/1G1 TD3;-; TD Probabilité 1A,,1G1 TD3,,AGGOUNE Woihida,,A110,,13h30 - 15h30,;-;NaN/1G1 TD3;-; TD Electromagnétisme,,1G1 TD3,,FAYE Christian,,A05,,15h30 - 17h30,;-;NaN/1G1 TP6;-; TP Conversion d'énergie en alternatif,,1G1 TP6,,DEL FRANCO Giovanni,,D267,,08h00 - 12h00,;-;NaN/1G2 TD1;-; TD Anglais 1A,,1G2 TD1,,1G2 TD2,,1G2 TD3,,BEDIRA Sami,,FEARON Mel,,TOPCZYNSKI Magalie,,ROMON Emmanuelle,,A206,,A207,,A208,,A209,,08h00 - 10h00,;-;NaN/1G2 TD1;-; TD Analyse complexe,,1G2 TD1,,DUPREY Quentin,,A304,,10h00 - 12h00,;-;NaN/1G2 TD1;-; TD Probabilité 1A,,1G2 TD1,,AUGIER Adeline,,A201,,13h30 - 15h30,;-;NaN/1G2 TD2;-; TD Probabilité 1A,,1G2 TD2,,AGGOUNE Woihida,,A211,,10h00 - 12h00,;-;NaN/1G2 TD2;-; TD Systèmes électroniques,,1G2 TD2,,DUPERRIER Cédric,,A211,,13h30 - 15h30,;-;NaN/1G2 TD2;-; TD Probabilité 1A,,1G2 TD2,,AGGOUNE Woihida,,A110,,15h30 - 17h30,;-;NaN/1G2 TD3;-; TD Systèmes électroniques,,1G2 TD3,,QUINTANEL Sébastien,,A203,,13h30 - 15h30,;-;NaN/1G1 TD1;-; TD Anglais 1A,,1G1 TD1,,1G1 TD2,,1G1 TD3,,BEDIRA Sami,,FEARON Mel,,TOPCZYNSKI Magalie,,ROMON Emmanuelle,,A206,,A207,,A208,,A210,,08h00 - 10h00,;-;NaN/1ère A ENSEA;-; CM Electromagnétisme 1A,,1ère A ENSEA,,TEMCAMANI Farid,,Amphi Watteau,,10h00 - 12h00,;-;NaN/1G1 TD1;-; TD Systèmes électroniques,,1G1 TD1,,DELACRESSONNIÈRE Bruno,,A108,,13h30 - 15h30,;-;NaN/1G1 TD2;-; TD Analyse complexe,,1G1 TD2,,DUPREY Quentin,,A304,,15h30 - 17h30,;-;NaN/1G1 TD3;-; TD Systèmes électroniques,,1G1 TD3,,DUPERRIER Cédric,,A211,,13h30 - 15h30,;-;NaN/1G1 TD3;-; TD Analyse complexe,,1G1 TD3,,SALIBA Charbel,,A112,,15h30 - 17h30,;-;NaN/1G2 TD1;-; TD BE Physique,,1G2 TD1,,BOURDEL Emmanuelle,,A204,,08h00 - 10h00,;-;NaN/1G2 TD1;-; TD BE Physique,,1G2 TD1,,BOURDEL Emmanuelle,,A204,,15h30 - 17h30,;-;NaN/1G2 TD2;-; TD BE Physique,,1G2 TD2,,FAYE Christian,,A205,,08h00 - 10h00,;-;NaN/1G2 TD2;-; TD BE Physique,,1G2 TD2,,FAYE Christian,,A205,,15h30 - 17h30,;-;NaN/1G2 TD3;-; TD BE Physique,,1G2 TD3,,TEMCAMANI Farid,,A201,,08h00 - 10h00,;-;NaN/1G2 TD3;-; TD Analyse complexe,,1G2 TD3,,DUPREY Quentin,,A109,,13h30 - 15h30,;-;NaN/1G2 TD3;-; TD BE Physique,,1G2 TD3,,TEMCAMANI Farid,,A210,,15h30 - 17h30,;-;NaN/1ère A ENSEA;-; CM Analyse complexe,,1ère A ENSEA,,DUPREY Quentin,,Amphi Watteau,,08h00 - 10h00,;-;NaN/1G1 TD1;-; TD Analyse complexe,,1G1 TD1,,DUPREY Quentin,,A108,,10h00 - 12h00,;-;NaN/1ère A ENSEA;-; CM Quantique 1A,,1ère A ENSEA,,DUPREY Quentin,,Amphi Watteau,,08h00 - 10h00,;-;NaN/1G1 TD1;-; TD Systèmes électroniques,,1G1 TD1,,DELACRESSONNIÈRE Bruno,,A108,,10h00 - 12h00,;-;NaN/1G1 TD1;-; TD Allemand / Espagnol 1A,,1G1 TD1,,1G1 TD2,,1G1 TD3,,PAAPE Iris,,FLINT LUH Stéphanie,,CHIPI Eneko,,GALDEANO Jean-François,,MARINAS Ruth,,A105,,A107,,A106,,A208,,A209,,13h30 - 15h30,;-;NaN/1G1 TD2;-; TD Systèmes électroniques,,1G1 TD2,,LAROCHE Christian,,A212,,10h00 - 12h00,;-;NaN/1G1 TD2;-; TD Systèmes électroniques,,1G1 TD2,,LAROCHE Christian,,A08,,15h30 - 17h30,;-;NaN/1G1 TD3;-; TD Systèmes électroniques,,1G1 TD3,,DUPERRIER Cédric,,A111,,10h00 - 12h00,;-;NaN/1G2 TD1;-; TD Systèmes électroniques,,1G2 TD1,,SABOURAUD-MULLER Carine,,A07,,10h00 - 12h00,;-;NaN/1G2 TD1;-; TD Systèmes électroniques,,1G2 TD1,,SABOURAUD-MULLER Carine,,A08,,13h30 - 15h30,;-;NaN/1G2 TD1;-; TD Allemand / Espagnol 1A,,1G2 TD1,,1G2 TD2,,1G2 TD3,,PAAPE Iris,,FLINT LUH Stéphanie,,CHIPI Eneko,,GALDEANO Jean-François,,MARINAS Ruth,,A105,,A107,,A106,,A208,,A209,,15h30 - 17h30,;-;NaN/1G2 TD3;-; TD Systèmes électroniques,,1G2 TD3,,QUINTANEL Sébastien,,A112,,10h00 - 12h00,;-;NaN/1G2 TD3;-; TD Probabilité 1A,,1G2 TD3,,AGGOUNE Woihida,,A201,,13h30 - 15h30
*/
/*
*/