import { useState, useEffect } from "react";
import { Swiper, SwiperSlide, SwiperProps } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import useSWR, { SWRConfig } from 'swr'

import SwiperCore, { EffectCreative, EffectFlip, EffectCube, Navigation, Pagination } from "swiper";
  // Other effects : EffectCreative, EffectCube. Navigation : Navigation
import "swiper/css/effect-creative"
SwiperCore.use([EffectFlip])

export default function WeekSchedule(props) {
  const fetchWithUser = url => fetch(url).then(res => res.json()).then((schedule))
  const currentWeek = getWeek(new Date(), 50)
  console.log("currentWeek : ", currentWeek)
  const [isMounted, setIsMounted] = useState(false);  // Server side rendering and traditional rendering
  useEffect(() => {
    setIsMounted(true);
  }, [])
  if (!isMounted) {
    return null;
  }
  return;
  // console.log(props)
  // const { schedule, error } = useSWR(
  //   props.lastSchedule ? ['/api/schedules',
  //   { week:currentWeek, classe: props.lastSchedule}] : null
  //   , fetchWithUser)
  // if (!schedule) return <p>loading</p>
  // if (error) return <p>No Data!</p>
  
  const { daysList, onTransitionStart, onInit } = initWeekSchedule(schedule)
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

function initWeekSchedule(schedule) {
  const daysList = []
  for (let i = 0; i < schedule.length; i++) {
    const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    daysList.push(createDay(week[i], schedule[i]))
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
      const scale = 0.8 + 0.2*(1-Math.abs(p));
      const transX = p * 30;  // Relative
      swiper.slides[index].style.z_index = z_index;  // Central slide should be in front of the others
      swiper.slides[index].style.transform = "scale(" + scale + ") translateX(" + transX + "%)"
      if (dx >= HUGE_DIFFERENTIAL) {  // Bigger than 10px
        swiper.slides[index].style.transitionDuration = "1500ms"  // God that's smooth
      } else {
        swiper.slides[index].style.transitionDuration = "10ms"
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

let createDay = (actualDay, dayData) => {
  const courses = dayData;
  const divCourses = [];
  const colorsRGBAs = new Map(); colorsRGBAs.set('green', 'rgba(220, 252, 231, 0.7)'); colorsRGBAs.set('emerald', 'rgba(209, 250, 229, 0.7)'); colorsRGBAs.set('lime', 'rgba(246, 252, 203, 0.7)'); colorsRGBAs.set('teal', 'rgba(204, 251, 241, 0.7)'); colorsRGBAs.set('cyan', 'rgba(207, 250, 254, 0.7)'); colorsRGBAs.set('sky', 'rgba(224, 242, 254, 0.7)'); colorsRGBAs.set('blue', 'rgba(219, 234, 254, 0.7)'); colorsRGBAs.set('indigo', 'rgba(224, 242, 254, 0.7)'); colorsRGBAs.set('violet', 'rgba(237, 233, 254, 0.7)'); colorsRGBAs.set('purple', 'rgba(243, 232, 255, 0.7)'); colorsRGBAs.set('fushia', 'rgba(250, 232, 252, 0.7)'); colorsRGBAs.set('pink', 'rgba(252, 231, 243, 0.7)'); colorsRGBAs.set('rose', 'rgba(255, 228, 230, 0.7)'); colorsRGBAs.set('yellow', 'rgba(254, 259, 195, 0.7)'); colorsRGBAs.set('amber', 'rgba(254, 243, 199, 0.7)'); colorsRGBAs.set('orange', 'rgba(255, 237, 213, 0.7)'); colorsRGBAs.set('red', 'rgba(254, 226, 266, 0.7)')
  const colorsRGBs = new Map(); colorsRGBs.set('green', 'rgba(220, 252, 231)'); colorsRGBs.set('emerald', 'rgba(209, 250, 229)'); colorsRGBs.set('lime', 'rgba(246, 252, 203)'); colorsRGBs.set('teal', 'rgba(204, 251, 241)'); colorsRGBs.set('cyan', 'rgba(207, 250, 254)'); colorsRGBs.set('sky', 'rgba(224, 242, 254)'); colorsRGBs.set('blue', 'rgba(219, 234, 254)'); colorsRGBs.set('indigo', 'rgba(224, 242, 254)'); colorsRGBs.set('violet', 'rgba(237, 233, 254)'); colorsRGBs.set('purple', 'rgba(243, 232, 255)'); colorsRGBs.set('fushia', 'rgba(250, 232, 252)'); colorsRGBs.set('pink', 'rgba(252, 231, 243)'); colorsRGBs.set('rose', 'rgba(255, 228, 230)'); colorsRGBs.set('yellow', 'rgba(254, 259, 195)'); colorsRGBs.set('amber', 'rgba(254, 243, 199)'); colorsRGBs.set('orange', 'rgba(255, 237, 213)'); colorsRGBs.set('red', 'rgba(254, 226, 266)')
  const colors = ['red', 'orange,', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose' ]
  for (let i = 0; i < courses.length; i++) {
    const course = courses[i]
    let courseClasses = "Course opacity-80 p-2 h-full w-64 rounded-xl";
    const color = colors[Math.round(Math.random()*colors.length)]  // This does work
    courseClasses += " bg-"+color+"-100 begin-" + course.begin + " end-" + course.end + "";  // but this doesnt work for some reasons, if there is too many courses, the colors aren't shown
    const colorRGB = colorsRGBs.get(color)
    const colorRGBA = colorsRGBAs.get(color)
    divCourses.push(
      <div style={{backgroundColor: colorRGBA}} key={course.begin} className={courseClasses} >
        <div className="CoursHeader opacity-90 w-full h-6 inline-grid grid-cols-6">
          <div className="CourseInfo relative text-start w-full h-full whitespace-nowrap col-span-4 ">
            <div className="TextGradient absolute right-0 top-0 w-full h-6"
              style={{background: 'linear-gradient(to right, transparent 85%, '+colorRGB+' 95%)'}}></div>
            <div className="overflow-hidden">{course.lesson}</div>
          </div>
          <div className="CourseInfo relative text-end w-full h-full whitespace-nowrap col-span-2">
            <div className="TextGradient absolute right-0 top-0 w-full h-6"
              style={{background: 'linear-gradient(to right, transparent 85%, '+colorRGB+' 95%)'}}></div>
            <div className="overflow-hidden">{course.place}</div>
          </div>
        </div>
        <div className="CourseContent opacity-90 w-full h-6 inline-grid grid-cols-4">
          <div className="CourseInfo text-start col-span-3 w-full text-sm relative whitespace-nowrap">
            <div className="TextGradient absolute right-0 top-0 w-full h-5"
              style={{background: 'linear-gradient(to right, transparent 85%, '+colorRGB+' 95%)'}}></div>
            <div className="overflow-hidden"> {course.teachers} </div>
          </div>
          <div className="CourseInfo text-end col-span-1 w-full text-sm relative whitespace-nowrap">
            <div className="TextGradient absolute right-0 top-0 w-full h-5"
              style={{background: 'linear-gradient(to right, transparent 85%, '+colorRGB+' 95%)'}}></div>
            <div className="overflow-hidden"> {course.classes} </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <SwiperSlide key={actualDay} className={actualDay}>
      <div className="DayContainer w-full h-full text-lg flex justify-center items-center">
        <div className="DayAbsoluteContainer absolute left--1/4 top-0 backdrop-blur-sm w-80 h-full rounded-3xl">
          <div className="DayBackground rounded-3xl w-full h-full bg-white bg- opacity-80">
          </div>
          <div className="DayContent h-9/10 absolute top-2 flex justify-start">
            <div className="Hours inline-grid w-12 h-full">
              <h4 key="8h" className="Hour">8h</h4>
              <h4 key="9h" className="Hour">9h</h4>
              <h4 key="10h" className="Hour">10h</h4>
              <h4 key="11h" className="Hour">11h</h4>
              <h4 key="12h" className="Hour">12h</h4>
              <h4 key="13h" className="Hour">13h</h4>
              <h4 key="14h" className="Hour">14h</h4>
              <h4 key="15h" className="Hour">15h</h4>
              <h4 key="16h" className="Hour">16h</h4>
              <h4 key="17h" className="Hour">17h</h4>
              <h4 key="18h" className="Hour">18h</h4>
              <h4 key="19h" className="Hour">19h</h4>
              <h4 key="20h" className="Hour">20h</h4>
            </div>
            <div className="CoursesContainer inline-grid grid-rows-40">
              {divCourses.map((div) => {
                return div;
              })}
            </div>
          </div>
          <div className="DayName absolute flex justify-center items-center flex-col text-center w-full bottom-0 h-1/7">
            <h2 className = "text-4xl">
              {actualDay.toUpperCase()}
            </h2>
            <h4 className = "text-sm">
              {dayData.date}
            </h4>
          </div>
        </div>
      </div>
    </SwiperSlide>
  );
}

/**
 * Returns the week number for this date.  dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * @param int dowOffset
 * @return int
 */
function getWeek(today, dowOffset) {
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