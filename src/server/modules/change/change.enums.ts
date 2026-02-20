export enum ChangeActorType {
    USER = 'user',
    SYSTEM = 'system',
    AGENT = 'agent',
}

export enum ChangeSection {
    BITCOIN = 'bitcoin',
    LIGHTNING = 'lightning',
    MINT = 'mint',
    ECASH = 'ecash',
    AI = 'ai',
    SETTINGS = 'settings',
}

export enum ChangeEntityType {
    INFO = 'info',
    QUOTE = 'quote',
    QUOTE_TTL = 'quote_ttl',
    NUT04 = 'nut04',
    NUT05 = 'nut05',
    KEYSET = 'keyset',
    DATABASE = 'database',
}

export enum ChangeAction {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    EXECUTE = 'execute',
}

export enum ChangeStatus {
    SUCCESS = 'success',
    PARTIAL = 'partial',
    ERROR = 'error',
}

export enum ChangeDetailStatus {
    SUCCESS = 'success',
    ERROR = 'error',
}
