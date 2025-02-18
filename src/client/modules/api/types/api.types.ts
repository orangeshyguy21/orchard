import { OrchardStatus } from "@shared/generated.types";

export type GQLResponse<T> = {
  data: T;
}

export type StatusResponse = {
  status: OrchardStatus;
}