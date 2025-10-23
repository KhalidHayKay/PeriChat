import { useCallback, useState } from 'react';

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
        // TODO: Implement conversation creation logic
        console.log('User clicked:', otherUser);
        setDropdownIsOpen(false);
    }, []);

    const handlePublicGroupJoin = useCallback((group: Group) => {
        // TODO: Implement group join logic
        console.log('Joining public group:', group);
        setGroupModalIsOpen(false);
    }, []);

    const handleGroupCreate = useCallback(
        (data: { name: string; members: User[] }) => {
            // TODO: Implement group creation logic
            console.log('Creating group:', {
                name: data.name,
                members: data.members,
            });
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
