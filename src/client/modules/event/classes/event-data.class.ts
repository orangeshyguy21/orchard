interface EventDataSeed {
    type?: 'DEFAULT' | 'SUCCESS' | 'ERROR';
	icon?: string;
    message: string;
    duration?: number;
}

export class EventData {

    type: 'DEFAULT' | 'SUCCESS' | 'ERROR';
	icon?: string;
    message: string;
    created_at: number;
    duration: number;

    constructor(data: EventDataSeed){
        this.type = data.type || 'DEFAULT';
        this.icon = data.icon || this.getTypedIcon();
        this.message = data.message;
        this.created_at = Math.floor(Date.now() / 1000);
        this.duration = data.duration || 5000;
    }

    private getTypedIcon(): string {
        switch(this.type){
            case 'SUCCESS':
                return 'check_circle';
            case 'ERROR':
                return 'error';
            default:
                return '';
        }
    }
}
