import { useCallback, useRef, useState } from 'react';

export const useTempMessages = () => {
    const tempMessagesRef = useRef<Map<number, Message[]>>(new Map());
    const [version, setVersion] = useState(0);

    const forceUpdate = useCallback(() => setVersion((v) => v + 1), []);

    const addTempMessage = useCallback(
        (message: Message) => {
            const existing =
                tempMessagesRef.current.get(message.conversationId) || [];
            tempMessagesRef.current.set(message.conversationId, [
                ...existing,
                message,
            ]);
            forceUpdate();
        },
        [forceUpdate]
    );

    const updateTempMessage = useCallback(
        (tempMessage: Message, updates: Partial<Message>) => {
            const existing =
                tempMessagesRef.current.get(tempMessage.conversationId) || [];
            tempMessagesRef.current.set(
                tempMessage.conversationId,
                existing.map((m) =>
                    m.tempId === tempMessage.tempId ? { ...m, ...updates } : m
                )
            );
            forceUpdate();
        },
        [forceUpdate]
    );

    const removeTempMessage = useCallback(
        (tempMessage: Message) => {
            const existing =
                tempMessagesRef.current.get(tempMessage.conversationId) || [];
            const filtered = existing.filter(
                (m) => m.tempId !== tempMessage.tempId
            );
            if (filtered.length === 0)
                tempMessagesRef.current.delete(tempMessage.conversationId);
            else
                tempMessagesRef.current.set(
                    tempMessage.conversationId,
                    filtered
                );

            forceUpdate();
        },
        [forceUpdate]
    );

    const getTempMessages = useCallback((conversationId: number) => {
        return tempMessagesRef.current.get(conversationId) || [];
    }, []);

    const clearAllTempMessages = useCallback(() => {
        tempMessagesRef.current.clear();
        forceUpdate();
    }, [forceUpdate]);

    return {
        getTempMessages,
        addTempMessage,
        updateTempMessage,
        removeTempMessage,
        clearAllTempMessages,
        version,
    };
};
