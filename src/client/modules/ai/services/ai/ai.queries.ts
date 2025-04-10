export const AI_CHAT_SUBSCRIPTION = `
    subscription AiChat($aiChatInput: AiChatInput!) {
        ai_chat(aiChatInput: $aiChatInput) {
            model
            message {
                role
                content
            }
            done
            done_reason
        }
    }
`;