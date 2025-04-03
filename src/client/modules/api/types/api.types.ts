import { OrchardStatus } from "@shared/generated.types";

export type OrchardRes<T> = {
	data: T;
	errors?: { message: string; extensions: { code: number } }[];
}

export type StatusResponse = {
  	status: OrchardStatus;
}