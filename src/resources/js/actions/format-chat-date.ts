import { differenceInCalendarDays, format, parseISO } from 'date-fns';

const FormatChatDate = (date: string) => {
	const dateDifference = differenceInCalendarDays(new Date(), parseISO(date));

	if (dateDifference === 0) {
		return format(date, 'hh:MM aa');
	} else if (dateDifference === 1) {
		return 'Yesterday';
	} else return format(date, 'dd/MM/yyy');
};

export default FormatChatDate;
