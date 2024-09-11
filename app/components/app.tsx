"use client";

import React, { useState } from "react";
import { Layout, Input, AutoComplete, Carousel, Spin, Alert } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import DayDisplay from "./DayDisplay";
import { AthenaLogo, AthenaTextLogo } from "../icons/icons";
import { fetchSchedule, fetchWeekID } from "../request";
import { getUserScheduleSetting, postUserScheduleSetting } from "../request";

import type { Schedule } from "../types/types";
import type { CarouselRef } from "antd/es/carousel";

const { Header } = Layout;

interface ClassOption {
	value: string;
	label: string;
}

interface DashboardProps {
	initialWeekID?: number;
}

export default function Dashboard({ initialWeekID = 3 }: DashboardProps) {
	const [searchResults, setSearchResults] = useState<ClassOption[]>([]);
	const [selectedClass, setSelectedClass] = useState<ClassOption | null>(null);
	const [classesID, setClassesID] = useState<ClassOption[]>([]);
	const [currentScheduleWeeks, setCurrentScheduleWeeks] = useState<Schedule["weeks"] | null>(null);
	const [currentWeekID, setCurrentWeekID] = useState(initialWeekID);
	const [weekOffset, setWeekOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const dayCarouselRef = React.useRef<CarouselRef>(null);
  const weekCarouselRef = React.useRef<CarouselRef>(null);
  const [initialDayIndex, setInitialDayIndex] = useState(0);
  const [initialWeekIndex, setInitialWeekIndex] = useState(0);

	React.useEffect(() => {
		const fetchClassesID = async () => {
			try {
				const response = await fetch("/api/classes");
				const data = await response.json();
				const classesIDList:ClassOption[] = data.classesID.map(([key, val]: [string, string]) => ({ value: String(val), label: String(key) }));
				setClassesID(classesIDList);
				setSearchResults(classesIDList);
        getUserScheduleSetting()
					.then((classID) => {
						if (classID) {
							const classOption = classesIDList.find((option) => option.value === classID) || null;
							setSelectedClass(classOption);
              setSearchTerm(classOption?.label || "");
						}
					})
					.catch((error) => {
						console.error("Error getting user schedule setting:", error);
					});
			} catch (error) {
				console.error("Error fetching classes ID:", error);
			}
		};

		fetchClassesID();
	}, []);

	React.useEffect(() => {
		function reviver(key: any, value: any) {
			// Used to parse map from json stringified
			if (typeof value === "object" && value !== null) {
				if (value.dataType === "Map") {
					return new Map(value.value);
				}
			}
			return value;
		}

		if (selectedClass) {
			fetchSchedule(selectedClass.value)
				.then((data) => {
					const schedule = JSON.parse(data, reviver);
					setCurrentScheduleWeeks(schedule.weeks as Schedule["weeks"]);
				})
				.catch((error) => {
					console.error("Error fetching schedule:", error);
				});
			postUserScheduleSetting(`${selectedClass.value}`);
		}
	}, [selectedClass]);

	React.useEffect(() => {
		if (!currentScheduleWeeks) return;
		setWeekOffset(Array.from(currentScheduleWeeks.keys()).sort((a, b) => a - b)[0]);
	}, [currentScheduleWeeks]);

  React.useEffect(() => {
    changeToDate(new Date());
  }, [weekOffset]);

	const handleSearch = (label: string) => {
		if (label) {
			const results = classesID.filter((option) => option.label.toLowerCase().includes(label.toLowerCase()));
			setSearchResults(results);
		} else {
			setSearchResults([]);
		}
	};

  const changeToDate = (date: Date) => {
    fetchWeekID(date).then((weekID) => {
      setCurrentWeekID(weekID);
      weekCarouselRef.current?.goTo(weekID - weekOffset);
      setInitialWeekIndex(weekID - weekOffset);
      const dayOfWeek = date.getDay() - 1;
      dayCarouselRef.current?.goTo(dayOfWeek);
      setInitialDayIndex(dayOfWeek);
    }).catch((error) => {
      console.error("Error fetching week ID:", error);
    })
  }

	const handleSelect = (value: string, option: ClassOption) => {
		setSelectedClass(option);
    setSearchTerm(option.label);
	};
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

	const handleWeekSwipe = (current: number) => {
		setCurrentWeekID((prevWeekID) => {
      const newWeekID = current + weekOffset;
      if (newWeekID == prevWeekID)
        return newWeekID;
      if (newWeekID - prevWeekID > 0) {
        dayCarouselRef.current?.goTo(0); // Go to Monday
      } else {
        dayCarouselRef.current?.goTo(4); // Go to Friday
      }
      return newWeekID;
    });
	};

	return (
		<Layout className="h-screen w-screen bg-[#f0f0f0]">
			<div className="my-4 flex flex-col items-center">
				<AthenaTextLogo width={100} height={20} color="#9d1c1f" />
			</div>
			<Header className="bg-gradient-to-r from-[#9d1c1f] to-[#731422] border-t-4 border-b-4 border-white flex justify-between items-center h-[7rem] relative">
				<div className="flex items-center gap-4 w-full h-full">
					<div className="absolute -left-16 top-4">
						<AthenaLogo width={200} height={100} color="white" />
					</div>
					<AutoComplete options={searchResults} onSearch={handleSearch} onSelect={handleSelect} style={{ width: "100%" }} value={searchTerm}>
						<Input value={searchTerm} onChange={(e) => handleSearchChange(e)} size="large" placeholder="Search for a class" className="bg-[#f1e8e9]/30 focus-within:bg-[#f1e8e9]/60 hover:bg-[#f1e8e9]/50 text-white rounded-3xl border-2 border-white text-xl w-full" prefix={<SearchOutlined />} />
					</AutoComplete>
				</div>
			</Header>
			<div className="px-4 py-4">
				<WeekSelectorCarousel currentScheduleWeeks={currentScheduleWeeks} currentWeekID={currentWeekID} handleWeekSwipe={handleWeekSwipe} ref={weekCarouselRef} initialWeekIndex={initialWeekIndex} />
				<DayCarousel currentScheduleWeeks={currentScheduleWeeks} currentWeekID={currentWeekID} ref={dayCarouselRef} changeToDate={changeToDate} initialDayIndex={initialDayIndex} />
			</div>
		</Layout>
	);
}

interface DayCarouselProps {
	currentScheduleWeeks: Schedule["weeks"] | null;
	currentWeekID: number;
	changeToDate: (date: Date) => void;
	initialDayIndex: number;
}

const DayCarousel = React.forwardRef<CarouselRef, DayCarouselProps>(
	({ currentScheduleWeeks, currentWeekID, changeToDate, initialDayIndex }, ref) => {

		React.useEffect(() => {
			if (ref && (ref as React.RefObject<CarouselRef>).current) {
				(ref as React.RefObject<CarouselRef>).current!.goTo(initialDayIndex);
			}
		}, [initialDayIndex, ref]);

		if (!currentScheduleWeeks) {
			return (
				<div className="flex justify-center items-center h-full">
					<Alert
						message={
							<>
								<Spin size="small" /> Loading schedule...
							</>
						}
						type="info"
						showIcon
					/>
				</div>
			);
		}

		if (!currentScheduleWeeks.get(currentWeekID)) {
			return (
				<div className="flex justify-center items-center h-full">
					<Alert message="No schedule for this week" type="info" showIcon />
				</div>
			);
		}

		const frenchWeekDays = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
		if (currentScheduleWeeks!.get(currentWeekID)!.has("Samedi")) {
			frenchWeekDays.push("Samedi");
		}
		if (currentScheduleWeeks!.get(currentWeekID)!.has("Dimanche")) {
			frenchWeekDays.push("Dimanche");
		}

		return (
			<Carousel draggable ref={ref} initialSlide={initialDayIndex} dotPosition="top">
				{frenchWeekDays.map((dayLabel, index) => (
					<div key={index}>
						<DayDisplay scheduleOfTheDay={currentScheduleWeeks!.get(currentWeekID)!.get(dayLabel) || []} dayLabel={dayLabel} changeToDate={changeToDate} />
					</div>
				))}
			</Carousel>
		);
	}
);

DayCarousel.displayName = "DayCarousel";

interface WeekSelectorCarouselProps {
	currentScheduleWeeks: Schedule["weeks"] | null;
	currentWeekID: number;
	handleWeekSwipe: (current: number) => void;
	initialWeekIndex: number;
}

const WeekSelectorCarousel = React.forwardRef<CarouselRef, WeekSelectorCarouselProps>(
	({ currentScheduleWeeks, currentWeekID, handleWeekSwipe, initialWeekIndex }, ref) => {
		React.useEffect(() => {
			if (ref && (ref as React.RefObject<CarouselRef>).current) {
				(ref as React.RefObject<CarouselRef>).current!.goTo(initialWeekIndex);
			}
		}, [initialWeekIndex, ref]);

		if (!currentScheduleWeeks) {
			return (
				<div className="flex justify-center items-center h-full">
					<Alert
						message={
							<>
								<Spin size="small" /> Loading schedule...
							</>
						}
						type="info"
						showIcon
					/>
				</div>
			);
		}

		return (
			<Carousel draggable afterChange={(current) => handleWeekSwipe(current)} dots={false} arrows initialSlide={initialWeekIndex} ref={ref}>
				{Array.from(currentScheduleWeeks.keys())
					.sort((a, b) => a - b)
					.map((weekID, index) => (
						<div key={index}>
							<div className="bg-[#9d1c1f]/60 py-2 px-2 rounded-tl-3xl rounded-tr-3xl flex justify-between items-center">
								<div className="text-center text-white text-xl font-normal mx-4">Semaine {weekID}</div>
							</div>
						</div>
					))}
			</Carousel>
		);
	}
);

WeekSelectorCarousel.displayName = "WeekSelectorCarousel";
