import { OrchardStatus } from "@shared/generated.types";

export type OrchardRes<T> = {
	data: T;
	errors?: { message: string; }[];
}

export type StatusResponse = {
  	status: OrchardStatus;
}