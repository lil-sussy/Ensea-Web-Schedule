import { useState, useEffect, useMemo } from 'react';
import React from 'react';
import WeekDaySwiper from '../components/ews/home/DaySwiper';
import nextSession from "next-session"
import Head from 'next/head'
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { firebase, database } from '../components/ews/lib/firebaseConfig';
import background from '../public/background2k.png'
import logo from '../public/logo.png'
import WeekSelectionSwiper from '../components/ews/home/WeekSelectionSlider'

import { getWeekID } from '../components/ews/lib/schoolYear'
import SearchBar from '../components/ews/home/SearchEngine';
// import CAS from '../lib/node-cas/lib/cas';
import { hasCookie, setCookie, getCookie } from 'cookies-next';
import { getPageStaticInfo } from 'next/dist/build/analysis/get-page-static-info';
import Image from 'next/image';

const DEFAULT_SCHEDULE = "1G1 TP6";


export async function getStaticProps(req, res) {
  // const cas = new CAS({
    //   base_url         : 'https://identites.ensea.fr/cas/login',
    //   service     : 'https://ews.ensea.jsp.fr',
  //   version     : '3.0',
  //   renew           : false,
  //   is_dev_mode     : true,
  //   dev_mode_user   : '',
  //   dev_mode_info   : {},
  //   session_name    : 'cas_user',
  //   session_info    : 'cas_userinfo',
  //   destroy_session : false,
  //   return_to       : 'http://localhost:300/'
  // })
  // cas.authenticate(req, res, function(err, status, username, extended) {
    //   if (err) {
      //     // Handle the error
      //     res.send({error: err});
      //   } else {
        //     // Log the user in 
        //     console.log(username);
        //     res.send({status: status, username: username, attributes: extended.attributes});
        //   }
  // });    
  return {
    props: {}
  }
}

export default function ewsIndex(pageProps) {
  return (
    <React.StrictMode>
      <Head>
        <title>Ensea Web Schedule</title>
        <meta name="description" content="Ensea Web Schedule" />
        <meta property="og:title" content="Ensea Web Schedule" key="title" />
      </Head>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <BackgroundENSEA />
        <AppContainer>
          <AthenaHeader />
          <App {...pageProps} />
        </AppContainer>
      </>
    </React.StrictMode>
  );
}

function App({ views }) {
  const lastSchedule = getCookie('lastSchedule')
  const [isMounted, setIsMounted] = useState(false);  // Server side rendering and traditional rendering
  const [currentWeek, setCurrentWeek] = useState(1)
  const [schedule, setSchedule] = useState(lastSchedule)
  const setScheduleAndSave = (schedule) => {
    setCookie('lastSchedule', schedule, {
      expires: new Date(new Date().getTime() + 1000*60*60*24*62),  // 62 days,
      sameSite: true
    })
    setSchedule(schedule)
  }
  useEffect(() => {
    setIsMounted(true);
    setCurrentWeek(getWeekID(new Date()))  // the first weekID is set to be today's week
  }, [])
  if (!isMounted) {
    return null;
  }
  return (
    <>
      <SearchBar schedule={schedule} setSchedule={setScheduleAndSave} className='SelectionsContainer relative from-main-orange 
      to-main-orange-light bg-gradient-to-r h-20 w-full flex-col align-center justify-center'/>
      <WeekSelectionSwiper setWeek={setCurrentWeek} weekID={currentWeek} />
      <div className="WeekScheduleContainer w-full h-[69%]">
        {
          schedule ? 
            <WeekDaySwiper schedule={schedule} currentWeek={currentWeek} />
          :
            <GetStarted/>
        }
      </div>
    </>
  );
}

function GetStarted() {
  return (
    <div>
      
    </div>
  )
}

function BackgroundENSEA() {
  return (
    <div className="BackgroundENSEA bg-cover h-screen w-screen transition
    blur-[2px] "
      style={{ backgroundImage: ('url(' + background.src + ')') }}>
      <div className="w-full h-full bg-opacity-30 bg-white"></div>
    </div>
  )
}

function AppContainer(props) {
  return (
    <div className="AppContainer text-zinc-800 w-full h-full
      -translate-x-1/2 absolute left-1/2 top-0">
      {props.children}
    </div>
  )
}

function AthenaHeader() {
  return (
    <div className="Header relative w-full top-0 left-0 backdrop-blur-sm">
      <div className="z-20 w-full mx-auto bg-white bg-opacity-[70%]">
        <div className="BurgerMenuContainer absolute top-0 left:0 mx-2 
      h-full w-10 flex-row flex justify-center items-center">
          <div className="BurgerMenu w-6 h-8 flex justify-evenly 
        items-center flex-col">
            <div className="w-6 h-0.5 rounded-full bg-main-orange"></div>
            <div className="w-6 h-0.5 rounded-full bg-main-orange"></div>
            <div className="w-6 h-0.5 rounded-full bg-main-orange"></div>
            <div className="w-6 h-0.5 rounded-full bg-main-orange"></div>
          </div>
        </div>
        <div className="h-full w-full py-1 pb-1">
          <img src={logo.src}
            alt="Logo of projet Athena"
            className="Logo bg-local bg-cover shadow-0 my-auto w-60 mx-auto"></img>
        </div>
      </div>
    </div>
  )
}

// Redirecting in nextjs :

// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export function middleware(request: NextRequest) {   
//   const url = request.nextUrl.clone()   
//   if (url.pathname === '/') {
//     url.pathname = '/hello-nextjs'
//     return NextResponse.redirect(url)   
//   } 
// }