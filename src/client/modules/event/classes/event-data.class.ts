interface EventDataSeed {
    type: 'PENDING' | 'SAVING' | 'SUCCESS' | 'WARNING' | 'ERROR';
    message?: string;
    duration?: number | null;
}

const DURATION = {
    PENDING: null,
    SAVING: null,
    SUCCESS: 3000,
    WARNING: 5000,
    ERROR: 5000
}

export class EventData {

    type: 'PENDING' | 'SAVING' | 'SUCCESS' | 'WARNING' | 'ERROR';
    id: string;
    message?: string;
    created_at: number;
    duration: number | null;
    confirmed: boolean | null;

    constructor(data: EventDataSeed){
        this.type = data.type;
        this.id = crypto.randomUUID();
        this.message = data.message;
        this.created_at = Math.floor(Date.now() / 1000);
        this.duration = data.duration || DURATION[this.type];
        this.confirmed = null;
    }
}