import { useState, useEffect, useMemo } from 'react';
import React from 'react';
import WeekDaySwiper from '../components/ews/home/DaySwiper';
import Head from 'next/head'
import { firebase, database, auth } from '../components/ews/lib/firebaseClientConfig';
import background from '../public/background2k.png'
import logo from '../public/logo.png'
import WeekSelectionSwiper from '../components/ews/home/WeekSelectionSlider'

import { getWeekID } from '../components/ews/lib/schoolYear'
import SearchBar from '../components/ews/home/SearchEngine';
// import CAS from '../../lib/node-cas/lib/cas';
import { hasCookie, setCookie, getCookie } from 'cookies-next';
import Image from 'next/image';
import { NextRouter, Router, useRouter } from 'next/router';
import { signInWithCustomToken } from 'firebase/auth';
import type { CasResponse } from './api/cas'

export async function getServerSideProps(req: any, res: any) {
  //Check if user exists (jwt on client)
  const ticket = req.query.ticket
  const host = req.req.headers.host + ''
  if (ticket)
  return { props: { ticket: ticket, host: host } }
  else
  return { props: { ticket: null, host: host }}
}

function EWSIndex({ ticket, host }) {
  const [isMounted, setIsMounted] = useState(false);  // Server side rendering and traditional rendering
  const router = useRouter()
  useEffect(() => {
    setIsMounted(true);
  }, [])
  if (!isMounted) {
    return
  }
  let userToken: string
  if (auth.currentUser) {// If the user is already signed in with an existing account
    auth.currentUser.getIdToken(/* forceRefresh */ true).then((userToken) => {
      const user = signInWithCustomToken(auth, userToken)
        .then(user => console.log('logged in user', user))  // user should always exist at this point
        .catch((error) => {
          console.log('error', error)
        })
    })
  } else {
    if (ticket) {  // If there is a ticket (the user has been succesfully authed on cas server)
      fetch('/api/cas', {
        headers: {
          ticket: ticket
        }
      }).then(res => res.json()).then(apiRes => {
        const res = apiRes as CasResponse
        userToken = res.userToken
        if (userToken) {
          signInWithCustomToken(auth, userToken).then((operation) => {
            const user = operation.user 
            console.log('then user', user)  // user should always exist at this point
          }).catch((error) => {
            console.log('error', error)})
        }
      })
    } else {
      router.push('https://identites.ensea.fr/cas/login?service=http://'+host)  // after the auth, the server will send the user back to this page (index)
    }
  }
  
  return (
    <>
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
          content=""
        />
        <meta property="og:image" content={"../public/logo.png"} />
      </Head>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <Bakckground />
        <AppContainer>
          <AthenaHeader />
          <App/>
        </AppContainer>
      </>
    </>
  );
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
  return (
    <>
      <SearchBar scheduleID={scheduleID} setSchedule={setScheduleAndSave}/>
      <div className="WeekScheduleContainer w-full h-[69%]">
        <WeekSelectionSwiper setWeek={setCurrentWeek} weekID={currentWeek} />
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

function Bakckground() {
  return (
    <div className='bg-bggray'>
    </div>
  )
}

function AppContainer(props) {
  return (
    <div className="AppContainer text-black-red w-full h-full
    -translate-x-1/2 absolute left-1/2 top-0">
      {props.children}
    </div>
  )
}

function AthenaHeader() {
  return (
    <div className="Header relative w-full top-0 left-0 backdrop-blur-sm">
      <div className="z-20 w-full mx-auto bg-white bg-opacity-[70%]">
        <div className="h-full w-full py-1 pb-1">
          <div className='font-blanka text-2xl text-center h-11'>
            EWS
          </div>
        </div>
      </div>
    </div>
  )
}

export default EWSIndex  // Had to export this after otherwise index is not considered as a react component