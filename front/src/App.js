import React, { Component }  from 'react';
import './App.css';
import WeekSchedule from "./DayCarousel";

function App() {
  const weekData = [ {day: 'monday', courses: [ { name: 'Syslin', begin: '8h', end: '10h', } ]},
      { day: 'tuesday', courses: [ {name: 'Syslin', begin: '8h', end: '10h', teachers: 'M. Jebri', classes: '1G1 TD3', place: 'A211'}, {name: 'Syselec', begin: '10h', end: '12h', teachers: 'M. Jebri', classes: '1G1 TD3', place: 'A211'}, {name: 'Syslin', begin: '13h30', end: '15h30', teachers: 'M. Jebri', classes: '1G1 TD3', place: 'A211'}, {name: 'Syslin', begin: '15h30', end: '17h30', teachers: 'M. Jebri', classes: '1G1 TD3', place: 'A211'}, {name: 'Syslin', begin: '17h30', end: '20h', teachers: 'M. Jebri', classes: '1G1 TD3', place: 'A211'} ]},
      { day: 'wednesday', courses: [ {name: 'Syslin', begin: '8h', end: '10h', teachers: 'M. Jebri', classes: '1G1 TD3', place: 'A211'} ]},
      { day: 'thursday', courses: [ {name: 'Syslin', begin: '8h', end: '10h', teachers: 'M. Jebri', classes: '1G1 TD3', place: 'A211'} ]},
      { day: 'friday', courses: [ {name: 'Syslin', begin: '8h', end: '10h', teachers: 'M. Jebri', classes: '1G1 TD3', place: 'A211'} ]},
  ];
  return (
    <div className="App">
      <div className="background blur-small bg-cover bg-center h-screen w-screen"></div>
      <header className=" w-full h-full App-header -translate-x-1/2 absolute left-1/2 top-0 flex-col items-center justify-top">
        <img className="m-2 w-12 h-12 rounded-full bg-black" alt=""></img>
        <div id="sliders" className=" font backdrop-blur-small w-3/4 h-12 flex-col align-center justify-center rounded-xl">
          <div className=" w-full h-full bg-white rounded-xl opacity-75">Syslin
            <div className=" mx-2 h-1/2 text-gray-800 justify-center align-center text-center">
              <h4>1G1 TD3</h4>
            </div>
            <hr></hr>
            <div className=" mx-2 h-1/2 text-gray-800 justify-center align-center text-center">
              <h4>Semaine 9</h4>
            </div>
          </div>
        </div>
        <WeekSchedule weekData={weekData}/>
      </header>
    </div>
  );
}

export default App;
