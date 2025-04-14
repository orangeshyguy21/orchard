export const AI_CHAT_SUBSCRIPTION = `
    subscription AiChat($aiChatInput: AiChatInput!) {
        ai_chat(aiChatInput: $aiChatInput) {
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