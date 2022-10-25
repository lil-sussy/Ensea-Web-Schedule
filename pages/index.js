import { useState, useEffect } from 'react';
import React from 'react';
import WeekSchedule from '../components/DaySwiper';
import nextSession from "next-session"
import loadSchedule from '../components/LoadScheduleData';
import io from 'socket.io-client'
import Head from 'next/head'
import { promisifyStore } from 'next-session/lib/compat';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { app, database } from '../components/firebaseConfig';

import loadScheduleDataFromString from '../components/LoadScheduleData'

let socket  // Unused

function App({ views, weekData }) {
  console.log('you have visited this website : ', views)
  const [isMounted, setIsMounted] = useState(false);  // Server side rendering and traditional rendering
  const socketInitializer = async () => {
    await fetch('/api/socket')
    socket = io()
    
    socket.on('connect', () => {
      console.log('connected')
    })
  }
  useEffect(() => {
    setIsMounted(true);
    socketInitializer()
  }, [])
  
  if (!isMounted) {
    return null;
  }
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
          <WeekSchedule weekData={weekData} />
        </div>
      </header>
    </div>
  );
}

const DEFAULT_SCHEDULE = "1G1 TP6";

indexPage.getInitialProps = async ({ req, res }) => {  // Generate props on server side
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