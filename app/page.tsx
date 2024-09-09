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
		{ time: "08:00", title: "CM Microprocesseur", location: "AMPHI", instructor: "Monchal Laurent", color: "bg-blue-500", duration: 2 },
		{ time: "10:00", title: "TD Microprocesseur", location: "A210", instructor: "Monchal Laurent", color: "bg-green-500", duration: 2 },
		{ time: "13:30", title: "TD Analyse de Fourier", location: "A213", instructor: "Nicolas Papazoglou", color: "bg-red-500", duration: 2 },
	];

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
					<Input size="large" placeholder="Search for a class" className="bg-[#f1e8e9]/30 focus-within:bg-[#f1e8e9]/60 hover:bg-[#f1e8e9]/50 text-white rounded-3xl border-2 border-white text-xl w-full" prefix={<SearchOutlined />} />
				</div>
			</Header>
			<DayDisplay weekNumber={weekNumber} schedule={schedule} />
		</Layout>
	);
}