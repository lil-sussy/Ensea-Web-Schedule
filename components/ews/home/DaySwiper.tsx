import { useState, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide, SwiperProps } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import SwiperCore, { EffectCreative, EffectFlip, EffectCube, Navigation, Pagination } from "swiper";
// Other effects : EffectCreative, EffectCube. Navigation : Navigation
import "swiper/css/effect-creative"
SwiperCore.use([EffectFlip])

import DaySlide from './DaySlide'
import { getWeekDatesByID } from "../lib/schoolYear";
import useSWR from "swr";

import type { Course } from "../../../pages/api/schedules";

function reviver(key, value) {
  if(typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}

export default function WeekDaySwiper({ schedule: scheduleID, currentWeek: currentWeekID }) {
  const [isMounted, setIsMounted] = useState(false);  // Server side rendering and traditional rendering
  const [everyWeekSchedule, setEveryWeekSchedule] = useState(new Map())
  const [initialSlide, setInitialSlide] = useState(0)
  useEffect(() => {
    setIsMounted(true);
    setInitialSlide(new Date().getDay())
  }, [])
  const fetchWithUser = (url, headers) => fetch(url, headers).then(res => res.json()).then((data) => {
    return JSON.parse(data.totalSchedule, reviver)
  })
  const config = useMemo(  // Apparently this might be useful
  () => ({
    headers: {
      classe: scheduleID,
      'Content-Type': 'application/json',
    },
  }), [scheduleID]);
  const { data: yearSchedule, error } = useSWR(['/api/schedules', config], fetchWithUser)
  const loading = !yearSchedule  // useSWR hook returns undefined and will automatically reload once the data is fetched
  if (yearSchedule && yearSchedule.size != 0 && everyWeekSchedule.size == 0) {  // If the data was fetched but the state wasnt initialised -> initialisation;
    // This if is in order to prevent the inifinite state rendering :)
    setEveryWeekSchedule(yearSchedule) // Map containing schedules of weeks
  }
  if (!isMounted) {  // To use server side rendering with nextjs without anay pb
    return null;
  }
  const mainOrange = '#ff8f00'
  const mainOrangeDark = '#c56000'
  const mainPurpleLight = '#ff5bff'
  const mainPurpleDark = '#9e00c5'
  const mainOrangeLight = '#ffc046'
  if (loading || error) return (
    <div className='w-full h-full'>
      <h1 className="font-kefa text-md text-center w-64 rounded-lg bg-white p-1 mx-auto border-main-orange border-2"><span className="text-main-orange">EWS</span> is fetching your schedule from <span className='text-main-purple'>ADE</span></h1>
      <svg xmlns="http://www.w3.org/2000/svg" style={{ margin: "auto", background: "", display: "block" }} width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <g transform="translate(0 18)">
          <path fill={ mainOrangeLight } d="M53.2,30.3c0.4-1.3,0.6-2.7,0.6-4.2c0-1.2-0.1-2.3-0.4-3.4c-1.5-6-7-10.5-13.5-10.5 c-5.3,0-9.9,3-12.3,7.4c-0.9-0.3-1.8-0.4-2.8-0.4c-5.1,0-9.3,4.1-9.3,9.3c0,0.6,0.1,1.3,0.2,1.9c-4.7,0.7-8.3,4.8-8.3,9.7 c0,5.4,4.4,9.8,9.8,9.8h34.2c3.8,0,7.1-2.2,8.8-5.4c0.7-1.3,1.1-2.9,1.1-4.5C61.4,35.2,57.8,31.1,53.2,30.3z">
            <animateTransform attributeName="transform" type="translate" values="-3 0;3 0;-3 0" keyTimes="0;0.5;1" dur="2" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1"></animateTransform>
          </path>
          <defs>
            <path id="ldio-iwdxn2mvp5-path" d="M0,0v100h100V0H0z M62.9,44.4c-1.7,3.4-5.3,5.8-9.4,5.8H17c-5.8,0-10.5-4.7-10.5-10.5 c0-5.2,3.8-9.6,8.9-10.4c-0.1-0.6-0.2-1.3-0.2-2c0-5.5,4.4-9.9,9.9-9.9c1,0,2,0.2,3,0.5c2.5-4.7,7.4-7.9,13.1-7.9 c6.9,0,12.8,4.8,14.4,11.2c0.3,1.2,0.4,2.4,0.4,3.6c0,1.6-0.2,3.1-0.7,4.5c5,0.8,8.7,5.2,8.7,10.3C64,41.3,63.6,43,62.9,44.4z">
              <animateTransform attributeName="transform" type="translate" values="-3 0;3 0;-3 0" keyTimes="0;0.5;1" dur="2" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1"></animateTransform>
            </path>
            <clipPath id="ldio-iwdxn2mvp5-cp"><use href="#ldio-iwdxn2mvp5-path"></use></clipPath>
          </defs>
          <g clipPath="url(ldio-iwdxn2mvp5-cp)">
            <path fill={ mainPurpleLight } d="M84.9,28.9c0.4-1.1,0.6-2.3,0.6-3.5c0-1-0.1-1.9-0.4-2.8 c-1.3-5-6.1-8.7-11.8-8.7c-4.6,0-8.7,2.5-10.7,6.1c-0.8-0.2-1.6-0.4-2.4-0.4c-4.5,0-8.1,3.4-8.1,7.6c0,0.5,0.1,1,0.2,1.5 c-4.1,0.6-7.2,4-7.2,8c0,4.5,3.8,8.1,8.6,8.1h29.8c3.3,0,6.2-1.8,7.7-4.4c0.6-1.1,0.9-2.3,0.9-3.7C92,32.9,88.9,29.6,84.9,28.9z">
              <animateTransform attributeName="transform" type="translate" values="-3 0;3 0;-3 0" keyTimes="0;0.5;1" dur="1.32" repeatCount="indefinite" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1"></animateTransform>
            </path>
          </g>
        </g>
      </svg>
    </div>
  )
  const dayList = generateDayDataList(currentWeekID, everyWeekSchedule)
  return (<Swiper key={1} id='daySwiper'
    modules={ [ Pagination, Navigation ]  }
    className="WeekSchedule w-full h-full"
    initialSlide={initialSlide}
    enabled={true}
    direction="horizontal"
    spaceBetween={0}
    centeredSlides={true}
    cssMode={false}
    slidesPerView={1}
    speed={1000}
    touchRatio={1.5}
    navigation={false}
    loop={false}
    autoplay={false}
    onInit={onInit}
    pagination={{ clickable: true }}
  >
    {dayList.map(({ name, date, data }) => {
      return (
        <SwiperSlide key={name}>
          <DaySlide actualDay={name} dayData={data} date={date} loading={false}></DaySlide>
        </SwiperSlide>
      );
    })}
  </Swiper>)
}

function generateDayDataList(currentWeekID: number, everyWeekSchedule: Map<number, Map<String, Course[]>>) {
  const weekDates = getWeekDatesByID(currentWeekID) 
  const dayList = []
  const WEEK = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
  for (let i = 0; i < 7; i++) {
    const name = WEEK[i]
    if (everyWeekSchedule.get(currentWeekID)) {  // Not holidays or data still loading
      const data = everyWeekSchedule.get(currentWeekID).get(name)
      if ((name === "Samedi" || name === "Dimanche") && data == undefined) {
  
      } else {
        dayList.push({ name: name, date: weekDates[i], data: data })
      }
    } else {  // Holidays !!!
      dayList.push({ name: name, date: weekDates[i], data: null})
    }
  }
  return dayList
}

const onInit = (swiper: any) => {  // On swipper initialization
  let animation_last_pos = -1;
  const HUGE_DIFFERENTIAL = 10;  // 10px
  const NiceAnimation = (swiper: any) => {  // This is animation uses the current translateX property of the slider to render a cool animation
    // This animation could be done using animate js and by removing the implementation of swiper.js
    if (swiper.destroyed === true) {
      return
    }
    const slideSize = swiper.size  // Width of a slide of the swiper width
    const snapGrid = swiper.snapGrid  // Snap positions of slides in the swiper
    const swiperPos = -swiper.translate  // Acutal position of the swiper (its x translation)
    const dx = animation_last_pos == -1 ? 0 : Math.abs(swiperPos - animation_last_pos);  // Movement
    animation_last_pos = swiperPos;
    const maxIndex = swiper.slides.length
    for (let index = 0; index < maxIndex; index++) {  // for each slide
      let p = - (snapGrid[index] - swiperPos) / slideSize  // Distance between the position of the swiper and the position of the current slide normalized by a slide width
      p = p < -1 ? -1 : p;  // This ratio is normalized between 1 and -1
      p = p > 1 ? 1 : p;  // This new ratio now corresponds to the advancement in time of the transition 
      // This animation could be replaced with anime js 
      const z_index = 2 - Math.round(Math.abs(p));  // either 2 or 1
      const scale = 0.8 + 0.2 * (1 - Math.abs(p));
      const transX = p * 35;  // Relative
      swiper.slides[index].style.z_index = z_index;  // Central slide should be in front of the others
      swiper.slides[index].style.transform = "scale(" + scale + ") translateX(" + transX + "%)"
      if (dx >= HUGE_DIFFERENTIAL) {  // Bigger than 10px
        swiper.slides[index].style.transitionDuration = "1500ms"  // God that's smooth
      } else {
        swiper.slides[index].style.transitionDuration = "1000ms"
      }
    }
  }
  NiceAnimation(swiper)  // First call initialization
  const observer = new MutationObserver(function (mutations) {  // Style observer
    NiceAnimation(swiper)
  });
  const target = swiper.el.getElementsByClassName('swiper-wrapper');  // [1] cuz there is another swiper
  observer.observe(target[0], { attributes: true, attributeFilter: ['style'] });
}