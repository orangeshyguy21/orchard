export const AI_CHAT_SUBSCRIPTION = `
    subscription AiChat($ai_chat: AiChatInput!) {
        ai_chat(ai_chat: $ai_chat) {
            model
            message {
                role
                content
                tool_calls {
                    function {
                        name
                        arguments
                    }
                }
            }
            done
            done_reason
        }
    }
`;