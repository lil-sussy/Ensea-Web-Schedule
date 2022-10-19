import React, { Component } from 'react';

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";

import SwiperCore, { EffectFlip, Navigation, Pagination } from "swiper";


const styles = {
  focused: {
    
  },
  sided: {
    transform: 'scale(80%) translateX(0)',
  }
}

let createDay = (dayData, focused) => {
  const courses = dayData.courses;
  const divCourses = [];
  courses.map((course) => {
    let courseClasses = " w-3/4 h-full w-full bg-white rounded-xl opacity-85 ";
    courseClasses += "begin-" + course.begin + " end-" + course.end + "";
    divCourses.push(
      <div key={course.begin} className={courseClasses}>
        <h3> {course.name} </h3>
        <h4> {course.teachers} </h4>
        <h4> {course.classes} </h4>
        <h4> {course.place} </h4>
      </div>
    );
  });
  return (
    <SwiperSlide key={dayData.day} className="">
      <div className="">
        <div className="absolute left-0 backdrop-blur-sm w-64 h-full rounded-3xl"
          style={ focused ? styles.focused : styles.sided }>
          <div className=" rounded-3xl w-full h-full bg-white opacity-70">
          </div>
          <div className="flex flex-col justify-center items-start">
            <div className=" w-3">
              <h4 key="8h">8h</h4>
              <h4 key="9h">9h</h4>
              <h4 key="10h">10h</h4>
              <h4 key="11h">11h</h4>
              <h4 key="12h">12h</h4>
              <h4 key="13h">13h</h4>
              <h4 key="14h">14h</h4>
              <h4 key="15h">15h</h4>
              <h4 key="16h">16h</h4>
              <h4 key="17h">17h</h4>
              <h4 key="18h">18h</h4>
              <h4 key="19h">19h</h4>
              <h4 key="20h">20h</h4>
            </div>
            {divCourses.map((div) => {
              return div;
            })}
          </div>
        </div>
      </div>
    </SwiperSlide>
  );
}

let WeekSchedule = (props) => {
  const daysList = [];
  props.weekData.map((dayData) => {
    if (dayData.day !== "tuesday")
      daysList.push(createDay(dayData))
    else 
      daysList.push(createDay(dayData, true))
  });
  return (
    <Swiper
      className="msySwiper w-full h-full"
      enabled={true}
      direction="horizontal"
      spaceBetween={100}
      centeredSlides={true}
      cssMode={true}
      modules={[Pagination]}
      slidesPerView={3}
      speed={500}
      touchRatio={1.5}
      navigation={true}
      loop={false}
      effect={"slide"}  // slide fade cube coverflow flip creative
      autoplay={false}
      pagination={{ clickable: true }}
    >
      {daysList.map(day => {
        return day;
      })}
    </Swiper>
  );
}

export default WeekSchedule;