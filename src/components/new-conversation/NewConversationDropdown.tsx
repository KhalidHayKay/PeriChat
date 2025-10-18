const NewConversationDropdown = () => {
    // const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
    // const [groupModalIsOpen, setGroupModalIsOpen] = useState(false);
    // const [searchTerm, setSearchTerm] = useState('');
    // const toggleDropdown = () => {
    //     setDropdownIsOpen(!dropdownIsOpen);
    //     if (groupModalIsOpen) setGroupModalIsOpen(false);
    // };
    // const openGroupModal = () => {
    //     setDropdownIsOpen(false);
    //     setGroupModalIsOpen(true);
    // };
    // const handleUserClick = (otherUser: User) => {
    //     router.visit(route('conversation.private', otherUser.id), {
    //     	data: { click: true },
    //     });
    //     console.log('User clicked:', otherUser);
    //     setDropdownIsOpen(false);
    // };
    // const handlePublicGroupJoin = (group: Group) => {
    //     router.visit(route('conversation.group', group.id), {
    //     	data: { click: true },
    //     });
    //     console.log('Joining public group:', group);
    //     setGroupModalIsOpen(false);
    // };
    // const handleGroupCreate = (data: { name: string; members: User[] }) => {
    //     console.log('Creating group:', {
    //         name: data.name,
    //         members: data.members,
    //     });
    //     setGroupModalIsOpen(false);
    // };
    // return (
    //     <>
    //         <Overlay
    //             isVisible={dropdownIsOpen || groupModalIsOpen}
    //             onClose={() => {
    //                 setDropdownIsOpen(false);
    //                 setGroupModalIsOpen(false);
    //             }}
    //         />
    //         <div className='relative z-30'>
    //             <button
    //                 onClick={toggleDropdown}
    //                 className='p-2 hover:bg-secondary rounded-full'
    //             >
    //                 <PenBox className='size-5 text-primary-content' />
    //             </button>
    //             {dropdownIsOpen && (
    // 				<UserList
    // 					searchTerm={{ value: searchTerm, set: setSearchTerm }}
    // 					openGroupModal={openGroupModal}
    // 					handleUserClick={handleUserClick}
    // 				/>
    // 			)}
    // 			{groupModalIsOpen && (
    // 				<CreateGroupModal
    // 					handler={{
    // 						create: handleGroupCreate,
    // 						joinPublic: handlePublicGroupJoin,
    // 					}}
    // 					closeModal={() => setGroupModalIsOpen(false)}
    // 				/>
    // 			)}
    //         </div>
    //     </>
    // );
    return '';
};

export default NewConversationDropdown;
