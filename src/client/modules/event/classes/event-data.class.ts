interface EventDataSeed {
    type: 'PENDING' | 'SAVING' | 'SUCCESS' | 'WARNING' | 'ERROR';
    message?: string;
    duration?: number;
}

export class EventData {

    type: 'PENDING' | 'SAVING' | 'SUCCESS' | 'WARNING' | 'ERROR';
    message?: string;
    created_at: number;
    duration: number;
    confirmed: boolean;

    constructor(data: EventDataSeed){
        this.type = data.type;
        this.message = data.message;
        this.created_at = Math.floor(Date.now() / 1000);
        this.duration = data.duration || 5000;
        this.confirmed = false;
    }
}