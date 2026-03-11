/** Callback for handling incoming user messages from any vendor */
export type IncomingMessageHandler = (chat_id: string, user_id: string, text: string) => Promise<void>;
