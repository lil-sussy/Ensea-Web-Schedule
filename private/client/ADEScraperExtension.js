// ==UserScript==
// @name         ADE Scraper UwU
// @version      0.3
// @description  ADE onlinhe schedule data scrapper
// @author       Nya UwU
// @grant        GM_addStyle
// @require      https://cdn.socket.io/3.1.3/socket.io.min.js
// @match         https://ade.ensea.fr/direct/index.jsp*
//
// ==/UserScript==

// const socket = io('https://enseawebschedule.herokuapp.com', { secure: true, extraHeaders: { 'Access-Control-Allow-Origin': 'https://enseawebschedule.herokuapp.com/' } })
const SIDE_BAR_SIZE = 1 + 45 // Size of the hour displaying sidebar wich is constant and used in absolute position calculs

const socket = io('https://enseawebschedule.herokuapp.com', {
    transports: ['websocket', 'polling', 'flashsocket'],
    secure: true,
    extraHeaders: {
        'Access-Control-Allow-Origin': 'https://ade.ensea.fr/direct/index.jsp',
    }
})

socket.on("connect", () => {
    console.log('connected to socket { %s }', socket.id); // x8WIv7-mJelg7on_ALbx
    const engine = socket.io.engine;
    scraping()
});

socket.on("disconnect", () => {
    console.log("disconnected from socket %s", socket.id); // undefined
});


function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function getCourseData(number, callback) { // return the data of the {number} courses of the week
    let xpath = document.evaluate('//*[@id="inner' + String(number) + '"]', document).iterateNext() // selecting the first element (course) in the displayed schedule
    if (xpath == undefined || xpath == null || xpath.getAttribute('aria-label') == undefined) {
        return
    }
    let weekPosition = xpath.parentNode.parentNode.style.left // absolute position in the schedule tab from the left
    let data = xpath.getAttribute('aria-label').split(' null '); // the arialabel of the div containing schedule lesson info contains the informations of its children (everything to know about this course)
    let err = data.length == 0
    data = xpath.getAttribute('aria-label') // We only needed to see if the data was in the correct format but the entire string is sent as data
    callback(weekPosition, data, err)
}

function equalsPercent(a, b, percent) {
    return (a <= (b + b / percent) && a >= (b - b / percent))
}

