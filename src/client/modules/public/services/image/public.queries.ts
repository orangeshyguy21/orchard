export const PUBLIC_IMAGE_GET_QUERY = `
query PublicImageGet($url: String!) {
	public_image(url: $url) {
		data
	}
}`;

export const PUBLIC_URLS_GET_QUERY = `
query PublicUrlsGets($urls: [String!]!) {
	public_urls(urls: $urls) {
		url
		status
		ip_address
		has_data
	}
}`;

export const PUBLIC_PORTS_GET_QUERY = `
query PublicPortsGet($targets: [PublicPortInput!]!) {
	public_ports(targets: $targets) {
		host
		port
		reachable
		error
		latency_ms
	}
}`;
