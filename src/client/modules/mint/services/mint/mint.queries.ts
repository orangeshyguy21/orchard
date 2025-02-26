export const MINT_INFO_QUERY = `{
    mint_info{
        name
        pubkey
        version
        description
        description_long
        icon_url
        urls
        time
		contact{
			method
			info
        }
        nuts{
			nut
			disabled
			ttl
			supported
			methods{
				method
				unit
				description
			}
			supported_meta{
				method
				unit
				commands
			}
			cached_endpoints{
				method
				path
			}
        }
  	}
}`;

export const MINT_BALANCES_QUERY = `{
    mint_balances{
        balance
    	keyset
    }
}`;

export const MINT_KEYSETS_QUERY = `{
    mint_keysets{
        active
		derivation_path
		encrypted_seed
		first_seen
		id
		input_fee_ppk
		seed
		seed_encryption_method
		unit
		valid_from
		valid_to
		version
    }
}`;

// export const MINT_PROMISES_QUERY = `{
//     mint_promises{
//         amount
// 		id
// 		b_
// 		c_
// 		dleq_e
// 		dleq_s
// 		created
// 		mint_quote
// 		swap_id
//     }
// }`;

export const MINT_PROMISES_QUERY = `{
    mint_promises(id_keysets: ["008ae94bfbc6d57e", "00583d89ceb3086d"]) {
        amount
		id
		b_
		c_
		dleq_e
		dleq_s
		created
		mint_quote
		swap_id
    }
}`;