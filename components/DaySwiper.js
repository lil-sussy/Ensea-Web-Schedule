import { useState, useEffect } from "react";
import { Swiper, SwiperSlide, SwiperProps } from "swiper/react";
import "swiper/swiper-bundle.min.css";

import SwiperCore, { EffectCreative, EffectFlip, EffectCube, Navigation, Pagination } from "swiper";
  // Other effects : EffectCreative, EffectCube. Navigation : Navigation
import "swiper/css/effect-creative"
SwiperCore.use([EffectFlip])

let createDay = (dayData, focused) => {
  const courses = dayData.courses;
  const divCourses = [];
  const colors = ['red', 'orange,', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose' ]
  courses.map((course) => {
    let courseClasses = "Course h-full w-80 rounded-xl opacity-80";
    const color = colors[Math.round(Math.random()*colors.length)]  // This does work
    courseClasses += " bg-"+color+"-100 begin-" + course.begin + " end-" + course.end + "";  // but this doesnt work for some reasons, if there is too many courses, the colors aren't shown
    divCourses.push(
      <div key={course.begin} className={courseClasses}>
        <h3 className=""> {course.name} </h3>
        <h4 className="text-sm"> {course.teachers} </h4>
        <h4 className="text-sm"> {course.classes} </h4>
        <h4 className="text-sm"> {course.place} </h4>
      </div>
    );
  });
  return (
    <SwiperSlide key={dayData.day} className={dayData.day}>
      <div className="DayContainer w-full h-full text-lg flex justify-center items-center">
        <div className="DayAbsoluteContainer absolute left--1/4 top-0 backdrop-blur-sm w-80 h-full rounded-3xl">
          <div className="DayBackground rounded-3xl w-full h-full bg-white bg- opacity-70">
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
              {dayData.day.toUpperCase()}
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


export default function WeekSchedule(props) {
  useEffect(() => {
  }, [])
  const daysList = [];
  props.weekData.map((dayData) => {
    if (dayData.day !== "tuesday")
      daysList.push(createDay(dayData))
    else
      daysList.push(createDay(dayData, true))
  });
  let animation_last_pos = -1;
  const HUGE_DIFFERENTIAL = 10;  // 10px
  const NiceAnimation = (swiper) => {
    if (swiper.destroyed === true) {
      return
    }
    const slideSize = swiper.size  // Taille d'une slide = taille du swiper width
    const snapGrid = swiper.snapGrid  // Positions horizontales des slides
    const swiperPos = -swiper.translate  // Actuel translation du swiper (position du centre du swiper)
    animation_last_pos = swiperPos;
    const dx = animation_last_pos === -1 ? 0 : Math.abs(swiperPos - animation_last_pos);  // Movement
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
        swiper.slides[index].style.transitionDuration = "1000ms"  // God that's smooth
      } else {
        swiper.slides[index].style.transitionDuration = "0ms"
      }
    }
  }
  const onInit = (swiper) => {  // On swipper initialization
    swiper.slides[index].style.transitionProperty = "transform"  // Transition of the end
    swiper.slides[index].style.transitionDuration = "0ms"  // (Replacement transition)
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