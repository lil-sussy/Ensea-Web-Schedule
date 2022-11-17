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
import Image from 'next/image';
import { NextRequest, NextResponse } from 'next/server'
import { NextRouter, Router, useRouter } from 'next/router';

let loggedin = false
export async function getStaticProps(req: NextRequest, res: NextResponse) {
  // if (!loggedin) {
  //   return {
  //     redirect: {
  //       destination: '/sso',
  //       permanent: false,
  //     },
  //   }
  // }
  return {
    props: {}
  }
}

export default function ewsIndex(pageProps: any) {
  return (
    <React.StrictMode>
      <Head>
        <title>Ensea Web Schedule</title>
        <meta name="description" content="Ensea Web Schedule" />
        <meta property="og:title" content="Ensea Web Schedule" key="title" />
        <meta property="og:url" content="www.ews.assos-ensea.fr" />
        <meta property="og:type" content="website" />
        <meta property="fb:app_id" content="ratio facebook" />
        <meta name="twitter:card" content="summary" />
        <meta
          property="og:description"
          content="Hurray!! Yes Social Media Preview is Working"
        />
        <meta property="og:image" content={"../public/logo.png"} />
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
let authed = false
const cas_host = 'https://identites.ensea.fr/cas'
const service = process.env.casService ? process.env.casService : 'http://localhost:3000'
async function ClientSideCASAuth() {
  const router = useRouter() as NextRouter
  if (router.isReady) {
    if (router.query.ticket) {
      console.log('auhted');
      authed = true
      const ticket = router.query.ticket
      const req: RequestInit = {
        mode: 'no-cors',
        method: "GET",
        headers: {
          mode: 'no-cors',
          ReferrerPolicy: 'unsafe-url'
        },
        credentials: "include",
      }
      fetch((cas_host + '/serviceValidate?service=' + service + '&ticket=' + ticket), req).then((res) => {
        console.log(res)
        // let list_user = data.match(/(<cas:user>)(.+?)(<\/cas:user>)/i);
        // let user = list_user[0];
        // user = user.replace('<cas:user>', '');
        // user = user.replace('<\/cas:user>', '');
      })
    } else if (!authed) {
      router.push('/sso')
    }
  }
}

function App() {
  const lastSchedule = getCookie('lastSchedule')
  const [isMounted, setIsMounted] = useState(false);  // Server side rendering and traditional rendering
  const [currentWeek, setCurrentWeek] = useState(1)
  const [scheduleID, setScheduleID] = useState(lastSchedule)
  const setScheduleAndSave = (scheduleID) => {
    setCookie('lastSchedule', scheduleID, {
      expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 62),  // 62 days,
      sameSite: true
    })
    setScheduleID(scheduleID)
  }
  useEffect(() => {
    setIsMounted(true);
    setCurrentWeek(getWeekID(new Date()))  // the first weekID is set to be today's week
  }, [])
  if (!isMounted) {
    return
  }
  ClientSideCASAuth()
  return (
    <>
      <SearchBar scheduleID={scheduleID} setSchedule={setScheduleAndSave} className='SelectionsContainer relative from-main-orange 
      to-main-orange-light bg-gradient-to-r h-20 w-full flex-col align-center justify-center'/>
      <WeekSelectionSwiper setWeek={setCurrentWeek} weekID={currentWeek} />
      <div className="WeekScheduleContainer w-full h-[69%]">
        {
          scheduleID ?
            <WeekDaySwiper schedule={scheduleID} currentWeek={currentWeek} />
            :
            <GetStarted />
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