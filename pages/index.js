import { useState, useEffect } from 'react';
import React from 'react';
import WeekSchedule from '../components/DaySwiper';
import nextSession from "next-session"
import Head from 'next/head'
import { promisifyStore } from 'next-session/lib/compat';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { app, database } from '../components/firebaseConfig';
import loadSchedule from '../components/CloudSchedule';
import io from 'socket.io-client'
import Image from 'next/image'
import background from '../public/background2k.png'
import logo from '../public/logo.png'

let socket

function App({ views, schedule }) {
  console.log('you have visited this website : ', views)
  const [isMounted, setIsMounted] = useState(false);  // Server side rendering and traditional rendering
  useEffect(() => {
    setIsMounted(true);
    socketInitializer()
  }, [])
  const socketInitializer = async () => {
    // await fetch('/api/socket')
    // socket = io()

    // socket.on('connect', () => {
    //   console.log('connected')
    // })
  }
  if (!isMounted) {
    return null;
  }
  return (
    <div className="App">
      <div className="ENSEABackground bg-local bg-center h-screen w-screen transition"
        style={{ backgroundImage: ('url(' + background.src + ')') }}
        alt="Picture of the ensea school in Cergy in black and white with hand drawing appearance"></div>
      <header className="AppContainer text-zinc-800 w-full h-full -translate-x-1/2 absolute left-1/2 top-0">
        <div className="Header h-24 w-full top-0 left-0 backdrop-blur-sm">
          <div className="absolute z-0 left-0 top-0 w-full h-full bg-white opacity-75">
            <div className="h-full w-full">
              <img src={logo.src}
              alt="Logo of projet Athena"
              className="Logo shadow-0 h-full w-72 mx-auto"></img>
            </div>
          </div>
        </div>
        <div className="SelectionsContainer h-10 my-3 mx-auto font backdrop-blur-sm w-3/4 flex-col align-center justify-center rounded-xl">
          <div className="ClassSelection text-2xl w-full h-full bg-white rounded-xl opacity-85">
            <div className="ClasseSelectionLabel h-1/2 justify-center align-center text-center">
              <h4>1G1 TD3</h4>
            </div>
          </div>
        </div>
        <div className="SelectionsContainer h-10 my-3 mx-auto font backdrop-blur-sm w-3/4 flex-col align-center justify-center rounded-xl">
          <div className="WeekSelection text-2xl w-full h-full bg-white rounded-xl opacity-75">
            <div className="WeekSelectionLabel h-1/2 justify-center align-center text-center">
              <h4>Semaine 9</h4>
            </div>
          </div>
        </div>
        <div className="WeekScheduleContainer w-full h-2/3">
          <WeekSchedule schedule={schedule} />
        </div>
      </header>
    </div>
  );
}

const DEFAULT_SCHEDULE = "1G1 TP6";

indexPage.getInitialProps = async ({ req, res }) => {  // Generate props on server side
  const sessionCollection = collection(database, 'sessions');
  const schedulesCollection = collection(database, 'schedules');
  const session = nextSession(req, res); // make { autoCommit: false }: false and it will correctly redirect
  session.views = session.views ? session.views + 1 : 1;  // View counter
  session.lastSchedule = session.lastSchedule ? session.lastSchedule : DEFAULT_SCHEDULE;
  const schedule = await loadSchedule(session.lastSchedule)
  return {
    views: session.views,  // Informations passed in App constructor
    schedule: schedule
  };
}

export default function indexPage(pageProps) {
  return (
    <React.StrictMode>
      <Head>
        <title>Ensea Web Schedule</title>
        <meta property="og:title" content="Ensea Web Schedule" key="title" />
      </Head>
      <Head>
        <meta property="og:title" content="EWS2" key="title" />
      </Head>
      <App {...pageProps} />
    </React.StrictMode>
  );
}