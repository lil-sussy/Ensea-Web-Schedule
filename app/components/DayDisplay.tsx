import React, { useState } from "react";
import { Card, DatePicker, Typography, Carousel, Divider, Alert } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { Row, Col } from "antd";
import { Course } from "../types/types";
import { hashCode, hslToRgba } from "../utils";


const { Title } = Typography;

interface DayDisplayProps {
	dayLabel: string;
	scheduleOfTheDay: Course[];
	changeToDate: (date: Date) => void;
}

const DayDisplay: React.FC<DayDisplayProps> = ({ dayLabel, scheduleOfTheDay, changeToDate }) => {
	const generateTimeSlots = () => {
		const slots = [];
		for (let hour = 8; hour < 13; hour++) {
			slots.push(dayjs().hour(hour).minute(0).format("HH:mm"));
		}
		for (let hour = 13; hour < 20; hour++) {
			slots.push(dayjs().hour(hour).minute(30).format("HH:mm"));
		}
		return slots;
	};

	function generateColor(str: string) {
		const hue = Math.abs(hashCode(str) % 360);
		return `hsl(${hue}, 75%, 50%)`;
	}

	const timeSlots = generateTimeSlots();
	const skippedSlots = new Set();

	if (!scheduleOfTheDay.length || scheduleOfTheDay.length === 0) {
		return <Alert message="No schedule for this day" type="info" />;
	}

	const _Date = () => {
		return <DatePicker defaultValue={dayjs(scheduleOfTheDay[0].courseData.beginDate)} className="text-xl text-[#423b3b]" format="DD/MM/YYYY" onChange={(date) => changeToDate(date.toDate())} />;
	};

	return (
		<div className="bg-white rounded-bl-3xl rounded-br-3xl p-2">
			{/* Day Title */}
			<div className="flex justify-between items-center mb-2">
				<h1 className="text-xl text-[#413a3a]">{dayLabel}</h1>
				<_Date />
			</div>
			<Divider className="my-2" />

			{/* Hourly Schedule */}
			<div className="border border-gray-300">
				{timeSlots.map((time, index) => {
					if (skippedSlots.has(time)) {
						return null;
					}

					const scheduleItem = scheduleOfTheDay.find((item) => dayjs(item.courseData.beginDate).format("HH:mm") === time);
					const duration = scheduleItem ? dayjs(scheduleItem.courseData.endDate).diff(dayjs(scheduleItem.courseData.beginDate), "hour", true) : 1;

					const itemColor = scheduleItem ? hslToRgba(`hsl(${Math.abs(hashCode(scheduleItem.courseData.name) % 360)}, 75%, 50%)`, 0.5) : "#f0f0f0";

					if (scheduleItem) {
						for (let i = 1; i < duration; i++) {
							skippedSlots.add(dayjs(time, "HH:mm").add(i, "hour").format("HH:mm"));
						}
					}
          if (scheduleItem?.courseData.teachers[0].length == 0) {
             scheduleItem?.courseData.teachers.shift();
          }
						return (
							<div key={time} className={`grid grid-cols-12 gap-1 border-b border-gray-300`}>
								{/* Time Column */}
								<div className="col-span-2 border-r border-gray-300 text-center text-md text-black py-2" style={{ gridRow: `span ${Math.ceil(duration)}` }}>
									{time}
								</div>

								{/* Schedule Column */}
								{scheduleItem ? (
									<div className="col-span-10 p-1 rounded-lg font-['Lexend_Deca']" style={{ backgroundColor: itemColor, gridRow: `span ${Math.ceil(duration)}`, height: `${Math.ceil(duration) * 3}rem`, maxHeight: `${Math.ceil(duration) * 3}rem` }}>
										<h4 className="text-white text-md h-[20%] font-['Lexend_Deca'] overflow-y-scroll">{scheduleItem.courseData.name}</h4>
										<Divider className="bg-white my-1 h-0.5" />
										<div className="flex justify-between items-center mt-2 h-[60%] gap-2">
											<div className="overflow-y-scroll h-full min-w-[20%] max-w-[30%]">
												<div className="text-white text-xl font-medium font-bold leading-2">{scheduleItem.courseData.locations.join(", ")}</div>
											</div>
											<div className="overflow-y-scroll h-full">
												<div className="scroller-container text-white text-md">{scheduleItem.courseData.teachers.join(", ")}</div>
											</div>
										</div>
									</div>
								) : (
									<div className="col-span-10 p-1" style={{ gridRow: "span 1" }}>
										<div className="text-gray-400 text-md">No Schedule</div>
									</div>
								)}
							</div>
						);
				})}
			</div>
		</div>
	);
};

export default DayDisplay;
