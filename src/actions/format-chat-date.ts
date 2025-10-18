import {
    differenceInCalendarDays,
    differenceInCalendarYears,
    format,
    parseISO,
} from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import moment from 'moment-timezone';

const FormatChatDate = (date: string) => {
    const dateDifference = differenceInCalendarDays(new Date(), parseISO(date));
    const yearDifference = differenceInCalendarYears(
        new Date(),
        parseISO(date)
    );

    const userTimezone = moment.tz.guess();
    const localTime = toZonedTime(date, userTimezone);

    if (dateDifference === 0) {
        return format(localTime, 'hh:mm aa');
    } else if (dateDifference === 1) {
        return 'Yesterday';
    } else if (yearDifference === 0) {
        return format(localTime, 'dd/MM');
    } else return format(localTime, 'dd/MM/yyy');
};

export default FormatChatDate;
