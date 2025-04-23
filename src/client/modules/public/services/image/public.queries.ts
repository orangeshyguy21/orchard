
// export const MINT_URL_REMOVE_MUTATION = `
// mutation MintUrlRemove($mint_url_update: MintUrlUpdateInput!) {
// 	mint_url_remove(mint_url_update: $mint_url_update) {
// 		url
// 	}
// }`;

export const PUBLIC_IMAGE_GET_QUERY = `
query PublicImageGet($url: String!) {
	public_image(url: $url) {
		data
	}
}`;
