import React, { Component }  from 'react';

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";

import SwiperCore, { EffectFlip, Navigation, Pagination } from "swiper";


function WeekSchedule(data) {
    const daysList = [];
    for (let day in data) {
        daysList.push(<DaySchedule day={day} />);
    }
    const styles = {
        focused: {

        },
        sided: {
            transform: 'scale(80%)',
        }
    }
    return (
        <Swiper
            className=" m-5 w-full h-full flex-row justify-center align-center"
            spaceBetween={5}
            slidesPerView={1}
            speed={500}
            loop={false}
            touchRatio={1.5}
            navigation={true}
            effect={"Coverflow"}
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

function DaySchedule(day) {
    let courses = day.courses;
    let divCourses = [];
    for (let course in courses) {
        let courseClasses = "h-full w-full bg-white rounded-xl opacity-75 ";
        courseClasses += "begin-" + course.begin + " end-" + course.end + "";
        divCourses.push(
            <div className={courseClasses}>
                <h3> {course.name} </h3>
                <h4> {course.teachers} </h4>
                <h4> {course.classes} </h4>
                <h4> {course.place} </h4>
            </div>
        );
    }

    return (
        <SwiperSlide className="w-36 h-full backdrop-blur-sm">
            <div className="">
                {courses}
            </div>
        </SwiperSlide>
    );
}