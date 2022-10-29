import { useState, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide, SwiperProps } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import useSWR, { SWRConfig } from 'swr'

import SwiperCore, { EffectCreative, EffectFlip, EffectCube, Navigation, Pagination } from "swiper";
// Other effects : EffectCreative, EffectCube. Navigation : Navigation
import "swiper/css/effect-creative"
SwiperCore.use([EffectFlip])

import DaySlide from './DaySlide'

export default function WeekSchedule(props) {
  const [isMounted, setIsMounted] = useState(false);  // Server side rendering and traditional rendering
  const fetchWithUser = (url, headers) => fetch(url, headers).then(res => res.json()).then((data) => {
    return data
  })
  const firstDayOfSchool = new Date('29 Aug 2022 02:00:00 GMT')  // First monday of first week, France is in GMT+2 zone
  const { week: week, weekID: currentWeek } = getSchoolWeek(new Date(), firstDayOfSchool)
  const config = useMemo(  // Apparently this might be useful
    () => ({
      headers: {
        classe: props.lastSchedule,
        week: currentWeek,
        'Content-Type': 'application/json',
      },
    }),
    [props.lastSchedule, currentWeek]
  );
  const { data, error } = useSWR(['/api/schedules', config], fetchWithUser)
  useEffect(() => {
    setIsMounted(true);
  }, [])
  if (error) return <p>No Data! contact me at yan.regojo@ensea.fr</p>
  if (!data) return <p>loading...</p>
  if (!isMounted) {
    return null;
  }

  const { daysList, onTransitionStart, onInit } = initWeekSchedule(data, week, currentWeek)
  const swiper = (<Swiper
    className="WeekSchedule w-full h-full mb-6"
    enabled={true}
    direction="horizontal"
    spaceBetween={0}
    centeredSlides={true}
    cssMode={false}
    modules={[Pagination]}
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
    {daysList.map(day => {
      return day;
    })}
  </Swiper>)
  return swiper;
}

function initWeekSchedule(data: any, weekDates: Date[], currentWeek: number) {
  const WEEK = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
  const weekSchedule = new Map()
  const classeSchedule = data.totalSchedule
  for (let scheduleIndex = 0; scheduleIndex < classeSchedule.length; scheduleIndex++) {
    const course = classeSchedule[scheduleIndex].course
    const weekID = Number(course.week)
    if (weekID == currentWeek) { 
      const dayID = course.dayOfWeek
      const dayCourses = weekSchedule.get(dayID) == undefined ? [] : weekSchedule.get(dayID) 
      dayCourses.push(course)
      weekSchedule.set(dayID, dayCourses)
    }
  }
  const daysList = []
  for (let i = 0; i < 7; i++) {
    console.log(weekSchedule.get(WEEK[i]));
    
    daysList.push(DaySlide(WEEK[i], weekDates[i], weekSchedule.get(WEEK[i])))
  }
  let animation_last_pos = -1;
  const HUGE_DIFFERENTIAL = 10;  // 10px
  const NiceAnimation = (swiper) => {
    if (swiper.destroyed === true) {
      return
    }
    const slideSize = swiper.size  // Taille d'une slide = taille du swiper width
    const snapGrid = swiper.snapGrid  // Positions horizontales des slides
    const swiperPos = -swiper.translate  // Actuel translation du swiper (position du centre du swiper)
    const dx = animation_last_pos == -1 ? 0 : Math.abs(swiperPos - animation_last_pos);  // Movement
    animation_last_pos = swiperPos;
    const maxIndex = swiper.slides.length
    for (let index = 0; index < maxIndex; index++) {  // parcours des slides
      let p = - (snapGrid[index] - swiperPos) / slideSize  // Distance entre le centre du swiper et la slide normé par sa taille
      p = p < -1 ? -1 : p;  // Normalisation du pourcentage entre 1 et -1
      p = p > 1 ? 1 : p;  // Le pourcentage est l'avancement de la transition
      // peut *être remplacer par animate.js
      const z_index = 2 - Math.round(Math.abs(p));  // either 2 or 1
      const scale = 0.8 + 0.2 * (1 - Math.abs(p));
      const transX = p * 30;  // Relative
      swiper.slides[index].style.z_index = z_index;  // Central slide should be in front of the others
      swiper.slides[index].style.transform = "scale(" + scale + ") translateX(" + transX + "%)"
      if (dx >= HUGE_DIFFERENTIAL) {  // Bigger than 10px
        swiper.slides[index].style.transitionDuration = "1500ms"  // God that's smooth
      } else {
        swiper.slides[index].style.transitionDuration = "100ms"
      }
    }
  }
  const onInit = (swiper) => {  // On swipper initialization
    NiceAnimation(swiper)
    const observer = new MutationObserver(function (mutations) {  // Style observer
      NiceAnimation(swiper)
    });
    const target = document.getElementsByClassName('swiper-wrapper');
    observer.observe(target[0], { attributes: true, attributeFilter: ['style'] });
  }
  const onTransitionStart = (swiper) => {  // This is called to late and so, doesn't work -> DELETE
    for (let index = 0; index < swiper.slides.length; index++) {
      swiper.slides[index].style.transitionDuration = "1000ms"
    }
  }
  return { daysList, onInit, onTransitionStart }
}

// https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
function dateDiffInDays(preceding: Date, date: Date) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(preceding.getFullYear(), preceding.getMonth(), preceding.getDate());
  const utc2 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

// https://bobbyhadz.com/blog/javascript-get-monday-of-current-week#:~:text=function%20getMondayOfCurrentWeek()%20%7B%20const%20today,Mon%20Jan%2017%202022%20console.
function getSchoolWeek(today: Date, schoolBeginDay: Date) {
  const diff = dateDiffInDays(schoolBeginDay, today)
  const first = today.getDate() - today.getDay() + 1;
  const monday = new Date(today.setDate(first));
  const week = [monday]
  for (let i = 1; i < 7; i++) {
    week.push(new Date(today.setDate(first + i)))
  }
  return { week: week, weekID: Math.floor(diff/7) + 1 }
}

/**
 * https://stackoverflow.com/questions/9045868/javascript-date-getweek
 * Returns the week number for this date.  dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * @param int dowOffset
 * @return int
 */
function getWeek(today: Date, dowOffset: number) {
  /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

  dowOffset = typeof (dowOffset) == 'number' ? dowOffset : 0; //default dowOffset to zero
  const newYear = new Date(today.getFullYear(), 0, 1);
  let day = newYear.getDay() - dowOffset; //the day of week the year begins on
  day = (day >= 0 ? day : day + 7);
  const daynum = Math.floor((today.getTime() - newYear.getTime() -
    (today.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1;
  let weeknum;
  //if the year starts before the middle of a week
  if (day < 4) {
    weeknum = Math.floor((daynum + day - 1) / 7) + 1;
    if (weeknum > 52) {
      const nYear = new Date(today.getFullYear() + 1, 0, 1);
      let nday = nYear.getDay() - dowOffset;
      nday = nday >= 0 ? nday : nday + 7;
      /*if the next year starts before the middle of
        the week, it is week #1 of that year*/
      weeknum = nday < 4 ? 1 : 53;
    }
  }
  else {
    weeknum = Math.floor((daynum + day - 1) / 7);
  }
  return weeknum;
};