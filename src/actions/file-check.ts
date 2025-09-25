const getMimeType = (attachment: Attachment | ServerAttachment): string => {
	let mime: string = '';

	if ('file' in attachment && attachment.file?.type) {
		mime = attachment.file.type;
	} else if ('mime' in attachment && typeof attachment.mime === 'string') {
		mime = attachment.mime;
	}

	return mime;
};

export const isImage = (attachment: Attachment | ServerAttachment) => {
	const mime = getMimeType(attachment);

	return mime?.split('/')[0].toLowerCase() === 'image';
};

export const isVideo = (attachment: Attachment | ServerAttachment) => {
	const mime = getMimeType(attachment);

	return mime.split('/')[0].toLowerCase() === 'video';
};

export const isAudio = (attachment: Attachment | ServerAttachment) => {
	const mime = getMimeType(attachment);

	return mime.split('/')[0].toLowerCase() === 'audio';
};

export const isAppFile = (attachment: Attachment | ServerAttachment) => {
	const mime = getMimeType(attachment);

	return mime.split('/')[0].toLowerCase() === 'application';
};

export const isPreviewable = (attachment: Attachment | ServerAttachment) => {
	return (
		isImage(attachment) ||
		isVideo(attachment) ||
		isAudio(attachment) ||
		isAppFile(attachment)
	);
};

export const formatBytes = (bytes: number, decimals = 2) => {
	if (bytes === 0) return '0 Byptes';

	let k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	let sizes = ['Bytes', 'KB', 'MB', 'GB'];

	let i = 0;
	let size = bytes;
	while (size >= k) {
		size /= k;
		i++;
	}

	return `${parseFloat(size.toFixed(dm))} ${sizes[i]}`;
};
