/* Application Configuration */
import { environment } from '@client/configs/configuration';

export const api = `${environment.api.proxy}/${environment.api.path}`;

export function getApiQuery(query: string) {
  return {
    query: query
  };
}