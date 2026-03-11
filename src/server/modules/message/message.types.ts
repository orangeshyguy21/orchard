/** Event name constant for incoming user messages */
export const MESSAGE_INCOMING_EVENT = 'message.incoming';

/** Event name constant for conversation reset requests */
export const MESSAGE_RESET_EVENT = 'message.reset';

/** Payload emitted when a user sends a message via any vendor */
export interface IncomingMessagePayload {
	chat_id: string;
	user_id: string;
	text: string;
}

/** Payload emitted when a user requests a conversation reset */
export interface ResetMessagePayload {
	chat_id: string;
	user_id: string;
}
