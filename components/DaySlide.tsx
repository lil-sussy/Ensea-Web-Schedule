import { useState, useEffect, useMemo, Attributes, Key } from 'react';
import { Swiper, SwiperSlide, SwiperProps } from "swiper/react";
import "swiper/swiper-bundle.min.css";

let DaySlide = (actualDay: String, date:Date, dayData: any) => {
  const courses = dayData;
  const divCourses = [];
  const colorsRGBAs = new Map(); colorsRGBAs.set('green', 'rgba(220, 252, 231, 0.7)'); colorsRGBAs.set('emerald', 'rgba(209, 250, 229, 0.7)'); colorsRGBAs.set('lime', 'rgba(246, 252, 203, 0.7)'); colorsRGBAs.set('teal', 'rgba(204, 251, 241, 0.7)'); colorsRGBAs.set('cyan', 'rgba(207, 250, 254, 0.7)'); colorsRGBAs.set('sky', 'rgba(224, 242, 254, 0.7)'); colorsRGBAs.set('blue', 'rgba(219, 234, 254, 0.7)'); colorsRGBAs.set('indigo', 'rgba(224, 242, 254, 0.7)'); colorsRGBAs.set('violet', 'rgba(237, 233, 254, 0.7)'); colorsRGBAs.set('purple', 'rgba(243, 232, 255, 0.7)'); colorsRGBAs.set('fushia', 'rgba(250, 232, 252, 0.7)'); colorsRGBAs.set('pink', 'rgba(252, 231, 243, 0.7)'); colorsRGBAs.set('rose', 'rgba(255, 228, 230, 0.7)'); colorsRGBAs.set('yellow', 'rgba(254, 259, 195, 0.7)'); colorsRGBAs.set('amber', 'rgba(254, 243, 199, 0.7)'); colorsRGBAs.set('orange', 'rgba(255, 237, 213, 0.7)'); colorsRGBAs.set('red', 'rgba(254, 226, 266, 0.7)')
  const colorsRGBs = new Map(); colorsRGBs.set('green', 'rgba(220, 252, 231)'); colorsRGBs.set('emerald', 'rgba(209, 250, 229)'); colorsRGBs.set('lime', 'rgba(246, 252, 203)'); colorsRGBs.set('teal', 'rgba(204, 251, 241)'); colorsRGBs.set('cyan', 'rgba(207, 250, 254)'); colorsRGBs.set('sky', 'rgba(224, 242, 254)'); colorsRGBs.set('blue', 'rgba(219, 234, 254)'); colorsRGBs.set('indigo', 'rgba(224, 242, 254)'); colorsRGBs.set('violet', 'rgba(237, 233, 254)'); colorsRGBs.set('purple', 'rgba(243, 232, 255)'); colorsRGBs.set('fushia', 'rgba(250, 232, 252)'); colorsRGBs.set('pink', 'rgba(252, 231, 243)'); colorsRGBs.set('rose', 'rgba(255, 228, 230)'); colorsRGBs.set('yellow', 'rgba(254, 259, 195)'); colorsRGBs.set('amber', 'rgba(254, 243, 199)'); colorsRGBs.set('orange', 'rgba(255, 237, 213)'); colorsRGBs.set('red', 'rgba(254, 226, 266)')
  const colors = ['red', 'orange,', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose']
  if (courses != undefined) {  // It may be possible if a day is empty
    for (let i = 0; i < courses.length; i++) {
      const course = courses[i]
      let courseClasses = "Course opacity-80 p-2 h-full w-64 rounded-xl";
      const color = colors[Math.round(Math.random() * colors.length)]  // This does work
      courseClasses += " bg-" + color + "-100 begin-" + course.begin + " end-" + course.end + "";  // but this doesnt work for some reasons, if there is too many courses, the colors aren't shown
      const colorRGB = colorsRGBs.get(color)
      const colorRGBA = colorsRGBAs.get(color)
      divCourses.push(
        <div style={{ backgroundColor: colorRGBA }} key={course.begin} className={courseClasses} >
          <div className="CoursHeader opacity-90 w-full h-6 inline-grid grid-cols-6">
            <div className="CourseInfo relative text-start w-full h-full whitespace-nowrap col-span-4 ">
              <div className="TextGradient absolute right-0 top-0 w-full h-6"
                style={{ background: 'linear-gradient(to right, transparent 85%, ' + colorRGB + ' 95%)' }}></div>
              <div className="overflow-hidden">{course.name}</div>
            </div>
            <div className="CourseInfo relative text-end w-full h-full whitespace-nowrap col-span-2">
              <div className="TextGradient absolute right-0 top-0 w-full h-6"
                style={{ background: 'linear-gradient(to right, transparent 85%, ' + colorRGB + ' 95%)' }}></div>
              <div className="overflow-hidden">{course.place}</div>
            </div>
          </div>
          <div className="CourseContent opacity-90 w-full h-6 inline-grid grid-cols-4">
            <div className="CourseInfo text-start col-span-3 w-full text-sm relative whitespace-nowrap">
              <div className="TextGradient absolute right-0 top-0 w-full h-5"
                style={{ background: 'linear-gradient(to right, transparent 85%, ' + colorRGB + ' 95%)' }}></div>
              <div className="overflow-hidden"> {course.teachers} </div>
            </div>
            <div className="CourseInfo text-end col-span-1 w-full text-sm relative whitespace-nowrap">
              <div className="TextGradient absolute right-0 top-0 w-full h-5"
                style={{ background: 'linear-gradient(to right, transparent 85%, ' + colorRGB + ' 95%)' }}></div>
              <div className="overflow-hidden"> {course.classes} </div>
            </div>
          </div>
        </div>
      );
    }
  }
  return (
    <SwiperSlide key={actualDay as Key}>
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
            <h2 className="text-4xl">
              {actualDay.toUpperCase()}
            </h2>
            <h4 className="text-sm">
              
              {date.toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit'})}
            </h4>
          </div>
        </div>
      </div>
    </SwiperSlide>
  );
}

export default DaySlide