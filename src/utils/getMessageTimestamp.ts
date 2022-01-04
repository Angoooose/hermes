export default function getMessageTimestamp(messageDate: Date) {
    const currentDate = new Date();;

    let messageDay: string = '';
    if (messageDate.getDate() === currentDate.getDate()) {
        messageDay = 'Today';
    } else if (messageDate.getDate() === currentDate.getDate() - 1) {
        messageDay = 'Yesterday';
    } else {
        messageDay = `${messageDate.getMonth()}/${messageDate.getDate()}/${messageDate.getFullYear()}`;
    }

    let messageTime = formatAMPM(messageDate);
    return `${messageDay} @ ${messageTime}`;
}

function formatAMPM(date: Date) {
    let hours = date.getHours();
    let minutes = date.getMinutes() as (string|number);
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+ minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}