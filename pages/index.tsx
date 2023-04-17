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
import type { CasResponse } from './api/authentification'

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
  let userToken: string  // Wtf
  if (auth.currentUser) {// If the user is already signed in with an existing account
    auth.currentUser.getIdToken(/* forceRefresh */ true).then((userToken) => {
        // Custom token was converted into ID Token and needs to be passed to the backend
      fetch('/api/authentification', {
        headers: {
          tokenID: userToken
        }
      }).then(res => res.json()).then(apiRes => {
        const user = apiRes.user  // The backend returned information about the signed in user
      }).catch((error) => {
        console.log('error', error)
      })
    })
  } else {
    if (ticket) {  // If there is a ticket (the user has been succesfully authed on cas server)
      fetch('/api/authentification', {
        headers: {
          ticket: ticket
        }
      }).then(res => res.json()).then(apiRes => {
        const res = apiRes as CasResponse
        userToken = res.userToken
        if (userToken) {
          signInWithCustomToken(auth, userToken).then((operation) => {
            const user = operation.user   // Browser is now signed in with custom token creating an ID Token instead
          }).catch((error) => {
            console.log('error', error)})
        }
      })
    } else {
      router.push('https://identites.ensea.fr/cas/login?service=http://'+host)  // after the auth, the server will send the user back to this page (index)
    }
  }
  // return Index()
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
          <BackgroundENSEA />
        <AppContainer>
          <AthenaHeader />
          <App/>
        </AppContainer>
      </>
    </>
  );
}

function Index() {
  const frame91Data = { children: "A210" }
	const amphiMicrop1Data = { frame9Props: frame91Data }
	const frame92Data = { children: "AMPHI" }
	const amphiMicrop2Data = { frame9Props: frame92Data }
	return (
		<div className="frame-1screen">
			{" "}
			<img className="logo" src="logo.png" alt="Logo" />{" "}
			<header className="header">
				{" "}
				<div className="searchbar">
					{" "}
					<div className="x1-g1-td3valign-text-middle"> 1G1 TD3 </div>{" "}
					<img className="icon-magnifying-glass" src="-icon-magnifying-glass.png" alt="icon &#34;magnifying glass&#34;" />{" "}
				</div>{" "}
				<img className="athena" src="athena.png" alt="ATHENA" />{" "}
			</header>{" "}
			<div className="monday">
				{" "}
				<div className="day-header">
					{" "}
					<img className="vector" src="vector.svg" alt="Vector" />{" "}
					<div className="frame-9-2">
						{" "}
						<div className="semaine-9valign-text-middle"> Semaine 9 </div> <div className="rectangle-12"></div>{" "}
					</div>{" "}
					<img className="vector" src="vector-1.svg" alt="Vector" />{" "}
				</div>{" "}
				<div className="day-content">
					{" "}
					<div className="day-title">
						{" "}
						<div className="day-buttons">
							{" "}
							<h1 className="titlevalign-text-middle"> MARDI </h1>{" "}
							<div className="group-9">
								{" "}
								<div className="overlap-group">
									{" "}
									<div className="rectangle-7"></div> <div className="addressvalign-text-middle"> 24 Jan 2023 </div>{" "}
								</div>{" "}
							</div>{" "}
							<div className="group-10">
								{" "}
								<img className="vector-1" src="vector-2.svg" alt="Vector" />{" "}
								<img className="icon-chevron-left" src="-icon-chevron-left.png" alt="icon &#34;chevron left&#34;" />{" "}
							</div>{" "}
						</div>{" "}
						<div className="underline"></div>{" "}
					</div>{" "}
					<div className="day-grid">
						{" "}
						<div className="grid">
							{" "}
							<div className="frame-11">
								{" "}
								<div className="rectangle"></div> <div className="rectangle"></div> <div className="rectangle"></div> <div className="rectangle"></div>{" "}
								<div className="rectangle"></div> <div className="rectangle"></div> <div className="rectangle"></div> <div className="rectangle"></div>{" "}
								<div className="rectangle"></div> <div className="rectangle"></div> <div className="rectangle"></div> <div className="rectangle"></div>{" "}
								<div className="rectangle"></div>{" "}
							</div>{" "}
							<div className="rectangle-22"></div>{" "}
						</div>{" "}
						<div className="heures">
							{" "}
							<div className="flex-collexenddeca-normal-black-64px">
								{" "}
								<div className="x8hvalign-text-middle"> 8h </div> <div className="x9hvalign-text-middle"> 9h </div>{" "}
								<div className="x10hvalign-text-middle"> 10h </div> <div className="x11hvalign-text-middle"> 11h </div>{" "}
								<div className="flex-col-itemvalign-text-middle"> 12h </div> <div className="x13hvalign-text-middle"> 13h </div>{" "}
								<div className="x14hvalign-text-middle"> 14h </div> <div className="x15hvalign-text-middle"> 15h </div>{" "}
								<div className="flex-col-itemvalign-text-middle"> 16h </div> <div className="x17hvalign-text-middle"> 17h </div>{" "}
								<div className="x18hvalign-text-middle"> 18h </div> <div className="flex-col-itemvalign-text-middle"> 19h </div>{" "}
								<div className="x20hvalign-text-middle"> 20h </div>{" "}
							</div>{" "}
						</div>{" "}
						<div className="schedule">
							{" "}
							<div className="amphi-microp-2">
								{" "}
								<div className="td-analyse-de-fourriervalign-text-middlelexenddeca-normal-white-48px"> TD Analyse de Fourrier </div>{" "}
								<div className="rectangle-13-1"></div>{" "}
								<div className="frame-9-3">
									{" "}
									<Frame9>A210</Frame9>{" "}
									<div className="frame-10-1">
										{" "}
										<div className="namevalign-text-middlelexenddeca-normal-white-48px"> Nicolas Papazoglou </div>{" "}
									</div>{" "}
								</div>{" "}
							</div>{" "}
							<div className="amphi-microp-container">
								{" "}
								<AmphiMicrop tdMicroprocesseur="TD Microprocesseur" frame9Props={amphiMicrop1Data.frame9Props} />{" "}
								<AmphiMicrop tdMicroprocesseur="CM Microprocesseur" className="amphi-microp-1" frame9Props={amphiMicrop2Data.frame9Props} />{" "}
							</div>{" "}
						</div>{" "}
					</div>{" "}
				</div>{" "}
			</div>{" "}
		</div>
	)
}

function Frame9(props) {
	const { children } = props
	return (
		<div className="frame-9">
			{" "}
			<div className="a210valign-text-middlelexenddeca-medium-white-64px"> {children} </div>{" "}
		</div>
	)
}
function AmphiMicrop(props) {
	const { tdMicroprocesseur, className, frame9Props } = props
	return (
		<div className={`amphi-microp ${className || ""}`}>
			{" "}
			<div className="x-microprocesseurvalign-text-middlelexenddeca-normal-white-48px"> {tdMicroprocesseur} </div> <div className="rectangle-13"></div>{" "}
			<div className="frame-9-1">
				{" "}
				<Frame9>{frame9Props.children}</Frame9>{" "}
				<div className="frame-10">
					{" "}
					<div className="monchal-laurentvalign-text-middlelexenddeca-normal-white-48px"> Monchal Laurent </div>{" "}
				</div>{" "}
			</div>{" "}
		</div>
	)
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

export default EWSIndex  // Had to export this after otherwise index is not considered as a react component