const scraping = () => {
    let yearPannelPassed = false;
    let done = false;
    document.body.addEventListener('DOMContentLoaded', (event) => {
        console.log(event)
        if (!yearPannelPassed) {
            let yearSelection = document.evaluate('//*[@id="x-auto-16"]', document).iterateNext()
            if (yearSelection == undefined || yearSelection == null || yearSelection.getAttribute('aria-label') == undefined) {
                return
            }
            yearSelection.click();
            let okYearButton = document.evaluate('/html/body/div[2]/div[2]/div[1]/div/div/div/div/div[2]/table/tbody/tr/td[1]/table/tbody/tr/td[2]/table/tbody/tr[2]/td[2]/em/button', document).iterateNext()
            okYearButton.click();
            yearPannelPassed = true;
        } else {
            let arrowTrainee = document.evaluate('/html/body/div[1]/div[1]/div[2]/div[2]/div[2]/div[1]/div/div[1]/div/div[2]/div[1]/div[2]/div/div[1]/table/tbody/tr/td[2]/div/div/div/img[2]', document).iterateNext()
            if (!done && arrowTrainee != undefined && arrowTrainee != null) {
                arrowTrainee.click()
                let arrowFirstYear = document.evaluate('/html/body/div[1]/div[1]/div[2]/div[2]/div[2]/div[1]/div/div[1]/div/div[2]/div[1]/div[2]/div/div[1]/table/tbody/tr/td[2]/div/div/div/img[2]', document).iterateNext()
                arrowFirstYear.click();
                let TD3 = document.evaluate('/html/body/div[1]/div[1]/div[2]/div[2]/div[2]/div[1]/div/div[1]/div/div[2]/div[1]/div[2]/div/div[5]/table/tbody/tr/td[2]/div/div/div', document).iterateNext();
                TD3.click();
            }
        }

    })
    document.body.addEventListener('click', (event) => {
        getCourseData(0, (initialPosition, firstCourseData, err) => { // Get the data of the first course displayed in the week (usually on monday)
            if (!err) { // Verifying if the scraped data are from the schedule page and not anything else
                // We do the rest (create an interface and send informations to the server)
                let data = [firstCourseData],
                    courseIndex = 1 // index of xth lesson of the week
                let dayIndex = -1
                let leftTuesdayPos = document.evaluate('//*[@id="5"]', document).iterateNext().style.left
                leftTuesdayPos = leftTuesdayPos.slice(0, leftTuesdayPos.length - 1) // removing 'px'
                const DAY_SIZE = Number(leftTuesdayPos) - SIDE_BAR_SIZE // The width of a day in the displayed week tab
                while (true) { // Get the rest of the course of the week
                    getCourseData(courseIndex, (nposition, ndata, err) => {
                        if (!err) {
                            ndata = ndata.replaceAll(' null ', ',,') // Theses are parsers regex split :)
                            if (!equalsPercent(nposition, dayIndex * DAY_SIZE, 5)) {
                                dayIndex = nposition / DAY_SIZE;
                                data.push(';-;' + dayIndex + ';-;' + ndata); // Data splitter after the first element
                            } else {
                                data.push(ndata + ";;")
                            }
                        }
                    });
                    if (courseIndex > data.length - 1) { // to avoid infinit loop when we got all the data
                        data = 'uwu-ade-weekly-shcedule//' + String(data)
                        console.log(data)
                        socket.emit(data)
                        console.log('succesfully sent data')
                        return;
                    }
                    courseIndex++
                }
            }
        })
    }, true);
};
/* packet recieved type: message, data: 2["uwu-ade-weekly-shcedule// CM Systèmes électroniques,1ère A ENSEA,DELACRESSONNIÈRE
 Bruno,Amphi Watteau,13h30 - 15h30, TD Analyse de Fourier 1A,1G1 TD3,FAUCARD Bastien,A111,15h30 - 17h30, Amphithéatre scolarité
  (capitalisation : réservé aux redoublants),1ère A ENSEA,1ère B ENSEA,2G1 TD1 (Info / Signal),2G1 TD2 (internationale),2G1 TD3 (Signal /
   Elec),2G2 TD1 (Info/ Elec),2G2 TD2 (Info/ Elec),2G2 TD3 (Info/ Autom),2G3 TD1 (Elec / Autom),2G3 TD2 (Signal / Info),TAUVEL Antoine,Amphi
    Watteau,17h30 - 18h30, TD Systèmes électronique,1G1 TD3,DUPERRIER Cédric,A111,08h00 - 10h00, TD Systèmes linéaires,1G1 TD3,JEBRI Ayoub,A110,
    10h00 - 12h00, CM Langage C,1ère A ENSEA,1ère B ENSEA,TAUVEL Antoine,Amphi Watteau,13h30 - 15h30, CM Electromagnétisme 1A,1ère A ENSEA,
    TEMCAMANI Farid,Amphi Watteau,15h30 - 17h30, TD Anglais 1A S5,1G1 TD1,1G1 TD2,1G1 TD3,BEDIRA Sami,TOPCZYNSKI Magalie,ROMON Emmanuelle,HAOUES
     Faiza,A206,A207,A208,A210,08h00 - 10h00, TDm Langage C,1G1 TD3,RENTON Guillaume,A205,08h00 - 12h00, CM Systèmes linéaires,1ère A ENSEA,
     1ère B ENSEA,DJEMAI Mohamed,Amphi Watteau,08h00 - 10h00, CM Analyse de Fourier,1ère A ENSEA,NICOLAU Florentina,Amphi Watteau,10h00 - 12h00
     , TD Allemand / Espagnol 1A S5,1G1 TD1,1G1 TD2,1G1 TD3,PAAPE Iris,FLINT LUH Stéphanie,CHIPI Eneko,GALDEANO Jean-François,MARINAS Ruth,A105
     ,A107,A106,A208,A209,13h30 - 15h30, TD Systèmes électronique,1G1 TD3,DUPERRIER Cédric,A111,15h30 - 17h30"] */
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