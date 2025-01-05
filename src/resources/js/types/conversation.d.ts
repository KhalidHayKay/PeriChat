interface Conversation {
	blocked_at: string | null; // Can be null or a string representing a timestamp
	created_at: string; // ISO date string
	id: number; // Numeric ID
	is_admin: boolean; // Boolean indicating admin status
	is_group: boolean; // Boolean indicating if it's a group
	is_user: boolean; // Boolean indicating if it's a user
	last_message: string; // Last message text
	last_message_date: string; // Date of the last message
}
