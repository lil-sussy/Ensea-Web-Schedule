import React, { useState } from 'react';
import { Card, DatePicker, Typography, Carousel, Divider } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Row, Col } from "antd";

const { Title } = Typography;

interface DayDisplayProps {
  weekNumber: number;
  schedule: {
    time: string;
    title: string;
    location: string;
    instructor: string;
    color: string;
    duration?: number; // duration in hours, optional
  }[];
}

const DayDisplay: React.FC<DayDisplayProps> = ({ weekNumber, schedule }) => {
  const [currentWeek, setCurrentWeek] = useState(weekNumber);

  const handlePrevWeek = () => {
    setCurrentWeek(currentWeek - 1);
  };

  const handleNextWeek = () => {
    setCurrentWeek(currentWeek + 1);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 13; hour++) {
      slots.push(dayjs().hour(hour).minute(0).format('HH:mm'));
    }
    for (let hour = 13; hour < 20; hour++) {
      slots.push(dayjs().hour(hour).minute(30).format('HH:mm'));
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const skippedSlots = new Set();

  return (
    <div className="px-4 py-4">
      <Carousel afterChange={(current) => setCurrentWeek(weekNumber + current)}>
        <div>
          <div className="bg-[#9d1c1f]/60 py-2 px-2 rounded-tl-3xl rounded-tr-3xl flex justify-between items-center">
            <LeftOutlined onClick={handlePrevWeek} className="text-white text-xl cursor-pointer" />
            <div className="text-center text-white text-xl font-normal mx-4">Semaine {currentWeek}</div>
            <RightOutlined onClick={handleNextWeek} className="text-white text-xl cursor-pointer" />
          </div>
        </div>
      </Carousel>
      <div className="bg-white rounded-bl-3xl rounded-br-3xl p-2">
        {/* Day Title */}
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl text-[#413a3a]">{dayjs().format('dddd').toUpperCase()}</h1>
          <DatePicker defaultValue={dayjs()} className="text-xl text-[#423b3b]" />
        </div>
        <Divider className='my-2'/>

        {/* Hourly Schedule */}
        <div className="border border-gray-300">
          {timeSlots.map((time, index) => {
            if (skippedSlots.has(time)) {
              return null;
            }

            const scheduleItem = schedule.find(item => item.time === time);
            const duration = scheduleItem?.duration || 1;

            if (scheduleItem) {
              for (let i = 1; i < duration; i++) {
                skippedSlots.add(dayjs(time, 'HH:mm').add(i, 'hour').format('HH:mm'));
              }
            }

            return (
              <div key={time} className={`grid grid-cols-12 gap-1 border-b border-gray-300`}>
                {/* Time Column */}
                <div className="col-span-2 border-r border-gray-300 text-center text-md text-black py-2">{time}</div>

                {/* Schedule Column */}
                {scheduleItem ? (
                  <div className={`col-span-10 p-1 ${scheduleItem.color} rounded-lg`}>
                    <h4 className="text-white text-md">{scheduleItem.title}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-white text-md font-medium">{scheduleItem.location}</div>
                      <div className="text-white text-md">{scheduleItem.instructor}</div>
                    </div>
                  </div>
                ) : (
                  <div className="col-span-10 p-1">
                    <div className="text-gray-400 text-md">No Schedule</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DayDisplay;
