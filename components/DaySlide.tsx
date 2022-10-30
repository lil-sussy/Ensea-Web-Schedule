import clsx from 'clsx';
import { useState, useEffect, useMemo, Attributes, Key } from 'react';
import { Swiper, SwiperSlide, SwiperProps } from "swiper/react";
import "swiper/swiper-bundle.min.css";

let DaySlide = (actualDay: String, date: Date, dayData: any) => {
  const courses = dayData;
  const courseHourWrappers = [];
  const divCourses = [];
  if (courses != undefined) {  // It may be possible if a day is empty
    for (let i = 0; i < courses.length; i++) {
      const course = courses[i]
      const beginHour = Number(course.begin.slice(0, 2))
      const endHour = Number(course.end.slice(0, 2))
      const rowBegin = (beginHour - 6) * 2 + (course.begin.slice(3, 5) == '30' ? 1 : 0)   // Half hours are 1 row in length and the day starts at 6am + 1 if half hour
      const rowEnd = (endHour - 6) * 2 + (course.end.slice(3, 5) == '30' ? 1 : 0)   // Half hours are 1 row in length and the day starts at 6am + if half hour
      divCourses.push(
        <div key={course.begin} className={
          "Course w-full  text-gray-700 \
          rounded-md  bg-gradient-to-b p-2 font-marianne\
          from-third-purple to-third-purple "+
          "row-start-" + rowBegin + " row-end-" + rowEnd + " "  // This doesnt work for some reasons
          + " text-xs font-normal text-start"}
          style={{ gridRowStart: rowBegin, gridRowEnd: rowEnd,
            backgroundClip: '',  }}>
            <div className="CourseHeader w-full h-1/2 inline-grid 
              grid-cols-6 bg-opacity-40">
              <div className="CourseInfo relative text-start w-full 
                h-full whitespace-nowrap col-span-5 ">
                <div className="TextGradient absolute right-0 top-0 
                  w-full h-6"
                  style={{
                    background: 'linear-gradient(to right,\
                  transparent 85%, #ffeeff 95%)' }}></div>
                <div className="overflow-hidden font-bold text-sm">{course.name}</div>
              </div>
              <div className="CourseInfo relative text-start w-full h-full whitespace-nowrap col-span-1">
                <div className="TextGradient absolute right-0 top-0 w-full h-6"
                  style={{
                    background: 'linear-gradient(to right, \
                    transparent 85%, #ffeeff 95%)' }}></div>
                <div className="overflow-hidden">{course.place+ " "}</div>
              </div>
            </div>
            <div className="CourseContent opacity-90 w-full h-6 mx-2
              inline-grid grid-cols-4">
              <div className="CourseInfo text-start col-span-3 w-full 
                relative whitespace-nowrap">
                <div className="TextGradient absolute right-0 top-0 
                w-full h-5"
                  style={{
                    background: 'linear-gradient(to right, \
                  transparent 85%, #ffeeff 95%)' }}></div>
                <div className="overflow-hidden"> {course.teachers} </div>
              </div>
              <div className="CourseInfo text-start col-span-1 w-full 
                relative whitespace-nowrap">
                <div className="TextGradient absolute right-0 top-0 
                  w-full h-5"
                  style={{
                    background: 'linear-gradient(to right, \
                  transparent 85%, #ffeeff 95%)' }}></div>
                <div className="overflow-hidden"> {course.classes} </div>
              </div>
            </div>
        </div>
      );
      const wrpBeginHour = beginHour - 0.5   // Wrapper of half an hour long
      const wrpEndHour = endHour + 0.5  // Wrapping above the previous course
      const wrpRowBegin = (wrpBeginHour - 6) * 2 + (course.begin.slice(3, 5) == '30' ? 1 : 0)   // Half hours are 1 row in length and the day starts at 6am
      const wrpRowEnd = (wrpEndHour - 6) * 2 + (course.end.slice(3, 5) == '30' ? 1 : 0)   // Half hours are 1 row in length and the day starts at 7am
      courseHourWrappers.push(
        <div className="Hours absolute inline-grid w-9 h-full grid-rows-27">
          <div className={clsx(" row-start-" + wrpRowBegin + " row-end-" + wrpRowEnd + " text-white\
          font-bold rounded-lg w-6 mx-auto relative bg-gradient-to-b \
        from-main-purple to-main-purple-light")}
            style={{ gridRowStart: wrpRowBegin, gridRowEnd: wrpRowEnd }}>
            <h3 className="text-center items-center text-[0.65rem] leading-[1.1rem]
            ">{course.begin.slice(0, 3)}
            </h3>
            <div className="text-center items-center absolute bottom-0 text-[0.65rem]
              leading-[1.1rem] w-full ">
              <h3 className="mx-auto">
                {course.end.slice(0, 3)}
              </h3>
            </div>
          </div>
        </div>
      );
    }
  }
  return (
    <SwiperSlide key={actualDay as Key}>
      <div className="DayContainer w-full h-full text-lg flex 
      justify-center items-center">
        <div className="DayAbsoluteContainer absolute top-0 py-2
        w-72 h-full rounded-xl border-main-purple border-[1px] bg-white">
          <div className="DayContent h-[85%] absolute top-2 flex
          justify-start">
            {courseHourWrappers.map((div) => div)}
            <div className="CoursesContainer inline-grid grid-rows-27 w-60
            mx-9">
              {divCourses.map((div) => div)}
            </div>
          </div>
        </div>
          <div className="DayName absolute flex 
          justify-center items-center flex-col text-center w-full 
          bottom-0 h-[0.1428]">
            <h2 className="text-3xl font-light text-main-purple font-academyLET
            translate-y-3">
              {actualDay.toUpperCase()}
            </h2>
            <h4 className="text-sm font-normal text-gray-600 font-academyLET">
              {date.toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit' })}
            </h4>
          </div>
      </div>
    </SwiperSlide>
  );
}

export default DaySlide