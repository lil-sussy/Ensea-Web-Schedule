import clsx from 'clsx';
import { useState, useEffect, useMemo, Attributes, Key } from 'react';
import { Swiper, SwiperSlide, SwiperProps } from "swiper/react";
import "swiper/swiper-bundle.min.css";

export default function DaySlide({ actualDay, date, dayData, loading }) {
  const courses = dayData;
  const courseHourWrappers = [];
  const divCourses = [];
  if (courses != undefined) {  // It may be possible if a day is empty
    for (let i = 0; i < courses.length; i++) {
      const courseData = courses[i]
      divCourses.push(<Course courseData={courseData} />);
      courseHourWrappers.push(...CourseHours({courseData}));
    }
  } else {
    divCourses.push(
      <div className=''>
      </div>)
  }
  return (
    <SwiperSlide key={actualDay as Key}>
      <DayContainer>
        <DayContent courses={divCourses} coursesHours={courseHourWrappers} />
        <DayName name={actualDay} date={date} />
      </DayContainer>
    </SwiperSlide >
  );
}

function CourseHours({ courseData: course }) {
  const beginHour = Number(course.begin.slice(0, 2))
  const endHour = Number(course.end.slice(0, 2))
  const wrpBeginHour = beginHour   // Wrapper of half an hour long
  const wrpEndHour = endHour // Wrapping above the previous course
  const wrpRowBegin = (wrpBeginHour - 6) * 2 + (course.begin.slice(3, 5) == '30' ? 1 : 0)   // Half hours are 1 row in length and the day starts at 6am
  const wrpRowEnd = (wrpEndHour - 6) * 2 + (course.end.slice(3, 5) == '30' ? 1 : 0)   // Half hours are 1 row in length and the day starts at 7am
  const endHourPos = (wrpEndHour - 0.5 - 6) * 2 + (course.end.slice(3, 5) == '30' ? 1 : 0)   // Half hours are 1 row in length and the day starts at 7am
  return (
    [
      <div key={wrpBeginHour} className={clsx(" w-full h- row-start-" + wrpRowBegin + " col-span-1 text-white font-bold relative")}
        style={{ gridRowStart: wrpRowBegin }}>
        <div className="w-12 ml-1 bg-third-purple rounded-md text-main-purple h-full flex flex-col z-20">
          <h3 className="text-center items-center text-[0.65rem] leading-[0.7rem] my-auto z-20">
            {course.begin}
          </h3>
        </div>
        <div className="w-full absolute top-1/2 h-[0.15rem] bg-gradient-to-r from-main-purple to-main-purple-light -z-10"></div>
      </div>
    ]
  )
}

function Course({ courseData: course }) {
  const beginHour = Number(course.begin.slice(0, 2))
  const endHour = Number(course.end.slice(0, 2))
  const rowBegin = (beginHour - 6) * 2 + (course.begin.slice(3, 5) == '30' ? 1 : 0)   // Half hours are 1 row in length and the day starts at 6am + 1 if half hour
  const rowEnd = (endHour - 6) * 2 + (course.end.slice(3, 5) == '30' ? 1 : 0)   // Half hours are 1 row in length and the day starts at 6am + if half hour
  return (
    <div key={course.begin} className={clsx(
      "Course w-full  text-gray-700 outline-2 outline-white relative rounded-md  bg-gradient-to-b p-2 font-marianne\
      from-third-purple to-third-purple row-start-" + rowBegin + " row-end-" + rowEnd + " flex flex-row items-center")}
      style={{
        gridRowStart: rowBegin, gridRowEnd: rowEnd,  // Because it doesnt work with tailwind
      }}>
      <CoursePlace place={course.place}/>
      <div className="inline-block w-[80%]">
        <div className="w-full flex items-start flex-col justify-center">
          <h3 className="font-bold text-base drop-shadow-sm font-dinCondensed">
            {course.name}
          </h3>
          <h4 className="text-xs font-Charter">
            {course.teachers.join(', ')}
          </h4>
          {/* <h4 className="overflow-hidden text-[0.5rem] text-end"> {course.classes} </h4> */}
        </div>
      </div>
    </div>
  )
}

function CoursePlace({ place }) {
  const AMPHI_WATTEAU = "Amphi Watteau"
  let textSize = 'text-xl'
  if (place == AMPHI_WATTEAU) {
    place = 'Amphi'
    textSize = 'text-sm'
  } else if (place.length > 1) {
    if (/D+[0-9]*/.test(place[0])) {
      place = 'D0**'
    }
    if (/A+1+[0-9]*/.test(place[0])) {
      place = 'A1**'
    }
    if (/A+2+[0-9]*/.test(place[0])) {
      place = 'A2**'
    }
    if (/C+1+[0-9]*/.test(place[0])) {
      place = 'C1**'
    }
    if (/C+2+[0-9]*/.test(place[0])) {
      place = 'C2**'
    }
    if (/C+3+[0-9]*/.test(place[0])) {
      place = 'C3**'
    }
  }
  return (
    <div className= { "inline-block h-full w-[20%] overflow-hidden text-start items-baseline font-extrabold \
    font-dinAlternate" }>
      <div className="flex flex-col justify-center items-start h-full w-full">
        <h2 className={ "text-main-purple-dark "+textSize }>
          {place}
        </h2>
      </div>
    </div>
  )
}

function DayContainer({ children }) {
  return (
    <div className="DayContainer w-full h-full text-lg flex 
    justify-center items-center">
      <div className="DayAbsoluteContainer absolute top-0 py-2 drop-shadow-md
      w-72 h-[95%] rounded-xl border-main-purple border-[1px] bg-white">
        {children}
      </div>
    </div>
  )
}

function DayContent({ courses, coursesHours }) {
  return (
    <div className="DayContent relative h-[89%] flex justify-start">
      <div className="absolute inline-grid grid-rows-27 w-full h-full z-10 -top-[1.8518%]">
        {coursesHours}
      </div>
      <div className="inline-grid grid-rows-27 w-full h-full">
        {courses}
      </div>
    </div>
  )
}

function DayName({ name, date }) {
  return (
    <div className="DayName absolute flex 
                  justify-center items-center flex-col text-center w-full 
                  bottom-0 h-[0.1428]">
      <h2 className="text-3xl font-light text-main-purple font-academyLET
                    translate-y-3">
        {name.toUpperCase()}
      </h2>
      <h4 className="text-xs font-normal mt-[0.1rem] text-gray-600 font-dinAlternate">
        {date.toLocaleString("fr-FR", { year: 'numeric', month: '2-digit', day: '2-digit' })}
      </h4>
    </div>
  )
}