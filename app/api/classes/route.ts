import { NextRequest, NextResponse } from "next/server";
import { classesID, classList, classTree } from "../../types/onlineAdeObjects";

export async function GET(request: NextRequest) {
	try {
		return NextResponse.json({ classesID: Array.from(classesID.entries()) }, { status: 200 });
	} catch (error) {
		console.error("Error fetching classes ID:", error);
		return NextResponse.json({ message: "Error fetching classes ID" }, { status: 500 });
	}
}
