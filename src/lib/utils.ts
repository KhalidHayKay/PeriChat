import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

export const getConversationPreviewText = ({
    conversation,
    currentUserId,
}: {
    conversation: Conversation;
    currentUserId: number;
}) => {
    const hasMessage = Boolean(conversation.lastMessage?.trim());
    const hasAttachments = conversation.lastMessageAttachmentCount > 0;

    if (hasMessage) {
        return conversation.lastMessage;
    }

    if (hasAttachments) {
        return 'Attachment';
    }

    if (conversation.type === 'group') {
        if (conversation.groupOwner?.id === currentUserId) {
            return 'You created this group';
        }

        if (conversation.groupOwner != null) {
            return `${conversation.groupOwner.name ?? 'Someone'} added you to the group`;
        }
    }

    return 'No messages yet';
};
