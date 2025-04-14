
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