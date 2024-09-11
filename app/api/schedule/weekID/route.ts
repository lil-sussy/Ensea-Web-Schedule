import { NextRequest, NextResponse } from "next/server";
import { getWeekID } from "../../../utils";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const dateParam = searchParams.get("date");
	if (!dateParam) {
		return NextResponse.json({ status: 400, message: "Missing date query parameter" }, { status: 400 });
	}
	const decodedDateParam = decodeURIComponent(dateParam);
	const date = new Date(decodedDateParam);
	if (isNaN(date.getTime())) {
		return NextResponse.json({ status: 400, message: "Invalid date format" }, { status: 400 });
	}
	const weekID = getWeekID(date);
	return NextResponse.json({ weekID });
}
