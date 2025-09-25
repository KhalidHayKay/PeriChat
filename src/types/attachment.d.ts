interface Attachment {
	file: File;
	url: string;
}

interface ServerAttachment {
	id: string;
	messageId: number;
	name: string;
	mime: string;
	size: number;
	url: string;
}
