import { useCallback, useRef } from 'react';

export const useTempMessages = () => {
    const tempMessagesRef = useRef<Map<number, Message[]>>(new Map());

    const addTempMessage = useCallback((message: Message) => {
        const existing =
            tempMessagesRef.current.get(message.conversationId) || [];
        tempMessagesRef.current.set(message.conversationId, [
            ...existing,
            message,
        ]);
    }, []);

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
        },
        []
    );

    const removeTempMessage = useCallback((tempMessage: Message) => {
        const existing =
            tempMessagesRef.current.get(tempMessage.conversationId) || [];
        const filtered = existing.filter(
            (m) => m.tempId !== tempMessage.tempId
        );
        if (filtered.length === 0)
            tempMessagesRef.current.delete(tempMessage.conversationId);
        else tempMessagesRef.current.set(tempMessage.conversationId, filtered);
    }, []);

    const getTempMessages = useCallback((conversationId: number) => {
        return tempMessagesRef.current.get(conversationId) || [];
    }, []);

    const clearAllTempMessages = useCallback(() => {
        tempMessagesRef.current.clear();
    }, []);

    return {
        getTempMessages,
        addTempMessage,
        updateTempMessage,
        removeTempMessage,
        clearAllTempMessages,
    };
};
