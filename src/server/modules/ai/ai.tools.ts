
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

export const UpdateMintDescriptionTool = {
    'type': 'function',
    'function': {
        'name': 'MINT_DESCRIPTION_UPDATE',
        'description': 'This tool allows you to update the description of the mint.',
        'parameters': {
            "type": "object",
            "properties": {
                "description": {
                    "type": "string",
                    "description": "The description of the mint"
                },
            },
            "required": ["description"]
        },
    },
};

export const UpdateMintIconUrlTool = {
    'type': 'function',
    'function': {
        'name': 'MINT_ICON_URL_UPDATE',
        'description': 'This tool allows you to update the icon url of the mint.',
        'parameters': {
            "type": "object",
            "properties": {
                "icon_url": {
                    "type": "string",
                    "description": "The public url that contains the icon of the mint"
                },
            },
            "required": ["icon_url"]
        },
    },
};

export const UpdateMintDescriptionLongTool = {
    'type': 'function',
    'function': {
        'name': 'MINT_DESCRIPTION_LONG_UPDATE',
        'description': 'This tool allows you to update the long description of the mint.',
        'parameters': {
            "type": "object",
            "properties": {
                "description_long": {
                    "type": "string",
                    "description": "The long description of the mint"
                },
            },
            "required": ["description_long"]
        },
    },
};

export const UpdateMintMotdTool = {
    'type': 'function',
    'function': {
        'name': 'MINT_MOTD_UPDATE',
        'description': 'This tool allows you to update the message of the day of the mint. This is sometimes referred to as the "MOTD" or "Message of the Day". This is commonly used to update customers with important information about the mint.',
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

export const AddMintUrlTool = {
    'type': 'function',
    'function': {
        'name': 'MINT_URL_ADD',
        'description': 'This tool allows you to add a new url used to access the mint.',
        'parameters': {
            "type": "object",
            "properties": {
                "url": {
                    "type": "string",
                    "description": "The url of the mint"
                },
            },
            "required": ["url"]
        },
    },
};

export const UpdateMintUrlTool = {
    'type': 'function',
    'function': {
        'name': 'MINT_URL_UPDATE',
        'description': 'This tool allows you to update one of the urls used to access the mint.',
        'parameters': {
            "type": "object",
            "properties": {
                "old_url": {
                    "type": "string",
                    "description": "The mint url being updated"
                },
                "url": {
                    "type": "string",
                    "description": "The new version of the url"
                },
            },
            "required": ["old_url", "url"]
        },
    },
};

export const RemoveMintUrlTool = {
    'type': 'function',
    'function': {
        'name': 'MINT_URL_REMOVE',
        'description': 'This tool allows you to remove one of the urls used to access the mint.',
        'parameters': {
            "type": "object",
            "properties": {
                "url": {
                    "type": "string",
                    "description": "The url of the mint"
                },
            },
            "required": ["url"]
        },
    },
};

export const AddMintContactTool = {
    'type': 'function',
    'function': {
        'name': 'MINT_CONTACT_ADD',
        'description': 'This tool allows you to add new contact information to the mint.',
        'parameters': {
            "type": "object",
            "properties": {
                "method": {
                    "type": "string",
                    "enum": ["email", "nostr", "twitter"],
                    "description": "The method of contact"
                },
                "info": {
                    "type": "string",
                    "description": "The information needed to contact the mint via the method specified"
                },
            },
            "required": ["method", "info"]
        },
    },
};

export const UpdateMintContactTool = {
    'type': 'function',
    'function': {
        'name': 'MINT_CONTACT_UPDATE',
        'description': 'This tool allows you to update one of the contacts from the mint. You must provide the old method and info before the update.',
        'parameters': {
            "type": "object",
            "properties": {
                "old_method": {
                    "type": "string",
                    "enum": ["email", "nostr", "twitter"],
                    "description": "The method of contact before the update"
                },
                "old_info": {
                    "type": "string",
                    "description": "The information of the contact before the update"
                },
                "method": {
                    "type": "string",
                    "enum": ["email", "nostr", "twitter"],
                    "description": "The new method of contact"
                },
                "info": {
                    "type": "string",
                    "description": "The new information needed to contact the mint via the new method specified"
                },
            },
            "required": ["old_method", "old_info", "method", "info"]
        },
    },
};

export const RemoveMintContactTool = {
    'type': 'function',
    'function': {
        'name': 'MINT_CONTACT_REMOVE',
        'description': 'This tool allows you to remove one of the contacts from the mint.',
        'parameters': {
            "type": "object",
            "properties": {
                "method": {
                    "type": "string",
                    "enum": ["email", "nostr", "twitter"],
                    "description": "The method of contact"
                },
                "info": {
                    "type": "string",
                    "description": "The information needed to contact the mint via the method specified"
                },
            },
            "required": ["method", "info"]
        },
    },
};