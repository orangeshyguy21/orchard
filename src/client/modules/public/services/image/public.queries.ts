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
