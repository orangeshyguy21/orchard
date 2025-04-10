import { OrchardStatus } from "@shared/generated.types";

export type OrchardRes<T> = {
	data: T;
	errors?: { message: string; extensions: { code: number } }[];
}

export type OrchardWsRes<T> = {
	type: string;
	payload?: {
		data: T;
	};
	id?: string;
};

export type StatusResponse = {
  	status: OrchardStatus;
}