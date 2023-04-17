import clsx from 'clsx';
import { useState, useEffect, useMemo, Attributes, Key, ReactElement } from 'react';
import { Swiper, SwiperSlide, SwiperProps } from "swiper/react";
import "swiper/swiper-bundle.min.css";

import type { Course, CourseData } from '../../../pages/api/schedules';

export default function DaySlide({ actualDay, date, dayData, loading }) {
  const courses = dayData as Course[];
  const courseHourWrappers = emptyDayHourGrid()
  const divCourses = [];
  const courseHourWrapperList = []
  if (courses == null) {
    return (
      <SwiperSlide key={actualDay as Key}>
        <DayContainer>
          <div className="DayContent relative h-[100%] flex justify-start">
            <DayMask />
          </div>
          <DayName name={actualDay} date={date} />
        </DayContainer>
      </SwiperSlide >
    );
  } else if (courses != undefined) {  // It may be possible if a day is empty
    for (let i = 0; i < courses.length; i++) {
      const courseData = courses[i].courseData
      divCourses.push(<Course key={courseData.beginHour} courseData={courseData} />);
      courseHourWrappers.set(courseData.beginHour, CourseHours(courseData, false))
      if (!courseHourWrappers.get(courseData.endHour))  // We only display the end hour of the course if there is another course that starts after
        courseHourWrappers.set(courseData.endHour, CourseHours(courseData, true));
    }
    courseHourWrappers.forEach((value, key) => courseHourWrapperList.push(value))
  } else {
    divCourses.push(
      <div key={'1'} className=''>
      </div>)
  }
  return (
    <SwiperSlide key={actualDay as Key}>
      <DayContainer>
        <DayContent courses={divCourses} coursesHours={courseHourWrapperList} />
        <DayName name={actualDay} date={date} />
      </DayContainer>
    </SwiperSlide >
  );
}

function emptyDayHourGrid(): Map<String, any> {
  const hourList = new Map()
  return hourList
  for (let i = 8; i < 21; i++) {
    const hour = (i < 10 ? "0" + i : i) + ':00'
    hourList.set(hour, (
      <div key={hour} className={clsx(" w-full h- row-start-" + hour + " col-span-1 font-bold relative -z-40")}
        style={{ gridRowStart: (i-7)*2 }}>
        <div className="w-full absolute top-1/2 h-[1px] bg-gradient-to-r from-main-purple-light to-main-purple -z-40"></div>
      </div>
      // <div key={hour} className={clsx('w-full -z-20 h-[1px] row-span-1 bg-main-purple')}
      // style={{ gridRowStart: (i-7)*2 }}></div>
    ))
  }
  return hourList
}

function DayMask() {
  const emptyText = (key) => (
    <h1 key={key} className ='font-kefa font-bold text-center text-3xl text-white'>
      NOTHING
    </h1>)
  const emptyTextList = []
  for (let i = 0; i < 100; i++) {
    emptyTextList.push(emptyText(i))
  }
  return (
    <div className='bg-third-purple w-full h-full flex flex-col justify-center'>
      {emptyTextList}
    </div>
  )
}

