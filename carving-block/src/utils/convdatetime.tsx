export function dateToNumber(date: Date): number {
    return date.getTime();
}
    
export function numberToDate(n: number): Date {
    return new Date(n);
}
    
export function convertTimeString(time: Date): string {
    // convert time to format Day, Mmm DD YYYY @ HH:MM AM/PM
    // const weekday = time.toLocaleString("en-US", { weekday: "short" }); // Tue
    const month = time.toLocaleString("en-US", { month: "short" });   // Apr
    const day = String(time.getDate()).padStart(2, "0");               // 28
    const year = time.getFullYear();

    let hours = time.getHours();
    const minutes = String(time.getMinutes()).padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${month} ${day} ${year} @ ${hours}:${minutes} ${ampm}`;
}

export function dateInputToDB(inp: string): number {
    const [datePart, timePart] = inp.split("T");

    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);

    const date = new Date(year, month - 1, day, hour, minute);

    return date.getTime();
}

export function dateDBToRender(inp: number): string {
    return convertTimeString(numberToDate(inp))
}
