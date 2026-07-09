import { createGroup, joinGroup } from '@/actions/group';
import { routes } from '@/config/routes';
import { useConversationContext } from '@/contexts/ConversationContext';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';

interface UseNewConversationModalsReturn {
    dropdownIsOpen: boolean;
    groupModalIsOpen: boolean;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    toggleDropdown: () => void;
    openGroupModal: () => void;
    closeGroupModal: () => void;
    closeAll: () => void;
    handleUserClick: (otherUser: User) => void;
    handlePublicGroupJoin: (groupId: number) => void;
    handleGroupCreate: (data: { name: string; members: User[] }) => void;
}

export const useNewConversationModals = (): UseNewConversationModalsReturn => {
    const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
    const [groupModalIsOpen, setGroupModalIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { updateConversations } = useConversationContext();

    const navigate = useNavigate();

    const toggleDropdown = useCallback(() => {
        setDropdownIsOpen((prev) => !prev);
        if (groupModalIsOpen) setGroupModalIsOpen(false);
    }, [groupModalIsOpen]);

    const openGroupModal = useCallback(() => {
        setDropdownIsOpen(false);
        setGroupModalIsOpen(true);
    }, []);

    const closeGroupModal = useCallback(() => {
        setGroupModalIsOpen(false);
    }, []);

    const closeAll = useCallback(() => {
        setDropdownIsOpen(false);
        setGroupModalIsOpen(false);
    }, []);

    const handleUserClick = useCallback((otherUser: User) => {
        navigate(`/conversation/new`, {
            state: { otherUser },
        });

        setDropdownIsOpen(false);
    }, []);

    const handlePublicGroupJoin = useCallback(async (groupId: number) => {
        const group = await joinGroup(groupId);
        const conversation: Conversation = {
            id: group.conversationId,
            name: group.name,
            type: 'group',
            typeId: group.id,
            avatar: group.avatar ?? '',
            lastMessage: 'You joined the group',
            lastMessageAttachmentCount: 0,
            lastMessageSenderId: 0,
            lastMessageDate: new Date().toISOString(),
            unreadMessageCount: 0,
            groupMemberIds: group.memberIds,
            groupOwner: group.owner,
        };

        updateConversations((prev) => [conversation, ...prev]);
        navigate(routes.app.conversation(conversation.id));
        setGroupModalIsOpen(false);
    }, []);

    const handleGroupCreate = useCallback(
        async (data: { name: string; members: User[] }) => {
            const group = await createGroup({
                name: data.name,
                member_ids: data.members.map((m) => m.id),
            });
            const conversation: Conversation = {
                id: group.conversationId,
                name: group.name,
                type: 'group',
                typeId: group.id,
                avatar: group.avatar ?? '',
                lastMessage: 'You created this group',
                lastMessageAttachmentCount: 0,
                lastMessageSenderId: 0,
                lastMessageDate: new Date().toISOString(),
                unreadMessageCount: 0,
                groupMemberIds: group.memberIds,
                groupOwner: group.owner,
            };

            updateConversations((prev) => [conversation, ...prev]);
            navigate(routes.app.conversation(conversation.id));
            setGroupModalIsOpen(false);
        },
        []
    );

    return {
        dropdownIsOpen,
        groupModalIsOpen,
        searchTerm,
        setSearchTerm,
        toggleDropdown,
        openGroupModal,
        closeGroupModal,
        closeAll,
        handleUserClick,
        handlePublicGroupJoin,
        handleGroupCreate,
    };
};
