import { useNewConversationModals } from '@/hooks/useNewConversationModals';
import { PenBox } from 'lucide-react';
import CreateGroupModal from './CreateGroupModal';
import Overlay from './Overlay';
import UserList from './UserList';

const NewConversationDropdown = () => {
    const {
        dropdownIsOpen,
        groupModalIsOpen,
        searchTerm,
        setSearchTerm,
        toggleDropdown,
        openGroupModal,
        closeAll,
        handleUserClick,
        handlePublicGroupJoin,
        handleGroupCreate,
    } = useNewConversationModals();

    return (
        <>
            <Overlay
                isVisible={dropdownIsOpen || groupModalIsOpen}
                onClose={closeAll}
            />
            <div className='relative z-30'>
                <button
                    onClick={toggleDropdown}
                    className='p-2 hover:bg-secondary rounded-full transition-colors'
                    aria-label='New conversation'
                >
                    <PenBox className='size-5 text-primary-content' />
                </button>
                {dropdownIsOpen && (
                    <UserList
                        searchTerm={{ value: searchTerm, set: setSearchTerm }}
                        openGroupModal={openGroupModal}
                        handleUserClick={handleUserClick}
                    />
                )}
                {groupModalIsOpen && (
                    <CreateGroupModal
                        handler={{
                            create: handleGroupCreate,
                            joinPublic: handlePublicGroupJoin,
                        }}
                        closeModal={closeAll}
                    />
                )}
            </div>
        </>
    );
};

export default NewConversationDropdown;
