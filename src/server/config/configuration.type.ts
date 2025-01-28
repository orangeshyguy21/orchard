export type Config = {
  mode : {
    production: boolean;
  },
  server : {
    host: string;
    port: string;
    path: string;
  },
  cashu : {
    database : string;
  }
};