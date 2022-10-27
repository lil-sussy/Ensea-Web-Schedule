import { useState, useEffect } from "react";
import { Swiper, SwiperSlide, SwiperProps } from "swiper/react";
import "swiper/swiper-bundle.min.css";

import SwiperCore, { EffectCreative, EffectFlip, EffectCube, Navigation, Pagination } from "swiper";
  // Other effects : EffectCreative, EffectCube. Navigation : Navigation
import "swiper/css/effect-creative"
SwiperCore.use([EffectFlip])

let createDay = (actualDay, dayData) => {
  const courses = dayData;
  const divCourses = [];
  const colorsRGBs = new Map(); colorsRGBs.set('green', 'rgba(220, 252, 231, 0.7)'); colorsRGBs.set('emerald', 'rgba(209, 250, 229, 0.7)'); colorsRGBs.set('lime', 'rgba(246, 252, 203, 0.7)'); colorsRGBs.set('teal', 'rgba(204, 251, 241, 0.7)'); colorsRGBs.set('cyan', 'rgba(207, 250, 254, 0.7)'); colorsRGBs.set('sky', 'rgba(224, 242, 254, 0.7)'); colorsRGBs.set('blue', 'rgba(219, 234, 254, 0.7)'); colorsRGBs.set('indigo', 'rgba(224, 242, 254, 0.7)'); colorsRGBs.set('violet', 'rgba(237, 233, 254, 0.7)'); colorsRGBs.set('purple', 'rgba(243, 232, 255, 0.7)'); colorsRGBs.set('fushia', 'rgba(250, 232, 252, 0.7)'); colorsRGBs.set('pink', 'rgba(252, 231, 243, 0.7)'); colorsRGBs.set('rose', 'rgba(255, 228, 230, 0.7)'); colorsRGBs.set('yellow', 'rgba(254, 259, 195, 0.7)'); colorsRGBs.set('amber', 'rgba(254, 243, 199, 0.7)'); colorsRGBs.set('orange', 'rgba(255, 237, 213, 0.7)'); colorsRGBs.set('red', 'rgba(254, 226, 266, 0.7)')
  const colors = ['red', 'orange,', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose' ]
  for (let i = 0; i < courses.length; i++) {
    const course = courses[i]
    let courseClasses = "Course h-full w-64 rounded-xl";
    const color = colors[Math.round(Math.random()*colors.length)]  // This does work
    courseClasses += " begin-" + course.begin + " end-" + course.end + "";  // but this doesnt work for some reasons, if there is too many courses, the colors aren't shown
    const courseStyle = colorsRGBs.get(color)
    divCourses.push(
      <div style={{backgroundColor: courseStyle}} key={course.begin} className={courseClasses} >
        <div className="CoursHeader flex flex-row justify-center items-center">
          <h3 className="CourseInfo w-5/6 "> {course.lesson} </h3>
          <hr></hr>
          <h4 className="CourseInfo w-1/6 text-sm"> {course.place} </h4>
        </div>
        <div className="CourseContent flex flex-row justify-center">
          <h4 className="CourseInfo w-3/4 text-sm"> {course.teachers} </h4>
          <hr></hr>
          <h4 className="CourseInfo w-1/4 text-sm"> {course.classes} </h4>
        </div>
      </div>
    );
  }
  return (
    <SwiperSlide key={actualDay} className={actualDay}>
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


export default function WeekSchedule(props) {
  useEffect(() => {
  }, [])
  const daysList = [];
  if (props.schedule == undefined)
    return;
    console.log(props.schedule)
  for (let i = 0; i < props.schedule.length; i++) {
    const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    daysList.push(createDay(week[i], props.schedule[i]))
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