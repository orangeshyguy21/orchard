
export const UpdateMintNameTool = {
    'type': 'function',
    'function': {
        'name': 'MINT_NAME_UPDATE',
        'description': 'This tool allows you to update the name of the mint.',
        'parameters': {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "description": "The name of the mint"
                },
            },
            "required": ["name"]
        },
    },
};

export const UpdateMintMotdTool = {
    'type': 'function',
    'function': {
        'name': 'MINT_MOTD_UPDATE',
        'description': 'This tool allows you to update the message of the day of the mint. This is sometimes referred to as the "MOTD" or "Message of the Day".',
        'parameters': {
            "type": "object",
            "properties": {
                "motd": {
                    "type": "string",
                    "description": "The message of the day of the mint"
                },
            },
            "required": ["motd"]
        },
    },
};