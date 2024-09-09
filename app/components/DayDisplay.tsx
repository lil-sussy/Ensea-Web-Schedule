import React from 'react';
import { Card, DatePicker, Typography } from 'antd';
import dayjs from 'dayjs';

const { Title } = Typography;

interface DayDisplayProps {
  weekNumber: number;
  schedule: {
    time: string;
    title: string;
    location: string;
    instructor: string;
    color: string;
  }[];
}

const DayDisplay: React.FC<DayDisplayProps> = ({ weekNumber, schedule }) => {
  return (
    <div className="px-8 py-12">
      {/* Day Header */}
      <div className="bg-[#9d1c1f]/60 py-4 rounded-tl-3xl rounded-tr-3xl flex justify-between items-center">
        <div className="text-center text-white text-6xl font-normal">Semaine {weekNumber}</div>
      </div>
      <div className="bg-white rounded-bl-3xl rounded-br-3xl p-6">
        {/* Day Title */}
        <div className="flex justify-between items-center mb-6">
          <Title className="text-8xl text-[#413a3a]">{dayjs().format('dddd').toUpperCase()}</Title>
          <DatePicker defaultValue={dayjs()} className="text-4xl text-[#423b3b]" />
        </div>

        {/* Hourly Schedule */}
        <div className="grid grid-cols-12 gap-6">
          {/* Time Column */}
          <div className="col-span-2">
            {schedule.map((item) => (
              <div key={item.time} className="text-center text-6xl text-black py-2">
                {item.time}
              </div>
            ))}
          </div>

          {/* Schedule Column */}
          <div className="col-span-10">
            {schedule.map((item) => (
              <Card key={item.time} className={`mb-6 p-4 ${item.color} rounded-3xl`}>
                <Title level={2} className="text-white text-5xl">
                  {item.title}
                </Title>
                <div className="flex justify-between items-center mt-2">
                  <div className="text-white text-6xl font-medium">{item.location}</div>
                  <div className="text-white text-5xl">{item.instructor}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayDisplay;
