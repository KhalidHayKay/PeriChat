import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

export const normalizeAttachment = (
    attachment: Attachment | ServerAttachment
) => {
    const clientFile = 'file' in attachment ? attachment.file : undefined;

    const name =
        'name' in attachment ? attachment.name : (clientFile?.name ?? '');
    const mime =
        'mime' in attachment ? attachment.mime : (clientFile?.type ?? '');
    const size =
        'size' in attachment ? attachment.size : (clientFile?.size ?? 0);
    const url =
        attachment.url ?? (clientFile ? URL.createObjectURL(clientFile) : '');

    return {
        ...attachment,
        name,
        mime,
        size,
        url,
    };
};
