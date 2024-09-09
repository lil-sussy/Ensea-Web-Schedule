"use client"

import React from "react";
import { Layout, Menu, Button, Card, DatePicker, Input, Typography } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import DayDisplay from "./components/DayDisplay";
import { AthenaLogo, AthenaTextLogo } from "./icons/icons";

const { Header, Content } = Layout;
const { Title } = Typography;

export default function Dashboard() {
	const weekNumber = 42; // Example week number
	const schedule = [
		{ time: "08:00", title: "CM Microprocesseur", location: "AMPHI", instructor: "Monchal Laurent", color: "bg-blue-500" },
		{ time: "10:00", title: "TD Microprocesseur", location: "A210", instructor: "Monchal Laurent", color: "bg-green-500" },
		{ time: "13:30", title: "TD Analyse de Fourier", location: "A213", instructor: "Nicolas Papazoglou", color: "bg-red-500" },
	];

	return (
		<Layout className="h-screen w-screen bg-[#f0f0f0]">
			<div className="my-10 flex flex-col items-center">
				<AthenaTextLogo width={200} height={100} color="#9d1c1f" />
			</div>
			<Header className="bg-gradient-to-r from-[#9d1c1f] to-[#731422] border-t-8 border-b-8 border-white flex justify-between items-center h-[20rem]">
				<div className="flex items-center gap-4 w-full h-full">
					<AthenaLogo width={300} height={300} color="white" />
					<Input size="large" placeholder="Search for a class" className="bg-[#f1e8e9]/30 focus-within:bg-[#f1e8e9]/60 hover:bg-[#f1e8e9]/50 text-white rounded-3xl border-2 border-white w-9 text-xl w-full" prefix={<SearchOutlined />} />
				</div>
			</Header>
			<DayDisplay weekNumber={weekNumber} schedule={schedule} />
		</Layout>
	);
}