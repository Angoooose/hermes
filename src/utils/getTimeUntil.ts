export default function getTimeUntil(date: number): string {
    const untilDate = new Date(date);
    const currentDate = new Date();

    const timeBetween = untilDate.getTime() - currentDate.getTime();
    const minutes = Math.floor(timeBetween / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'}`;
    return `${hours} hour${hours === 1 ? '' : 's'}`;
}