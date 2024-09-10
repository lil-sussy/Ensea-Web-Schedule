"use client";

import React, { useState } from "react";
import { Layout, Input, AutoComplete, Carousel, Spin, Alert } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import DayDisplay from "./DayDisplay";
import { AthenaLogo, AthenaTextLogo } from "../icons/icons";
import { fetchSchedule } from "../request";
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


	React.useEffect(() => {
		const fetchClassesID = async () => {
			try {
				const response = await fetch("/api/classes");
				const data = await response.json();
				const classesIDList = data.classesID.map(([key, val]: [string, string]) => ({ value: val, label: key }));
				setClassesID(classesIDList);
				setSearchResults(classesIDList);
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
		}
	}, [selectedClass]);

  React.useEffect(() => {
    if (!currentScheduleWeeks)
      return
    setWeekOffset(Array.from(currentScheduleWeeks.keys()).sort((a, b) => a - b)[0]);
  }, [currentScheduleWeeks]);

	const handleSearch = (label: string) => {
		if (label) {
			const results = classesID.filter((option) => option.label.toLowerCase().includes(label.toLowerCase()));
			setSearchResults(results);
		} else {
			setSearchResults([]);
		}
	};

	const handleSelect = (value: string, option: ClassOption) => {
		setSelectedClass(option);
	};

	const handlePrevWeek = () => {
		setCurrentWeekID(currentWeekID - 1);
	};

	const handleNextWeek = () => {
		setCurrentWeekID(currentWeekID + 1);
	};

	const handleWeekSwipe = (current: number) => {
		setCurrentWeekID(current + weekOffset);
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
					<AutoComplete options={searchResults} onSearch={handleSearch} onSelect={handleSelect} style={{ width: "100%" }}>
						<Input size="large" placeholder="Search for a class" className="bg-[#f1e8e9]/30 focus-within:bg-[#f1e8e9]/60 hover:bg-[#f1e8e9]/50 text-white rounded-3xl border-2 border-white text-xl w-full" prefix={<SearchOutlined />} />
					</AutoComplete>
				</div>
			</Header>
			<div className="px-4 py-4">
				<WeekSelectorCarousel currentScheduleWeeks={currentScheduleWeeks} currentWeekID={currentWeekID} handleWeekSwipe={handleWeekSwipe} />
				<DayCarousel currentScheduleWeeks={currentScheduleWeeks} currentWeekID={currentWeekID} />
			</div>
		</Layout>
	);
}

interface DayCarouselProps {
	currentScheduleWeeks: Schedule["weeks"] | null;
	currentWeekID: number;
}

const DayCarousel = ({ currentScheduleWeeks, currentWeekID }: DayCarouselProps) => {
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
		<Carousel draggable>
			{frenchWeekDays.map((dayLabel, index) => (
				<div key={index}>
					<DayDisplay scheduleOfTheDay={currentScheduleWeeks!.get(currentWeekID)!.get(dayLabel) || []} dayLabel={dayLabel} />
				</div>
			))}
		</Carousel>
	);
};

interface WeekSelectorCarouselProps {
	currentScheduleWeeks: Schedule["weeks"] | null;
	currentWeekID: number;
	handleWeekSwipe: (current: number) => void;
}

const WeekSelectorCarousel = ({ currentScheduleWeeks, handleWeekSwipe }: WeekSelectorCarouselProps) => {
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
		<Carousel draggable afterChange={(current) => handleWeekSwipe(current)} dots={false} arrows initialSlide={0}>
			{Array.from(currentScheduleWeeks.keys())
				.sort((a, b ) => a - b)
				.map((weekID, index) => (
					<div key={index}>
						<div className="bg-[#9d1c1f]/60 py-2 px-2 rounded-tl-3xl rounded-tr-3xl flex justify-between items-center">
							<div className="text-center text-white text-xl font-normal mx-4">Semaine {weekID}</div>
						</div>
					</div>
				))}
		</Carousel>
	);
};