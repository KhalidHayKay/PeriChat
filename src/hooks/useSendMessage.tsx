import { sendMessage } from '@/actions/message';
import { ConversationTypeEnum } from '@/enums/enums';
import { useCallback, useState } from 'react';

export const useSendMessage = () => {
    const [sending, setSending] = useState(false);
    const [progress, setProgress] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const send = useCallback(
        async (
            messageText: string,
            attachments: Attachment[],
            conversation: Conversation
        ) => {
            setSending(true);
            setError(null);
            setProgress(null);

            try {
                const data = new FormData();

                attachments.forEach((file) =>
                    data.append('attachments[]', file.file)
                );

                data.append('message', messageText);

                if (conversation.type === ConversationTypeEnum.PRIVATE) {
                    data.append('receiver_id', `${conversation.typeId}`);
                } else if (conversation.type === ConversationTypeEnum.GROUP) {
                    data.append('group_id', `${conversation.typeId}`);
                }

                const res = await sendMessage(data, conversation.id, (p) =>
                    setProgress(p)
                );
                return res;
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to send message'
                );
                throw err;
            } finally {
                setSending(false);
            }
        },
        []
    );

    return { send, sending, progress, error };
};