interface CourseHoursProps extends React.ComponentProps<'div'> {
  courseData: CourseData,
  ending: boolean
}
function CourseHours(course: CourseData, ending: boolean) {
  const beginHour = Number(course.beginHour.slice(0, 2))
  const endHour = Number(course.endHour.slice(0, 2))
  const wrpRowBegin = (beginHour - 7) * 2 + (course.beginHour.slice(3, 5) == "30" ? 1 : 0)   // Half hours are 1 row in length and the day starts at 7am
  const wrpRowEnd = (endHour - 7) * 2 + (course.endHour.slice(3, 5) == "30" ? 1 : 0)   // Half hours are 1 row in length and the day starts at 7am
  if (!ending)
    return (
			<div key={beginHour} className={clsx(" h- row-start- w-full" + wrpRowBegin + " relative col-span-1 font-bold")} style={{ gridRowStart: wrpRowBegin }}>
				<div className="z-20 ml-1 flex h-full w-12 flex-col rounded-md bg-third-purple text-main-purple-light">
					<h3 className="z-20 my-auto items-center text-center text-[0.65rem] leading-[0.7rem]">{course.beginHour}</h3>
				</div>
				<div className="absolute top-1/2 -z-10 h-[0.15rem] w-full bg-gradient-to-r from-main-purple-light to-main-purple"></div>
			</div>
		)
  else
    return (
      <div key={endHour} className={clsx(" w-full h- row-start-" + wrpRowEnd + " col-span-1 font-bold relative \
      w-12 ml-1 rounded-md text-main-purple-light h-full flex flex-col ")}
      style={{ gridRowStart: wrpRowEnd }}>
        <h3 className="text-center items-center text-[0.65rem] leading-[0.7rem] my-auto z-20">
          {course.endHour}
        </h3>
      </div>
    )
}

const Course: React.FC<{courseData: CourseData}> = ({ courseData: course }) => {
	const beginHour = Number(course.beginHour.slice(0, 2))
	const endHour = Number(course.endHour.slice(0, 2))
	const rowBegin = (beginHour - 7) * 2 + (course.beginHour.slice(3, 5) == "30" ? 1 : 0) // Half hours are 1 row in length and the day starts at 7am + 1 if half hour
	const rowEnd = (endHour - 7) * 2 + (course.endHour.slice(3, 5) == "30" ? 1 : 0) // Half hours are 1 row in length and the day starts at 7am + if half hour
	if (course.teachers[0] == "") course.teachers.shift() // Remove first element of list
	return (
		<div
			key={course.beginHour}
			className={clsx(
				"Course row-start-  relative w-full bg-third-purple font-marianne text-gray-700 outline-2      outline-white" +
					rowBegin +
					" row-end-" +
					rowEnd +
					" flex flex-row items-center"
			)}
			style={{
				gridRowStart: rowBegin,
				gridRowEnd: rowEnd, // Because it doesnt work with tailwind
			}}
		>
			<CoursePlace place={course.locations} />
			<div className="inline-block h-full w-[80%] bg-third-purple">
				<div className="flex h-full w-full flex-col items-start justify-evenly">
					<h3 className="overflow-hidden whitespace-nowrap font-dinCondensed text-base font-normal">{course.name}</h3>
					<h4 className="font-Charter text-[0.68rem] leading-3 ">{course.teachers.join(", ")}</h4>
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
        <h2 className={ "text-main-purple-dark mx-auto "+textSize }>
          {place}
        </h2>
      </div>
    </div>
  )
}

function DayContainer({ children }) {
  return (
    <div className="DayContainer w-full h-full text-lg flex justify-center items-center drop-shadow-lg">
      <div className='absolute top-0 w-72 h-[95%] z-0'>
        <div className='bg-gradient-to-r from-main-purple-light to-main-purple -z-[1] absolute left-0 top-0 bottom-0 right-0 rounded-xl'>
          <div className="DayAbsoluteContainer top-0 w-full h-full bg-white border-[2px] border-transparent box-border bg-clip-content overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function DayContent({ courses, coursesHours }) {
  return (
    <div className="DayContent relative h-[89%] flex justify-start">
      <div className="absolute inline-grid grid-rows-25 w-full h-full z-10 -top-[2%]">
        {coursesHours}
      </div>
      <div className="absolute inline-grid grid-rows-25 w-full h-full">
        {courses}
      </div>
    </div>
  )
}

function DayName({ name, date }) {
  return (
    <div className="DayName absolute text-center w-full bottom-0">
      <h4 className="text-xs font-normal mt-[0.5rem] text-gray-600 font-dinAlternate translate-y-1">
        {date.toLocaleString("fr-FR", { year: 'numeric', month: '2-digit', day: '2-digit' })}
      </h4>
      <h2 className="text-4xl font-light text-main-purple font-academyLET translate-y-1">
        {name.toUpperCase()}
      </h2>
    </div>
  )
}