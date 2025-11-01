import { useCallback, useRef } from 'react';

export const useTempMessages = () => {
    const tempMessagesRef = useRef<Map<number, Message[]>>(new Map());

    const addTempMessage = useCallback(
        (conversationId: number, message: Message) => {
            const existing = tempMessagesRef.current.get(conversationId) || [];
            tempMessagesRef.current.set(conversationId, [...existing, message]);
        },
        []
    );

    const updateTempMessage = useCallback(
        (conversationId: number, tempId: number, updates: Partial<Message>) => {
            const existing = tempMessagesRef.current.get(conversationId) || [];
            tempMessagesRef.current.set(
                conversationId,
                existing.map((m) =>
                    m.tempId === tempId ? { ...m, ...updates } : m
                )
            );
        },
        []
    );

    const removeTempMessage = useCallback(
        (conversationId: number, tempId: number) => {
            const existing = tempMessagesRef.current.get(conversationId) || [];
            const filtered = existing.filter((m) => m.tempId !== tempId);
            if (filtered.length === 0)
                tempMessagesRef.current.delete(conversationId);
            else tempMessagesRef.current.set(conversationId, filtered);
        },
        []
    );

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
