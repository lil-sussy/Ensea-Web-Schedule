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
import { getWeekByID } from "../lib/schoolYear";
import useSWR from "swr";

export default function WeekDaySwiper({ schedule, currentWeek: currentWeekID }) {
  const [isMounted, setIsMounted] = useState(false);  // Server side rendering and traditional rendering
  const [everyWeekSchedule, setEveryWeekSchedule] = useState(new Map())
  useEffect(() => {
    setIsMounted(true);
  }, [])
  const fetchWithUser = (url, headers) => fetch(url, headers).then(res => res.json()).then((data) => {
    return data
  })
  const config = useMemo(  // Apparently this might be useful
  () => ({
    headers: {
      classe: schedule,
      'Content-Type': 'application/json',
    },
  }),
    [schedule]
    );
    const { data, error } = useSWR(['/api/schedules', config], fetchWithUser)
  if (error) return <p>No Data! contact me at yan.regojo@ensea.fr</p>
  const loading = !data  // useSWR hook returns undefined and will automatically reload once the data is fetched
  if (data && everyWeekSchedule.size == 0) {  // If the data was fetched but the state wasnt initialised -> initialisation;
    // This if is in order to prevent the inifinite state rendering :)
    setEveryWeekSchedule(InitializeWeeksSchedule(data)) // Map containing schedules of weeks
  }
  if (!isMounted) {  // To use server side rendering with nextjs without anay pb
    return null;
  }
  const dayList = generateDayDataList(currentWeekID, everyWeekSchedule)
  return (<Swiper key={1} id='daySwiper'
    modules={ [ Pagination, Navigation ]  }
    className="WeekSchedule w-full h-full"
    initialSlide={0}
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

function generateDayDataList(currentWeekID: number, everyWeekSchedule: any) {
  const weekDates = getWeekByID(currentWeekID) 
  currentWeekID += 1   // For some reasons :/ :'(
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
      dayList.push({ name: name, date: weekDates[i], data: undefined})
    }
  }
  return dayList
}

function InitializeWeeksSchedule(data: any) {
  const classeSchedule = data.totalSchedule  // Schedule of every week at once
  const everyWeekSchedule = new Map()
  for (let scheduleIndex = 0; scheduleIndex < classeSchedule.length; scheduleIndex++) {  // Going through every schedules
    const course = classeSchedule[scheduleIndex].course
    const weekID = Number(course.week)  // Each course object is attached to a weekID to be identified
    const weekSchedule = everyWeekSchedule.get(weekID) ? everyWeekSchedule.get(weekID) : new Map()
    const dayID = course.dayOfWeek  // String such as 'Lundi' or 'Vendredi'
    const daySchedule = weekSchedule.get(dayID) ? weekSchedule.get(dayID) : [] 
    daySchedule.push(course)  // Map of schedules of the days
    weekSchedule.set(dayID, daySchedule)  // Map of schedules of the weeks
    everyWeekSchedule.set(weekID, weekSchedule)  // Map of weeks
  }
  return everyWeekSchedule
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