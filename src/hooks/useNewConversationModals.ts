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
    handlePublicGroupJoin: (group: Group) => void;
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

    const handlePublicGroupJoin = useCallback(async (group: Group) => {
        const res = await joinGroup(group.id);

        if (res) {
            updateConversations((prev) => [res, ...prev]);
            navigate(routes.app.conversation(res.id));
        }

        setGroupModalIsOpen(false);
    }, []);

    const handleGroupCreate = useCallback(
        async (data: { name: string; members: User[] }) => {
            const reqData = {
                name: data.name,
                members: data.members.map((m) => m.id),
            };

            const res = await createGroup(reqData);

            if (res) {
                navigate(routes.app.conversation(res.data.id));
            }

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
