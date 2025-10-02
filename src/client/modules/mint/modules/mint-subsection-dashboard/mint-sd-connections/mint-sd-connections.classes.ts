export class Connection {
	url: string;
	displayed_url: string;

	constructor(url: string, displayed_url: string) {
		this.url = url;
		this.displayed_url = displayed_url;
	}
}
