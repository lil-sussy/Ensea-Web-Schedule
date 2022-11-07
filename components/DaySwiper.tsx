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
import { getWeekByID } from "../pages";
import useSWR from "swr";

export default function WeekSchedule({ schedule, currentWeek: currentWeekID }) {
  const [isMounted, setIsMounted] = useState(false);  // Server side rendering and traditional rendering
  const [everyWeekSchedule, setEveryWeekSchedule] = useState(new Map())
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
  if (data && everyWeekSchedule.size == 0) {
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
    setEveryWeekSchedule(everyWeekSchedule) // Map containing schedules of weeks
  }
  useEffect(() => {
    setIsMounted(true);
  }, [])
  if (!isMounted) {
    return null;
  }
  const weekDates = getWeekByID(currentWeekID) 
  currentWeekID += 1   // For some reasons
  const daysList = []
  const WEEK = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
  for (let i = 0; i < 7; i++) {
    const name = WEEK[i]
    if (everyWeekSchedule.get(currentWeekID)) {  // Not holidays or data still loading
      const data = everyWeekSchedule.get(currentWeekID).get(name)
      if ((name === "Samedi" || name === "Dimanche") && data == undefined) {
  
      } else {
        daysList.push({ name: name, date: weekDates[i], data: data })
      }
    } else {  // Holidays !!!
      daysList.push({ name: name, date: weekDates[i], data: undefined})
    }
  }
  const { onTransitionStart, onInit } = initSwiper()
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
    onTransitionStart={onTransitionStart}
    onInit={onInit}
    pagination={{ clickable: true }}
  >
    {daysList.map(({ name, date, data }) => {
      return (
        <SwiperSlide key={name}>
          <DaySlide actualDay={name} dayData={data} date={date} loading={false}></DaySlide>
        </SwiperSlide>
      );
    })}
  </Swiper>)
}

function initSwiper() {
  let animation_last_pos = -1;
  const HUGE_DIFFERENTIAL = 10;  // 10px
  const NiceAnimation = (swiper: any) => {
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
  const onInit = (swiper: any) => {  // On swipper initialization
    NiceAnimation(swiper)  // First call initialization
    const observer = new MutationObserver(function (mutations) {  // Style observer
      NiceAnimation(swiper)
    });
    const target = swiper.el.getElementsByClassName('swiper-wrapper');  // [1] cuz there is another swiper
    observer.observe(target[0], { attributes: true, attributeFilter: ['style'] });
  }
  const onTransitionStart = (swiper) => {  // This is called to late and so, doesn't work -> DELETE
    for (let index = 0; index < swiper.slides.length; index++) {
      swiper.slides[index].style.transitionDuration = "1000ms"
    }
  }
  return { onInit, onTransitionStart }
}