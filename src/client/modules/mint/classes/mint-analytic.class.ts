import { OrchardMintAnalytics, MintUnit } from "@shared/generated.types";

export class MintAnalytic implements OrchardMintAnalytics {

	unit: MintUnit;
	amount: number;
	created_time: string;
	operation_count: number;

	constructor(omba: OrchardMintAnalytics) {
		this.unit = omba.unit;
		this.amount = omba.amount;
		this.created_time = omba.created_time;
		this.operation_count = omba.operation_count;
	}
}