/* Core Dependencies */
import { Resolver, Query, ResolveField, Parent, Int } from "@nestjs/graphql";
/* Internal Dependencies */
import { MintBalanceService } from "./mintbalance.service";
import { OrchardMintBalance } from "./mintbalance.model";

@Resolver(() => [OrchardMintBalance])
export class MintBalanceResolver {
  constructor(
    private mintBalanceService: MintBalanceService,
  ) {}

  @Query(() => [OrchardMintBalance])
  async mint_balances() : Promise<OrchardMintBalance[]> {
    const outstandings = await this.mintBalanceService.getOutstandingMintBalances();
    const issueds = await this.mintBalanceService.getIssuedMintBalances();
    const redeemeds = await this.mintBalanceService.getRedeemedMintBalances();

    const test = outstandings.map( (balance, index) => {
      let testy = new OrchardMintBalance();
      testy.total_outstanding = balance;
      testy.total_issued = issueds[index];
      testy.total_redeemed = redeemeds[index];
      return testy;
    });

    return test;
   
  }
}


// import { Resolver, Query, ResolveField, Parent } from '@nestjs/graphql';
// import { MintBalance } from './mint-balance.entity'; // Assuming you have defined the entity

// @Resolver(() => [MintBalance]) // Define the resolver for an array of MintBalance objects
// export class MintBalancesResolver {
//   @Query(() => [MintBalance])
//   async mintBalances(): Promise<MintBalance[]> {
//     // Assuming this is where you fetch or simulate fetching your mint balances
//     // For demonstration, let's say we return mock data or a placeholder
//     return [
//       {}, // Empty object for simplicity; in real scenarios, it would contain initial data if needed
//     ];
//   }

//   @ResolveField(() => String) // Adjust the type as necessary (e.g., Int, Float)
//   async total(@Parent() mintBalance: MintBalance): Promise<string> {
//     // Here you make your API call to fetch the 'total' field specifically
//     // For demonstration purposes:
//     return `Total for ${mintBalance.id}`; // Assuming id exists on MintBalance
//   }

//   @ResolveField(() => String) // Adjust the type as necessary (e.g., Int, Float)
//   async outstanding(@Parent() mintBalance: MintBalance): Promise<string> {
//     // API call to fetch 'outstanding'
//     return `Outstanding for ${mintBalance.id}`;
//   }

//   @ResolveField(() => String) // Adjust the type as necessary (e.g., Int, Float)
//   async issued(@Parent() mintBalance: MintBalance): Promise<string> {
//     // API call to fetch 'issued'
//     return `Issued for ${mintBalance.id}`;
//   }
// }


// /* Core Dependencies */
// import { Resolver, Query } from "@nestjs/graphql";
// /* Application Dependencies */
// import { MintKeysetService } from "./mintkeyset.service";
// import { OrchardMintKeyset } from "./mintkeyset.model";

// @Resolver(() => [OrchardMintKeyset])
// export class MintKeysetResolver {
//   constructor(
//     private mintKeysetService: MintKeysetService,
//   ) {}

//   @Query(() => [OrchardMintKeyset])
//   async mint_keysets() : Promise<OrchardMintKeyset[]> {
//     return this.mintKeysetService.getMintKeysets();
//   }
// }
