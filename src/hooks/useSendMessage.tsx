import { sendMessage } from '@/actions/message';
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
                const res = await sendMessage(
                    messageText,
                    attachments,
                    conversation,
                    (p) => setProgress(p)
                );
                console.log(res);
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
