
// export const MINT_URL_REMOVE_MUTATION = `
// mutation MintUrlRemove($mint_url_update: MintUrlUpdateInput!) {
// 	mint_url_remove(mint_url_update: $mint_url_update) {
// 		url
// 	}
// }`;

export const IMAGE_GET_QUERY = `
query ImageGet($url: String!) {
	public_image(url: $url) {
		data
	}
}`;
