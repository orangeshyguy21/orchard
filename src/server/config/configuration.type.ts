export type Config = {
  mode : {
    production: boolean;
  },
  server : {
    host: string;
    port: string;
    path: string;
    proxy: string | undefined;
    log: string;
  },
  cashu : {
    backend : string;
    api: string;
    database : string;
  }
};