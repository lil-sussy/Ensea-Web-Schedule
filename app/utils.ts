// https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
function dateDiffInDays(preceding: Date, date: Date) {
	const _MS_PER_DAY = 1000 * 60 * 60 * 24;
	// Discard the time and time-zone information.
	const utc1 = Date.UTC(preceding.getFullYear(), preceding.getMonth(), preceding.getDate());
	const utc2 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

	return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

export function getMondayOfDate(date: Date) {
	const mondayOfTheMonth = date.getDate() - date.getDay() + 1;
	return new Date(new Date(date).setDate(mondayOfTheMonth));
}

export function getWeekDatesByID(weekID: number) {
	const time = (weekID - 1) * 7 * 24 * 60 * 60 * 1000;
	const FIRST_MONDAY_OF_THE_SCHOOL_YEAR = new Date("29 Aug 2022 02:00:00 GMT"); // First monday of first week, France is in GMT+2 zone
	const mondayInTheMonth = new Date(FIRST_MONDAY_OF_THE_SCHOOL_YEAR.getTime() + time);
	const monday = new Date(mondayInTheMonth);
	const week = [monday];
	for (let i = 1; i < 7; i++) {
		const day = new Date(monday.getTime() + 24 * 60 * 60 * 1000 * i);
		week.push(day);
	}
	return week;
}

// https://bobbyhadz.com/blog/javascript-get-monday-of-current-week#:~:text=function%20getMondayOfCurrentWeek()%20%7B%20const%20today,Mon%20Jan%2017%202022%20console.

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const schoolYear = currentMonth >= 6 ? currentYear : currentYear - 1;
const firstSeptember = new Date(`01 Sep ${schoolYear} 02:00:00 GMT`);
const firstMonday = new Date(firstSeptember.setDate(firstSeptember.getDate() - ((firstSeptember.getDay() + 6) % 7)));
const FIRST_MONDAY_OF_THE_SCHOOL_YEAR = firstMonday.getMonth() === 7 ? firstMonday : new Date(`29 Aug ${schoolYear} 02:00:00 GMT`);

export function getWeekID(day: Date) {
	const diffInDay = dateDiffInDays(FIRST_MONDAY_OF_THE_SCHOOL_YEAR, day);
  const diffInWeeks = Math.floor(diffInDay / 7) + 1;
	return diffInWeeks
}

/**
 * https://stackoverflow.com/questions/9045868/javascript-date-getweek
 * Returns the week number for this date.  dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * @param int dowOffset
 * @return int
 */
export function getWeek(today: Date, dowOffset: number) {
	/*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

	dowOffset = typeof dowOffset == "number" ? dowOffset : 0; //default dowOffset to zero
	const newYear = new Date(today.getFullYear(), 0, 1);
	let day = newYear.getDay() - dowOffset; //the day of week the year begins on
	day = day >= 0 ? day : day + 7;
	const daynum = Math.floor((today.getTime() - newYear.getTime() - (today.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1;
	let weeknum;
	//if the year starts before the middle of a week
	if (day < 4) {
		weeknum = Math.floor((daynum + day - 1) / 7) + 1;
		if (weeknum > 52) {
			const nYear = new Date(today.getFullYear() + 1, 0, 1);
			let nday = nYear.getDay() - dowOffset;
			nday = nday >= 0 ? nday : nday + 7;
			/*if the next year starts before the middle of
        the week, it is week #1 of that year*/
			weeknum = nday < 4 ? 1 : 53;
		}
	} else {
		weeknum = Math.floor((daynum + day - 1) / 7);
	}
	return weeknum;
}


export function replacer(key: any, value: any) {
	if (value instanceof Map) {
		return {
			dataType: "Map",
			value: Array.from(value.entries()), // or with spread: value: [...value]
		};
	} else {
		return value;
	}
}

export function reviver(key: any, value: any) {
	if (typeof value === "object" && value !== null) {
		if (value.dataType === "Map") {
			return new Map(value.value);
		}
	}
	return value;
}

export function hashCode(str: string) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	return hash;
}

export const hslToRgba = (hsl: string, alpha: number) => {
	const [h, s, l] = hsl.match(/\d+/g)!.map(Number);
	const a = alpha;

	const sFraction = s / 100;
	const lFraction = l / 100;

	const c = (1 - Math.abs(2 * lFraction - 1)) * sFraction;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = lFraction - c / 2;

	let r = 0,
		g = 0,
		b = 0;

	if (0 <= h && h < 60) {
		r = c;
		g = x;
		b = 0;
	} else if (60 <= h && h < 120) {
		r = x;
		g = c;
		b = 0;
	} else if (120 <= h && h < 180) {
		r = 0;
		g = c;
		b = x;
	} else if (180 <= h && h < 240) {
		r = 0;
		g = x;
		b = c;
	} else if (240 <= h && h < 300) {
		r = x;
		g = 0;
		b = c;
	} else if (300 <= h && h < 360) {
		r = c;
		g = 0;
		b = x;
	}

	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);

	return `rgba(${r}, ${g}, ${b}, ${a})`;
};