import './App.css';
import WeekSchedule from "./DayCarousel";

function App() {
  const weekData = [ { date: '16/10/2022', day: 'lundi', courses: [ { name: 'Systèmes Linéaires', begin: '8h', end: '10h', teachers: 'M.Jebri', classes: '1G1 TD3', place: 'A211' } ]},
      { date: '17/10/2022', day: 'mardi', courses: [ {name: 'Systèmes Linéaires', begin: '8h', end: '10h', teachers: 'M. Jebri', classes: '1G1 TD3', place: 'A211'}, {name: 'Systèmes électroniques', begin: '10h', end: '12h', teachers: 'M. Duperrier', classes: '1G1 TD3', place: 'A211'}, {name: 'Systèmes Linéaires', begin: '13h30', end: '15h30', teachers: 'M. Jebri', classes: '1G1 TD3', place: 'A211'}, {name: 'Systèmes Linéaires', begin: '15h30', end: '17h30', teachers: 'M. Jebri', classes: '1G1 TD3', place: 'A211'}, {name: 'Systèmes Linéaires', begin: '17h30', end: '20h', teachers: 'M. Jebri', classes: '1G1 TD3', place: 'A211'} ]},
      { date: '18/10/2022', day: 'mercredi', courses: [ {name: 'Systèmes Linéaires', begin: '8h', end: '10h', teachers: 'M. Jebri', classes: '1G1 TD3', place: 'A211'} ]},
      { date: '19/10/2022', day: 'jeudi', courses: [ {name: 'Systèmes Linéaires', begin: '8h', end: '10h', teachers: 'M. Jebri', classes: '1G1 TD3', place: 'A211'} ]},
      { date: '20/10/2022',  day: 'vendredi', courses: [ {name: 'Systèmes Linéaires', begin: '8h', end: '10h', teachers: 'M. Jebri', classes: '1G1 TD3', place: 'A211'} ]},
  ];
  return (
    <div className="App">
      <div className="ENSEABackground background bg-cover bg-center h-screen w-screen transition"></div>
      <header className="AppContainer text-zinc-800 w-full h-full App-header -translate-x-1/2 absolute left-1/2 top-0">
        <div className="Logo rounded-full mx-auto my-4 w-20 h-20 shadow-xl" alt=""></div>
        <div className="SelectionsContainer mx-auto font backdrop-blur-sm w-3/4 h-20 flex-col align-center justify-center rounded-xl">
          <div className="Selections text-2xl w-full h-full bg-white rounded-xl opacity-75">
            <div className="ClasseSelection h-1/2 justify-center align-center text-center">
              <h4>1G1 TD3</h4>
            </div>
            <hr></hr>
            <div className="WeekSelection h-1/2 justify-center align-center text-center">
              <h4>Semaine 9</h4>
            </div>
          </div>
        </div>
        <div className="WeekScheduleContainer my-1/20 w-full h-3/4">
          <WeekSchedule weekData={weekData}/>
        </div>
      </header>
    </div>
  );
}

export default App;
